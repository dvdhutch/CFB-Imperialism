// Simple conquest tracking that stores which team "owns" each county
// This overrides the proximity-based assignment for conquered territories

export type ConquestMap = Map<number, string>; // countyId -> teamId that conquered it

// Initialize conquest map with proximity-based assignments
export function initializeConquestMap(countyAssignments: Map<number, string>): ConquestMap {
  return new Map(countyAssignments);
}

// Transfer all counties from losing team to winning team
export function processConquest(
  conquestMap: ConquestMap,
  winnerTeamId: string,
  loserTeamId: string
): ConquestMap {
  const newMap = new Map(conquestMap);
  let transferredCounties = 0;

  // Find all counties owned by the losing team and transfer them to the winner
  for (const [countyId, ownerId] of conquestMap) {
    if (ownerId === loserTeamId) {
      newMap.set(countyId, winnerTeamId);
      transferredCounties++;
    }
  }

  return newMap;
}

// Get current county assignments from conquest map
export function getConquestAssignments(conquestMap: ConquestMap): Map<number, string> {
  return new Map(conquestMap);
}
