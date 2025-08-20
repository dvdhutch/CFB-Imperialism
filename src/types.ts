export type LatLng = {
  lat: number;
  lon: number;
};

export type Team = {
  id: string;
  name: string;
  colorHex: string;
  logoUrl: string;
  coords: LatLng; // geographic coordinates (WGS84)
};

export type CountyFeature = GeoJSON.Feature<GeoJSON.MultiPolygon | GeoJSON.Polygon, {
  id: number;
  name?: string;
  state?: string;
}>;

export type CountyWithMetrics = {
  feature: CountyFeature;
  countyId: number;
  area: number; // spherical area in steradians (from d3.geoArea)
  centroid: [number, number]; // [lon, lat]
};

export type CountyNode = CountyWithMetrics & {
  index: number; // index within the original TopoJSON geometries array
  neighbors: number[]; // neighboring county indexes
};

export type AssignmentResult = {
  countyIdToTeamId: Map<number, string>;
  teamIdToArea: Map<string, number>;
  totalArea: number;
};

// Conquest tracking for territory assignment
export type Conquest = {
  winnerId: string;
  loserId: string;
  gameId: string;
  week: number;
};

export type ConquestHistory = Conquest[];

// Schedule and Game Types
export type WeekInfo = {
  weekNumber: number;
  startDate: string; // YYYY-MM-DD format
  endDate: string;   // YYYY-MM-DD format
  label: string;     // e.g., "Week 1 (Aug 23 - Sep 1)"
};

export type GameResult = 'win' | 'loss' | null; // null = game not played yet

export type Game = {
  id: string;
  week: number;
  homeTeamId: string;
  awayTeamId: string;
  homeScore?: number;
  awayScore?: number;
  gameDate?: string; // YYYY-MM-DD format
  result?: GameResult; // from perspective of home team
  isCompleted: boolean;
};

export type TeamSchedule = {
  teamId: string;
  games: Game[];
  wins: number;
  losses: number;
  gamesPlayed: number;
  isEliminated: boolean; // true if team has lost a game
};

export type SeasonSchedule = {
  weeks: WeekInfo[];
  games: Game[];
  teamSchedules: Map<string, TeamSchedule>;
  currentWeek: number;
};

// Upcoming Games Database Types
export type UpcomingGame = {
  id: string;
  week: number;
  homeTeamName: string;
  homeTeamLogo: string;
  awayTeamName: string;
  awayTeamLogo: string;
  gameDate?: string; // YYYY-MM-DD format
};

export type UpcomingGamesResponse = {
  games: UpcomingGame[];
  currentWeek: number;
  totalWeeks: number;
};

// Simple Territory Tracking
export type TeamTerritoryData = {
  teamId: string;
  teamName: string;
  countyIds: Set<number>;
  totalAreaSqMiles: number;
  countyCount: number;
};

export type TerritoryTracker = Map<string, TeamTerritoryData>;


