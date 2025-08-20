import type { WeekInfo, Game, TeamSchedule, SeasonSchedule } from '../types';

// 2025 College Football Season Weeks
export const SEASON_WEEKS: WeekInfo[] = [
  {
    weekNumber: 1,
    startDate: '2025-08-23',
    endDate: '2025-09-01',
    label: 'Week 1 (Aug 23 - Sep 1)'
  },
  {
    weekNumber: 2,
    startDate: '2025-09-02',
    endDate: '2025-09-07',
    label: 'Week 2 (Sep 2 - Sep 7)'
  },
  {
    weekNumber: 3,
    startDate: '2025-09-08',
    endDate: '2025-09-14',
    label: 'Week 3 (Sep 8 - Sep 14)'
  },
  {
    weekNumber: 4,
    startDate: '2025-09-15',
    endDate: '2025-09-21',
    label: 'Week 4 (Sep 15 - Sep 21)'
  },
  {
    weekNumber: 5,
    startDate: '2025-09-22',
    endDate: '2025-09-28',
    label: 'Week 5 (Sep 22 - Sep 28)'
  },
  {
    weekNumber: 6,
    startDate: '2025-09-29',
    endDate: '2025-10-05',
    label: 'Week 6 (Sep 29 - Oct 5)'
  },
  {
    weekNumber: 7,
    startDate: '2025-10-06',
    endDate: '2025-10-12',
    label: 'Week 7 (Oct 6 - Oct 12)'
  },
  {
    weekNumber: 8,
    startDate: '2025-10-13',
    endDate: '2025-10-19',
    label: 'Week 8 (Oct 13 - Oct 19)'
  },
  {
    weekNumber: 9,
    startDate: '2025-10-20',
    endDate: '2025-10-26',
    label: 'Week 9 (Oct 20 - Oct 26)'
  },
  {
    weekNumber: 10,
    startDate: '2025-10-27',
    endDate: '2025-11-02',
    label: 'Week 10 (Oct 27 - Nov 2)'
  },
  {
    weekNumber: 11,
    startDate: '2025-11-03',
    endDate: '2025-11-09',
    label: 'Week 11 (Nov 3 - Nov 9)'
  },
  {
    weekNumber: 12,
    startDate: '2025-11-10',
    endDate: '2025-11-16',
    label: 'Week 12 (Nov 10 - Nov 16)'
  },
  {
    weekNumber: 13,
    startDate: '2025-11-17',
    endDate: '2025-11-23',
    label: 'Week 13 (Nov 17 - Nov 23)'
  },
  {
    weekNumber: 14,
    startDate: '2025-11-24',
    endDate: '2025-11-30',
    label: 'Week 14 (Nov 24 - Nov 30)'
  },
  {
    weekNumber: 15,
    startDate: '2025-12-01',
    endDate: '2025-12-07',
    label: 'Week 15 (Dec 1 - Dec 7)'
  },
  {
    weekNumber: 16,
    startDate: '2025-12-08',
    endDate: '2025-12-13',
    label: 'Week 16 (Dec 8 - Dec 13)'
  }
];

// Helper function to get week info by week number
export function getWeekInfo(weekNumber: number): WeekInfo | undefined {
  return SEASON_WEEKS.find(week => week.weekNumber === weekNumber);
}

// Helper function to get current week based on date
export function getCurrentWeek(currentDate: Date = new Date()): number {
  const dateStr = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD format
  
  for (const week of SEASON_WEEKS) {
    if (dateStr >= week.startDate && dateStr <= week.endDate) {
      return week.weekNumber;
    }
  }
  
  // If before season starts, return week 1
  if (dateStr < SEASON_WEEKS[0].startDate) {
    return 1;
  }
  
  // If after season ends, return final week
  return SEASON_WEEKS[SEASON_WEEKS.length - 1].weekNumber;
}

// Helper function to check if a date is within a specific week
export function isDateInWeek(date: string, weekNumber: number): boolean {
  const week = getWeekInfo(weekNumber);
  if (!week) return false;
  
  return date >= week.startDate && date <= week.endDate;
}

// Create an empty season schedule
export function createEmptySeasonSchedule(): SeasonSchedule {
  return {
    weeks: SEASON_WEEKS,
    games: [],
    teamSchedules: new Map(),
    currentWeek: getCurrentWeek()
  };
}

// Initialize team schedule for a specific team
export function createTeamSchedule(teamId: string): TeamSchedule {
  return {
    teamId,
    games: [],
    wins: 0,
    losses: 0,
    gamesPlayed: 0,
    isEliminated: false
  };
}

// Add a game to the season schedule
export function addGameToSchedule(
  schedule: SeasonSchedule, 
  game: Game
): SeasonSchedule {
  const newSchedule = { ...schedule };
  
  // Add game to main games array
  newSchedule.games = [...schedule.games, game];
  
  // Update team schedules
  newSchedule.teamSchedules = new Map(schedule.teamSchedules);
  
  // Ensure both teams have schedules
  if (!newSchedule.teamSchedules.has(game.homeTeamId)) {
    newSchedule.teamSchedules.set(game.homeTeamId, createTeamSchedule(game.homeTeamId));
  }
  if (!newSchedule.teamSchedules.has(game.awayTeamId)) {
    newSchedule.teamSchedules.set(game.awayTeamId, createTeamSchedule(game.awayTeamId));
  }
  
  // Add game to both team schedules
  const homeSchedule = { ...newSchedule.teamSchedules.get(game.homeTeamId)! };
  const awaySchedule = { ...newSchedule.teamSchedules.get(game.awayTeamId)! };
  
  homeSchedule.games = [...homeSchedule.games, game];
  awaySchedule.games = [...awaySchedule.games, game];
  
  newSchedule.teamSchedules.set(game.homeTeamId, homeSchedule);
  newSchedule.teamSchedules.set(game.awayTeamId, awaySchedule);
  
  return newSchedule;
}

// Update game result and recalculate team records
export function updateGameResult(
  schedule: SeasonSchedule,
  gameId: string,
  homeScore: number,
  awayScore: number
): SeasonSchedule {
  const newSchedule = { ...schedule };
  
  // Find and update the game
  const gameIndex = newSchedule.games.findIndex(g => g.id === gameId);
  if (gameIndex === -1) return schedule;
  
  const updatedGame: Game = {
    ...newSchedule.games[gameIndex],
    homeScore,
    awayScore,
    result: homeScore > awayScore ? 'win' : 'loss',
    isCompleted: true
  };
  
  newSchedule.games = [...schedule.games];
  newSchedule.games[gameIndex] = updatedGame;
  
  // Recalculate all team records
  newSchedule.teamSchedules = new Map();
  
  // Initialize all team schedules
  const allTeamIds = new Set<string>();
  newSchedule.games.forEach(game => {
    allTeamIds.add(game.homeTeamId);
    allTeamIds.add(game.awayTeamId);
  });
  
  allTeamIds.forEach(teamId => {
    newSchedule.teamSchedules.set(teamId, createTeamSchedule(teamId));
  });
  
  // Calculate records for each team
  newSchedule.games.forEach(game => {
    const homeSchedule = newSchedule.teamSchedules.get(game.homeTeamId)!;
    const awaySchedule = newSchedule.teamSchedules.get(game.awayTeamId)!;
    
    homeSchedule.games.push(game);
    awaySchedule.games.push(game);
    
    if (game.isCompleted && game.result !== null) {
      homeSchedule.gamesPlayed++;
      awaySchedule.gamesPlayed++;
      
      if (game.result === 'win') {
        homeSchedule.wins++;
        awaySchedule.losses++;
        awaySchedule.isEliminated = true; // Team is eliminated after first loss
      } else {
        homeSchedule.losses++;
        awaySchedule.wins++;
        homeSchedule.isEliminated = true; // Team is eliminated after first loss
      }
    }
  });
  
  return newSchedule;
}

// Get games for a specific week
export function getGamesForWeek(schedule: SeasonSchedule, weekNumber: number): Game[] {
  return schedule.games.filter(game => game.week === weekNumber);
}

// Get all undefeated teams
export function getUndefeatedTeams(schedule: SeasonSchedule): string[] {
  const undefeated: string[] = [];
  
  schedule.teamSchedules.forEach((teamSchedule, teamId) => {
    if (!teamSchedule.isEliminated && teamSchedule.gamesPlayed > 0) {
      undefeated.push(teamId);
    }
  });
  
  return undefeated;
}

// Get team's remaining games
export function getRemainingGames(schedule: SeasonSchedule, teamId: string): Game[] {
  const teamSchedule = schedule.teamSchedules.get(teamId);
  if (!teamSchedule) return [];
  
  return teamSchedule.games.filter(game => !game.isCompleted);
}

// Generate a unique game ID
export function generateGameId(homeTeamId: string, awayTeamId: string, week: number): string {
  return `${homeTeamId}-vs-${awayTeamId}-week${week}`;
}


