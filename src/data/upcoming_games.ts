import type { UpcomingGame } from '../types';

// Local data structure for upcoming games organized by week
export const UPCOMING_GAMES: Record<number, UpcomingGame[]> = {
  0: [
    {
      id: 'week0-game1',
      week: 0,
      awayTeamName: 'Iowa State',
      awayTeamLogo: 'https://example.com/delaware-state-logo.png',
      homeTeamName: 'Kansas State',
      homeTeamLogo: 'https://example.com/hawaii-logo.png',
      gameDate: '2024-08-23'
    },
    {
      id: 'week0-game2',
      week: 0,
      awayTeamName: 'Idaho State',
      awayTeamLogo: 'https://example.com/notre-dame-logo.png',
      homeTeamName: 'UNLV',
      homeTeamLogo: 'https://example.com/navy-logo.png',
      gameDate: '2024-08-23'
    },
    {
      id: 'week0-game3',
      week: 0,
      awayTeamName: 'Fresno State',
      awayTeamLogo: 'https://example.com/utep-logo.png',
      homeTeamName: 'Kansas',
      homeTeamLogo: 'https://example.com/jacksonville-state-logo.png',
      gameDate: '2024-08-23'
    },
    {
      id: 'week0-game4',
      week: 0,
      awayTeamName: 'Sam Houston',
      awayTeamLogo: 'https://example.com/sacramento-state-logo.png',
      homeTeamName: 'Western Kentucky',
      homeTeamLogo: 'https://example.com/san-jose-state-logo.png',
      gameDate: '2024-08-23'
    },
    {
      id: 'week0-game5',
      week: 0,
      awayTeamName: 'Stanford',
      awayTeamLogo: 'https://example.com/hawaii-logo.png',
      homeTeamName: 'Hawaiʻi',
      homeTeamLogo: 'https://example.com/ucla-logo.png',
      gameDate: '2024-08-23'
    }
  ],
  // Week 1 will be added here when ready
  // 1: [
  //   {
  //     id: 'week1-game1',
  //     week: 1,ho
  //     homeTeamName: 'Team G',
  //     homeTeamLogo: 'https://example.com/team-g-logo.png',
  //     awayTeamName: 'Team H',
  //     awayTeamLogo: 'https://example.com/team-h-logo.png',
  //     gameDate: '2024-08-31'
  //   }
  // ]
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
