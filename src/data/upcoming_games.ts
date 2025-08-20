import type { UpcomingGame } from '../types';

// Upcoming games organized by week
export const UPCOMING_GAMES: Record<number, UpcomingGame[]> = {
  0: [
    {
      id: 'week0-game1',
      week: 0,
      awayTeamName: 'Iowa State',
      awayTeamLogo: '',
      homeTeamName: 'Kansas State',
      homeTeamLogo: '',
      gameDate: '2024-08-23'
    },
    {
      id: 'week0-game2',
      week: 0,
      awayTeamName: 'Idaho State',
      awayTeamLogo: '',
      homeTeamName: 'UNLV',
      homeTeamLogo: '',
      gameDate: '2024-08-23'
    },
    {
      id: 'week0-game3',
      week: 0,
      awayTeamName: 'Fresno State',
      awayTeamLogo: '',
      homeTeamName: 'Kansas',
      homeTeamLogo: '',
      gameDate: '2024-08-23'
    },
    {
      id: 'week0-game4',
      week: 0,
      awayTeamName: 'Sam Houston',
      awayTeamLogo: '',
      homeTeamName: 'Western Kentucky',
      homeTeamLogo: '',
      gameDate: '2024-08-23'
    },
    {
      id: 'week0-game5',
      week: 0,
      awayTeamName: 'Stanford',
      awayTeamLogo: '',
      homeTeamName: 'Hawaiʻi',
      homeTeamLogo: '',
      gameDate: '2024-08-23'
    }
  ],
  // Week 1 will be added here when ready
};

// Helper function to get all available weeks
export const getAvailableWeeks = (): number[] => {
  return Object.keys(UPCOMING_GAMES).map(Number).sort((a, b) => a - b);
};

// Helper function to get games for a specific week
export const getGamesForWeek = (week: number): UpcomingGame[] => {
  return UPCOMING_GAMES[week] || [];
};

// Helper function to get total number of weeks
export const getTotalWeeks = (): number => {
  return Object.keys(UPCOMING_GAMES).length;
};
