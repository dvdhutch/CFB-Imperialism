# College Football Schedule Data Structure

This document explains the data structure created for managing the 2025 college football season schedule and game results for the imperialism map.

## Overview

The schedule system is designed around the concept that:
- There are 16 weeks in the college football season (Aug 23 - Dec 13, 2025)
- Each team plays 12 regular season games
- Teams don't play every week
- Once a team loses a game, they are eliminated from the imperialism map

## File Structure

### `types.ts`
Contains all TypeScript type definitions:
- `WeekInfo`: Defines a week with start/end dates and labels
- `Game`: Represents a single game between two teams
- `TeamSchedule`: Tracks a team's games, wins, losses, and elimination status
- `SeasonSchedule`: Contains the entire season's data structure

### `schedule.ts`
Core functionality for managing the season:
- `SEASON_WEEKS`: Array of all 16 weeks with date ranges
- Helper functions for managing games and schedules
- Functions to calculate team records and elimination status

### `sample_games.ts`
Example data structure showing how to add games:
- Sample games for different weeks
- Helper functions to create new games
- Template for adding actual game data

## Key Data Types

### WeekInfo
```typescript
type WeekInfo = {
  weekNumber: number;     // 1-16
  startDate: string;      // YYYY-MM-DD format
  endDate: string;        // YYYY-MM-DD format
  label: string;          // "Week 1 (Aug 23 - Sep 1)"
}
```

### Game
```typescript
type Game = {
  id: string;             // Unique identifier
  week: number;           // Week number (1-16)
  homeTeamId: string;     // Home team's ID (matches FBS team IDs)
  awayTeamId: string;     // Away team's ID
  homeScore?: number;     // Home team score (if completed)
  awayScore?: number;     // Away team score (if completed)
  gameDate?: string;      // Game date (YYYY-MM-DD)
  result?: GameResult;    // 'win'|'loss'|null (from home team perspective)
  isCompleted: boolean;   // Whether the game has been played
}
```

### TeamSchedule
```typescript
type TeamSchedule = {
  teamId: string;         // Team's ID
  games: Game[];          // All games for this team
  wins: number;           // Number of wins
  losses: number;         // Number of losses
  gamesPlayed: number;    // Total completed games
  isEliminated: boolean;  // True if team has lost (eliminated from map)
}
```

## Season Weeks (2025)

| Week | Start Date | End Date   | Description |
|------|------------|------------|-------------|
| 1    | Aug 23     | Sep 1      | Season opener |
| 2    | Sep 2      | Sep 7      | |
| 3    | Sep 8      | Sep 14     | |
| 4    | Sep 15     | Sep 21     | |
| 5    | Sep 22     | Sep 28     | |
| 6    | Sep 29     | Oct 5      | |
| 7    | Oct 6      | Oct 12     | |
| 8    | Oct 13     | Oct 19     | |
| 9    | Oct 20     | Oct 26     | |
| 10   | Oct 27     | Nov 2      | |
| 11   | Nov 3      | Nov 9      | |
| 12   | Nov 10     | Nov 16     | |
| 13   | Nov 17     | Nov 23     | Rivalry week |
| 14   | Nov 24     | Nov 30     | Thanksgiving week |
| 15   | Dec 1      | Dec 7      | Conference championships |
| 16   | Dec 8      | Dec 13     | Final regular season games |

## How to Add Game Data

### 1. Create Individual Games
```typescript
import { createGame, createCompletedGame } from './sample_games';

// For a future game
const newGame = createGame('alabama', 'georgia', 5, '2025-09-27');

// For a completed game
const completedGame = createCompletedGame('ohio-state', 'michigan', 12, 42, 27, '2025-11-15');
```

### 2. Add Games to Schedule
```typescript
import { createEmptySeasonSchedule, addGameToSchedule } from './schedule';

let schedule = createEmptySeasonSchedule();
schedule = addGameToSchedule(schedule, newGame);
```

### 3. Update Game Results
```typescript
import { updateGameResult } from './schedule';

schedule = updateGameResult(schedule, gameId, homeScore, awayScore);
```

## Helper Functions

### Schedule Management
- `createEmptySeasonSchedule()`: Initialize a new season
- `addGameToSchedule(schedule, game)`: Add a game to the schedule
- `updateGameResult(schedule, gameId, homeScore, awayScore)`: Record game results

### Data Retrieval
- `getWeekInfo(weekNumber)`: Get week details
- `getCurrentWeek()`: Get current week based on today's date
- `getGamesForWeek(schedule, weekNumber)`: Get all games for a specific week
- `getUndefeatedTeams(schedule)`: Get teams that haven't lost yet
- `getRemainingGames(schedule, teamId)`: Get a team's upcoming games

### Utilities
- `generateGameId(homeTeamId, awayTeamId, week)`: Create unique game ID
- `isDateInWeek(date, weekNumber)`: Check if date falls within a week

## Integration with Imperialism Map

The schedule system integrates with the existing imperialism map by:

1. **Team Elimination**: When a team loses a game, `isEliminated` is set to `true`
2. **Undefeated Teams**: Use `getUndefeatedTeams()` to get teams still on the map
3. **Team IDs**: Game team IDs match the existing FBS team IDs from `fbs_teams.ts`

## Example Usage

```typescript
import { createEmptySeasonSchedule, addGameToSchedule, updateGameResult } from './schedule';
import { createGame } from './sample_games';

// Initialize season
let schedule = createEmptySeasonSchedule();

// Add a game
const game = createGame('alabama', 'georgia', 5, '2025-09-27');
schedule = addGameToSchedule(schedule, game);

// Later, update the result
schedule = updateGameResult(schedule, game.id, 28, 21);

// Check which teams are still undefeated
const undefeatedTeams = getUndefeatedTeams(schedule);
console.log('Undefeated teams:', undefeatedTeams);
```

## Next Steps

1. **Populate Real Data**: Replace sample games with actual 2025 schedule data
2. **UI Integration**: Create components to display schedule and update results
3. **Map Integration**: Connect eliminated teams to map display logic
4. **Data Persistence**: Add local storage or backend integration for game results


