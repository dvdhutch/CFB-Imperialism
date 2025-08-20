import { useMemo, useState, useEffect } from 'react';
import { loadUsCounties, computeCountyNodes } from '../utils/geo';
import { assignCountiesToTeams } from '../utils/assignment';
import type { Team, CountyNode } from '../types';
import type { ConquestMap } from '../utils/conquestTracker';

export function useTeamAreas(teams: Team[], conquestMap?: ConquestMap | null) {
  const [counties, setCounties] = useState<CountyNode[] | null>(null);

  useEffect(() => {
    loadUsCounties().then(({ counties, neighbors }) => {
      const countyNodes = computeCountyNodes(counties, neighbors);
      setCounties(countyNodes);
    }).catch(error => {
      console.error('Error loading counties:', error);
    });
  }, []);

  const teamData = useMemo(() => {
    if (!counties || teams.length === 0 || counties.length === 0) {
      return {
        areas: new Map<string, number>(),
        countyCounts: new Map<string, number>()
      };
    }
    
    try {
      const assignment = assignCountiesToTeams(counties, teams, conquestMap);
      
      // Calculate county counts for each team
      const countyCounts = new Map<string, number>();
      for (const team of teams) {
        const count = Array.from(assignment.countyIdToTeamId.values()).filter(teamId => teamId === team.id).length;
        countyCounts.set(team.id, count);
      }
      
      return {
        areas: assignment.teamIdToArea,
        countyCounts
      };
    } catch (error) {
      console.error('Error calculating team data:', error);
      return {
        areas: new Map<string, number>(),
        countyCounts: new Map<string, number>()
      };
    }
  }, [counties, teams, conquestMap]);

  return teamData;
}
