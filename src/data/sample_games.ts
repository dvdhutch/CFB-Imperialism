import type { Game } from '../types';
import { generateGameId } from './schedule';

/**
 * Sample games data structure
 * This file demonstrates how game data should be structured.
 * You can populate this with actual game information.
 * 
 * Each team plays 12 regular season games out of the 16-week season.
 * Not every team plays every week.
 */

// Sample games for Week 1 (Aug 23 - Sep 1)
export const SAMPLE_WEEK_1_GAMES: Game[] = [
  {
    id: generateGameId('alabama', 'clemson', 1),
    week: 1,
    homeTeamId: 'alabama',
    awayTeamId: 'clemson',
    gameDate: '2025-08-30',
    isCompleted: false
  },
  {
    id: generateGameId('ohio-state', 'oregon', 1),
    week: 1,
    homeTeamId: 'ohio-state',
    awayTeamId: 'oregon',
    gameDate: '2025-08-31',
    isCompleted: false
  },
  {
    id: generateGameId('georgia', 'texas', 1),
    week: 1,
    homeTeamId: 'georgia',
    awayTeamId: 'texas',
    gameDate: '2025-08-30',
    isCompleted: false
  }
];

// Sample games for Week 2 (Sep 2 - Sep 7)
export const SAMPLE_WEEK_2_GAMES: Game[] = [
  {
    id: generateGameId('michigan', 'penn-state', 2),
    week: 2,
    homeTeamId: 'michigan',
    awayTeamId: 'penn-state',
    gameDate: '2025-09-06',
    isCompleted: false
  },
  {
    id: generateGameId('notre-dame', 'usc', 2),
    week: 2,
    homeTeamId: 'notre-dame',
    awayTeamId: 'usc',
    gameDate: '2025-09-07',
    isCompleted: false
  }
];

// Example of a completed game with results
export const SAMPLE_COMPLETED_GAME: Game = {
  id: generateGameId('oklahoma', 'texas-tech', 1),
  week: 1,
  homeTeamId: 'oklahoma',
  awayTeamId: 'texas-tech',
  gameDate: '2025-08-29',
  homeScore: 28,
  awayScore: 21,
  result: 'win', // from home team perspective
  isCompleted: true
};

// All sample games combined
export const ALL_SAMPLE_GAMES: Game[] = [
  ...SAMPLE_WEEK_1_GAMES,
  ...SAMPLE_WEEK_2_GAMES,
  SAMPLE_COMPLETED_GAME
];

/**
 * Helper function to create a new game
 */
export function createGame(
  homeTeamId: string,
  awayTeamId: string,
  week: number,
  gameDate?: string
): Game {
  return {
    id: generateGameId(homeTeamId, awayTeamId, week),
    week,
    homeTeamId,
    awayTeamId,
    gameDate,
    isCompleted: false
  };
}

/**
 * Helper function to create a completed game with results
 */
export function createCompletedGame(
  homeTeamId: string,
  awayTeamId: string,
  week: number,
  homeScore: number,
  awayScore: number,
  gameDate?: string
): Game {
  return {
    id: generateGameId(homeTeamId, awayTeamId, week),
    week,
    homeTeamId,
    awayTeamId,
    gameDate,
    homeScore,
    awayScore,
    result: homeScore > awayScore ? 'win' : 'loss',
    isCompleted: true
  };
}

// Template for adding your actual games data:
/*
export const WEEK_1_GAMES: Game[] = [
  createGame('team1-id', 'team2-id', 1, '2025-08-30'),
  createGame('team3-id', 'team4-id', 1, '2025-08-31'),
  // ... add more games
];

export const WEEK_2_GAMES: Game[] = [
  createGame('team5-id', 'team6-id', 2, '2025-09-06'),
  // ... add more games
];

// Continue for all 16 weeks...
*/


