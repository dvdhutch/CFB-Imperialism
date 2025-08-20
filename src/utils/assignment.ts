import * as d3 from 'd3';
import type { AssignmentResult, CountyNode, Team } from '../types';
import type { ConquestMap } from './conquestTracker';

// Conquest-aware assignment:
// Uses conquest map if provided, otherwise falls back to proximity-based assignment
export function assignCountiesToTeams(
  counties: CountyNode[],
  teams: Team[],
  conquestMap?: ConquestMap,
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

  // Initialize team areas
  for (const team of teams) {
    teamIdToArea.set(team.id, 0);
  }

  // Assign counties based on conquest map or proximity
  for (const county of counties) {
    let assignedTeamId: string;

    if (conquestMap && conquestMap.has(county.countyId)) {
      // Use conquest map assignment if available
      const conqueredBy = conquestMap.get(county.countyId)!;
      
      // Verify the conquering team is still active
      const activeTeam = teams.find(t => t.id === conqueredBy);
      if (activeTeam) {
        assignedTeamId = conqueredBy;
      } else {
        // Fallback to proximity if conquering team is no longer active
        assignedTeamId = getClosestTeam(county, teams);
      }
    } else {
      // Fallback to proximity-based assignment
      assignedTeamId = getClosestTeam(county, teams);
    }

    // Assign county to determined team
    countyIdToTeamId.set(county.countyId, assignedTeamId);
    const currentArea = teamIdToArea.get(assignedTeamId) ?? 0;
    teamIdToArea.set(assignedTeamId, currentArea + county.area);
  }

  return { countyIdToTeamId, teamIdToArea, totalArea };
}

// Helper function to find closest team by proximity
function getClosestTeam(county: CountyNode, teams: Team[]): string {
  let closestTeam = teams[0];
  let minDistance = Infinity;

  for (const team of teams) {
    const stadiumCoords = [team.coords.lon, team.coords.lat] as [number, number];
    const distance = d3.geoDistance(stadiumCoords, county.centroid as [number, number]);
    
    if (distance < minDistance) {
      minDistance = distance;
      closestTeam = team;
    }
  }

  return closestTeam.id;
}