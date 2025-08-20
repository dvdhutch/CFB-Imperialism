
import { useSchedule } from '../hooks/useSchedule';
import { SEASON_WEEKS } from '../data/schedule';
import { ALL_SAMPLE_GAMES } from '../data/sample_games';

/**
 * Demo component showing how to use the schedule system
 * This is for demonstration purposes - you can integrate this into your main app
 */
export function ScheduleDemo() {
  const {
    schedule,
    addGames,
    updateGame,
    resetSchedule,
    undefeatedTeams,
    currentWeek,
    completedGamesCount,
    totalGamesCount,
    eliminationSummary,
    getWeekGames,

  } = useSchedule();

  const handleLoadSampleData = () => {
    addGames(ALL_SAMPLE_GAMES);
  };

  const handleUpdateSampleGame = () => {
    // Update the first incomplete game with a sample result
    const incompleteGame = schedule.games.find(game => !game.isCompleted);
    if (incompleteGame) {
      updateGame(incompleteGame.id, 28, 21);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>College Football Schedule System Demo</h2>
      
      {/* Controls */}
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={handleLoadSampleData}
          style={{ marginRight: '10px', padding: '8px 16px' }}
        >
          Load Sample Games
        </button>
        <button 
          onClick={handleUpdateSampleGame}
          style={{ marginRight: '10px', padding: '8px 16px' }}
        >
          Update Sample Game
        </button>
        <button 
          onClick={resetSchedule}
          style={{ padding: '8px 16px' }}
        >
          Reset Schedule
        </button>
      </div>

      {/* Season Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        <div style={{ padding: '16px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'bold' }}>Season Progress</h3>
          <p>Current Week: {currentWeek}</p>
          <p>Games: {completedGamesCount}/{totalGamesCount}</p>
        </div>
        
        <div style={{ padding: '16px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'bold' }}>Teams Status</h3>
          <p>Undefeated: {eliminationSummary.undefeated}</p>
          <p>Eliminated: {eliminationSummary.eliminated}</p>
          <p>No Games: {eliminationSummary.noGames}</p>
        </div>
      </div>

      {/* Week Schedule */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Season Weeks</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
          {SEASON_WEEKS.map(week => {
            const weekGames = getWeekGames(week.weekNumber);
            return (
              <div 
                key={week.weekNumber}
                style={{ 
                  padding: '8px', 
                  border: '1px solid #ddd', 
                  borderRadius: '4px',
                  backgroundColor: week.weekNumber === currentWeek ? '#e3f2fd' : 'white'
                }}
              >
                <div style={{ fontWeight: 'bold', fontSize: '12px' }}>{week.label}</div>
                <div style={{ fontSize: '10px', color: '#666' }}>
                  {weekGames.length} games scheduled
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Undefeated Teams (for Imperialism Map) */}
      {undefeatedTeams.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Undefeated Teams (Active on Map)</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {undefeatedTeams.map(teamId => (
              <span 
                key={teamId}
                style={{ 
                  padding: '4px 8px', 
                  backgroundColor: '#4caf50', 
                  color: 'white', 
                  borderRadius: '4px',
                  fontSize: '12px'
                }}
              >
                {teamId}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recent Games */}
      {schedule.games.length > 0 && (
        <div>
          <h3>Games</h3>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {schedule.games.map(game => (
              <div 
                key={game.id}
                style={{ 
                  padding: '8px', 
                  border: '1px solid #ddd', 
                  borderRadius: '4px',
                  marginBottom: '4px',
                  backgroundColor: game.isCompleted ? '#f5f5f5' : 'white'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px' }}>
                    Week {game.week}: {game.awayTeamId} @ {game.homeTeamId}
                  </span>
                  {game.isCompleted && (
                    <span style={{ fontSize: '12px', fontWeight: 'bold' }}>
                      {game.homeScore}-{game.awayScore}
                    </span>
                  )}
                </div>
                {game.gameDate && (
                  <div style={{ fontSize: '10px', color: '#666' }}>{game.gameDate}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {schedule.games.length === 0 && (
        <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
          <p>No games loaded. Click "Load Sample Games" to see demo data.</p>
        </div>
      )}
    </div>
  );
}

