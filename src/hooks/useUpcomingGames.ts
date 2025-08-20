import { useState, useEffect } from 'react';
import type { UpcomingGame } from '../types';
import { getGamesForWeek, getTotalWeeks } from '../data/upcoming_games';

export const useUpcomingGames = (week?: number) => {
  const [games, setGames] = useState<UpcomingGame[]>([]);
  const [currentWeek, setCurrentWeek] = useState<number>(0);
  const [totalWeeks, setTotalWeeks] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get the week to display (default to 0 if not specified)
      const weekToShow = week !== undefined ? week : 0;
      
      // Get games for the specified week from local data
      const weekGames = getGamesForWeek(weekToShow);
      const totalWeeksCount = getTotalWeeks();
      
      setGames(weekGames);
      setCurrentWeek(weekToShow);
      setTotalWeeks(totalWeeksCount);
    } catch (err) {
      console.error('Error loading upcoming games:', err);
      setError(err instanceof Error ? err.message : 'Failed to load upcoming games');
    } finally {
      setIsLoading(false);
    }
  }, [week]);

  return {
    games,
    currentWeek,
    totalWeeks,
    isLoading,
    error,
    refetch: () => {
      // For local data, refetch is just a reload of the same data
      const weekToShow = week !== undefined ? week : 0;
      const weekGames = getGamesForWeek(weekToShow);
      setGames(weekGames);
    }
  };
};
