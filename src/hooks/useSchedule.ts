import { useState, useCallback, useMemo } from 'react';
import type { SeasonSchedule, Game, TeamSchedule } from '../types';
import { 
  createEmptySeasonSchedule, 
  addGameToSchedule, 
  updateGameResult,
  getUndefeatedTeams,
  getGamesForWeek,
  getRemainingGames,
  getCurrentWeek
} from '../data/schedule';

/**
 * Custom hook for managing the college football season schedule
 * Provides state management and helper functions for the imperialism map
 */
export function useSchedule() {
  const [schedule, setSchedule] = useState<SeasonSchedule>(createEmptySeasonSchedule);

  // Add a new game to the schedule
  const addGame = useCallback((game: Game) => {
    setSchedule(currentSchedule => addGameToSchedule(currentSchedule, game));
  }, []);

  // Add multiple games at once
  const addGames = useCallback((games: Game[]) => {
    setSchedule(currentSchedule => {
      let newSchedule = currentSchedule;
      games.forEach(game => {
        newSchedule = addGameToSchedule(newSchedule, game);
      });
      return newSchedule;
    });
  }, []);

  // Update a game's result
  const updateGame = useCallback((gameId: string, homeScore: number, awayScore: number) => {
    setSchedule(currentSchedule => updateGameResult(currentSchedule, gameId, homeScore, awayScore));
  }, []);

  // Reset the entire schedule
  const resetSchedule = useCallback(() => {
    setSchedule(createEmptySeasonSchedule());
  }, []);

  // Get undefeated teams (for imperialism map display)
  const undefeatedTeams = useMemo(() => {
    return getUndefeatedTeams(schedule);
  }, [schedule]);

  // Get games for a specific week
  const getWeekGames = useCallback((weekNumber: number) => {
    return getGamesForWeek(schedule, weekNumber);
  }, [schedule]);

  // Get a team's schedule
  const getTeamSchedule = useCallback((teamId: string): TeamSchedule | undefined => {
    return schedule.teamSchedules.get(teamId);
  }, [schedule]);

  // Get a team's remaining games
  const getTeamRemainingGames = useCallback((teamId: string) => {
    return getRemainingGames(schedule, teamId);
  }, [schedule]);

  // Check if a team is eliminated
  const isTeamEliminated = useCallback((teamId: string): boolean => {
    const teamSchedule = schedule.teamSchedules.get(teamId);
    return teamSchedule?.isEliminated ?? false;
  }, [schedule]);

  // Get all games
  const allGames = useMemo(() => schedule.games, [schedule]);

  // Get current week
  const currentWeek = useMemo(() => getCurrentWeek(), []);

  // Get completed games count
  const completedGamesCount = useMemo(() => {
    return schedule.games.filter(game => game.isCompleted).length;
  }, [schedule]);

  // Get total games count
  const totalGamesCount = useMemo(() => schedule.games.length, [schedule]);

  // Get teams with at least one game
  const activeTeams = useMemo(() => {
    return Array.from(schedule.teamSchedules.keys());
  }, [schedule]);

  // Get elimination summary
  const eliminationSummary = useMemo(() => {
    let eliminatedCount = 0;
    let undefeatedCount = 0;
    let noGamesCount = 0;

    schedule.teamSchedules.forEach(teamSchedule => {
      if (teamSchedule.gamesPlayed === 0) {
        noGamesCount++;
      } else if (teamSchedule.isEliminated) {
        eliminatedCount++;
      } else {
        undefeatedCount++;
      }
    });

    return {
      eliminated: eliminatedCount,
      undefeated: undefeatedCount,
      noGames: noGamesCount,
      total: schedule.teamSchedules.size
    };
  }, [schedule]);

  return {
    // State
    schedule,
    
    // Actions
    addGame,
    addGames,
    updateGame,
    resetSchedule,
    
    // Computed values
    undefeatedTeams,
    allGames,
    currentWeek,
    completedGamesCount,
    totalGamesCount,
    activeTeams,
    eliminationSummary,
    
    // Helper functions
    getWeekGames,
    getTeamSchedule,
    getTeamRemainingGames,
    isTeamEliminated
  };
}


