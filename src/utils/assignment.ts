import * as d3 from 'd3';
import type { AssignmentResult, CountyNode, Team } from '../types';

// Voronoi-based assignment with area balancing:
// Start with geographic Voronoi (ensures contiguity) then rebalance areas
export function assignCountiesToTeams(
  counties: CountyNode[],
  teams: Team[],
): AssignmentResult {
  if (teams.length === 0 || counties.length === 0) {
    return { countyIdToTeamId: new Map(), teamIdToArea: new Map(), totalArea: 0 };
  }

  // Validate that all counties have required properties
  for (const county of counties) {
    if (!county.centroid || !Array.isArray(county.centroid) || county.centroid.length !== 2) {
      console.error('Invalid county centroid:', county);
      return { countyIdToTeamId: new Map(), teamIdToArea: new Map(), totalArea: 0 };
    }
  }

  const countyIdToTeamId = new Map<number, string>();
  const teamIdToArea = new Map<string, number>();
  const totalArea = d3.sum(counties, (c: CountyNode) => c.area);
  const targetAreaPerTeam = totalArea / teams.length;

  console.log(`Starting Voronoi assignment with rebalancing: ${teams.length} teams, ${counties.length} counties`);
  console.log(`Target area per team: ${targetAreaPerTeam.toFixed(6)}`);

  // Initialize team areas
  for (const team of teams) {
    teamIdToArea.set(team.id, 0);
  }

  // Step 1: Initial Voronoi assignment (ensures contiguity)
  for (const county of counties) {
    let closestTeam = teams[0];
    let minDistance = Infinity;

    // Find the team whose stadium is closest to this county's centroid
    for (const team of teams) {
      const stadiumCoords = [team.coords.lon, team.coords.lat] as [number, number];
      const distance = d3.geoDistance(stadiumCoords, county.centroid as [number, number]);
      
      if (distance < minDistance) {
        minDistance = distance;
        closestTeam = team;
      }
    }

    // Assign county to closest team
    countyIdToTeamId.set(county.countyId, closestTeam.id);
    const currentArea = teamIdToArea.get(closestTeam.id) ?? 0;
    teamIdToArea.set(closestTeam.id, currentArea + county.area);
  }

  console.log('Initial Voronoi assignment complete');

  // Step 2: Create neighbor lookup for contiguity checking
  const countyNeighbors = new Map<number, number[]>();
  for (const county of counties) {
    countyNeighbors.set(
      county.countyId,
      county.neighbors
        .map(neighborIndex => counties[neighborIndex]?.countyId)
        .filter((id): id is number => id !== undefined)
    );
  }

  // Step 3: Iterative area rebalancing while maintaining contiguity
  const maxIterations = 100;
  let iteration = 0;
  let improved = true;

  while (improved && iteration < maxIterations) {
    iteration++;
    improved = false;
    
    // Find teams that are over/under target
    const teamStats = teams.map(team => ({
      team,
      currentArea: teamIdToArea.get(team.id) ?? 0,
      deficit: targetAreaPerTeam - (teamIdToArea.get(team.id) ?? 0)
    }));

    const overTeams = teamStats.filter(t => t.deficit < -targetAreaPerTeam * 0.05).sort((a, b) => a.deficit - b.deficit);
    const underTeams = teamStats.filter(t => t.deficit > targetAreaPerTeam * 0.05).sort((a, b) => b.deficit - a.deficit);

    if (overTeams.length === 0 || underTeams.length === 0) {
      console.log(`Converged after ${iteration} iterations`);
      break;
    }

    // Try to transfer counties from over-teams to under-teams
    for (const overTeam of overTeams) {
      const overTeamCounties = counties.filter(c => countyIdToTeamId.get(c.countyId) === overTeam.team.id);
      
      // Find border counties that could be transferred
      const transferCandidates: Array<{
        county: CountyNode;
        bestReceiver: Team;
        receiverDeficit: number;
      }> = [];

      for (const county of overTeamCounties) {
        const neighbors = countyNeighbors.get(county.countyId) || [];
        const neighboringTeams = new Set<string>();
        
        for (const neighborId of neighbors) {
          const neighborTeam = countyIdToTeamId.get(neighborId);
          if (neighborTeam && neighborTeam !== overTeam.team.id) {
            neighboringTeams.add(neighborTeam);
          }
        }

        // Find the best receiving team among neighbors
        let bestReceiver: Team | null = null;
        let bestDeficit = 0;

        for (const teamId of neighboringTeams) {
          const team = teams.find(t => t.id === teamId);
          if (!team) continue;
          
          const teamStat = teamStats.find(t => t.team.id === teamId);
          if (teamStat && teamStat.deficit > bestDeficit) {
            bestDeficit = teamStat.deficit;
            bestReceiver = team;
          }
        }

        if (bestReceiver && bestDeficit > targetAreaPerTeam * 0.05) {
          transferCandidates.push({
            county,
            bestReceiver,
            receiverDeficit: bestDeficit
          });
        }
      }

      // Sort by receiver deficit (prioritize teams that need area most)
      transferCandidates.sort((a, b) => b.receiverDeficit - a.receiverDeficit);

      // Transfer counties while checking contiguity
      for (const candidate of transferCandidates) {
        if (overTeam.deficit >= -targetAreaPerTeam * 0.05) break; // Over-team is now balanced

        // Check if removing this county would break contiguity
        const remainingCounties = overTeamCounties
          .filter(c => c.countyId !== candidate.county.countyId)
          .map(c => c.countyId);

        if (remainingCounties.length > 0 && !checkContiguity(remainingCounties, countyNeighbors)) {
          continue; // Would break contiguity, skip
        }

        // Transfer the county
        countyIdToTeamId.set(candidate.county.countyId, candidate.bestReceiver.id);
        
        // Update areas
        const oldOverArea = teamIdToArea.get(overTeam.team.id) ?? 0;
        const oldUnderArea = teamIdToArea.get(candidate.bestReceiver.id) ?? 0;
        teamIdToArea.set(overTeam.team.id, oldOverArea - candidate.county.area);
        teamIdToArea.set(candidate.bestReceiver.id, oldUnderArea + candidate.county.area);

        // Update deficits
        overTeam.deficit += candidate.county.area;
        const receiverStat = teamStats.find(t => t.team.id === candidate.bestReceiver.id);
        if (receiverStat) {
          receiverStat.deficit -= candidate.county.area;
        }

        improved = true;
        console.log(`Iteration ${iteration}: Transferred county ${candidate.county.countyId} from ${overTeam.team.name} to ${candidate.bestReceiver.name}`);
      }
    }
  }

  // Verify final state
  console.log('Final territory verification:');
  for (const team of teams) {
    const teamCountyIds = counties.filter(c => countyIdToTeamId.get(c.countyId) === team.id).map(c => c.countyId);
    const isContiguous = checkContiguity(teamCountyIds, countyNeighbors);
    const area = teamIdToArea.get(team.id) ?? 0;
    const percentage = (area / targetAreaPerTeam) * 100;
    console.log(`${team.name}: ${teamCountyIds.length} counties, area: ${percentage.toFixed(1)}% of target, contiguous: ${isContiguous}`);
  }

  // Log area balance summary
  const areas = Array.from(teamIdToArea.values());
  const maxArea = Math.max(...areas);
  const minArea = Math.min(...areas);
  const areaRatio = maxArea / minArea;
  
  console.log(`Final area balance: max/min ratio = ${areaRatio.toFixed(2)} (target ≈ 1.0)`);

  return { countyIdToTeamId, teamIdToArea, totalArea };
}

// Helper function to check if a set of countyIds forms a contiguous territory
function checkContiguity(teamCountyIds: number[], countyNeighbors: Map<number, number[]>): boolean {
  if (teamCountyIds.length <= 1) return true;
  
  const teamSet = new Set(teamCountyIds);
  const visited = new Set<number>();
  const queue: number[] = [teamCountyIds[0]];

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;
    visited.add(current);
    
    const neighbors = countyNeighbors.get(current) || [];
    for (const neighborId of neighbors) {
      if (teamSet.has(neighborId) && !visited.has(neighborId)) {
        queue.push(neighborId);
      }
    }
  }

  return visited.size === teamSet.size;
}