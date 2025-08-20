import { useState, useEffect } from 'react';
import './App.css';
import type { Team } from './types';
import { TeamList } from './components/TeamList';
import { MapUSA } from './components/MapUSA';
import { BuyMeACoffee } from './components/BuyMeACoffee';
import { LoadingScreen } from './components/LoadingScreen';
import { UpcomingGames } from './components/UpcomingGames';
import { getTeamsWithCompleteData, FBS_TEAMS } from './data/fbs_teams';
import { useTeamAreas } from './hooks/useTeamAreas';
import type { ConquestMap } from './utils/conquestTracker';

function App() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [conquestMap, setConquestMap] = useState<ConquestMap | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const teamData = useTeamAreas(teams, conquestMap);

  // Load teams and initialize conquest map
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load teams
        const completeTeams = getTeamsWithCompleteData();
        console.log('Loaded teams:', completeTeams);
        setTeams(completeTeams);

        // Load counties and initialize conquest map
        const { loadUsCounties, computeCountyNodes } = await import('./utils/geo');
        const { assignCountiesToTeams } = await import('./utils/assignment');
        const { initializeConquestMap } = await import('./utils/conquestTracker');
        
        const { counties, neighbors } = await loadUsCounties();
        const countyNodes = computeCountyNodes(counties, neighbors);
        
        // Get initial proximity-based assignments
        const initialAssignment = assignCountiesToTeams(countyNodes, completeTeams);
        
        // Initialize conquest map with these assignments
        const initialConquestMap = initializeConquestMap(initialAssignment.countyIdToTeamId);
        setConquestMap(initialConquestMap);
        
        console.log('Initialized conquest map with', initialConquestMap.size, 'counties');
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
    
    // Set loading to false after a short delay to allow for smooth transition
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 seconds total (1.5s loading screen + 0.5s fade transition)

    return () => clearTimeout(timer);
  }, []);

  // Handle team victory - transfer territory from losing team to winning team
  const handleTeamVictory = (winningTeamName: string, losingTeamName: string) => {
    console.log(`🏆 ${winningTeamName} defeats ${losingTeamName} and takes their territory!`);
    
    // Find team IDs
    const winningTeam = teams.find(team => team.name === winningTeamName);
    const losingTeam = teams.find(team => team.name === losingTeamName);
    
    if (!winningTeam || !losingTeam) {
      console.error('Could not find teams:', { winningTeamName, losingTeamName });
      return;
    }

    // Process conquest if we have a conquest map
    if (conquestMap) {
      import('./utils/conquestTracker').then(({ processConquest }) => {
        // Transfer territory in conquest map
        const updatedMap = processConquest(conquestMap, winningTeam.id, losingTeam.id);
        setConquestMap(updatedMap);
      });
    }

    // Remove losing team from active teams
    setTeams(currentTeams => {
      const updatedTeams = currentTeams.filter(team => team.name !== losingTeamName);
      console.log(`🗺️ Removed ${losingTeamName}. ${updatedTeams.length} teams remaining`);
      return updatedTeams;
    });
  };

  return (
    <>
      <LoadingScreen />
      <div 
        className="app"
        style={{
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.5s ease-in-out'
        }}
      >
        <aside className="sidebar">
          <div className="sidebar-content">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
                <div className="sectionTitle">College Football Imperialism</div>
                <div
                  style={{
                    cursor: 'pointer',
                    fontSize: '16px',
                    color: 'inherit',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: 'transparent',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    setShowTooltip(true);
                    e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    setShowTooltip(false);
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  ⓘ
                </div>
              </div>
              {showTooltip && (
                <div
                  style={{
                    position: 'absolute',
                    top: '60px',
                    left: '20px',
                    right: '20px',
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '12px',
                    fontSize: '14px',
                    color: '#6b7280',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    zIndex: 1000,
                    maxWidth: '300px'
                  }}
                >
                  <ul style={{ margin: 0, paddingLeft: '16px', lineHeight: '1.4' }}>
                    <li>Teams start with the counties closest to their home stadium</li>
                    <li>Winning teams take losing teams' land</li>
                    <li>As the season progresses, defeated teams will be removed, leaving only undefeated teams</li>
                    <li>FCS wins/losses do not count towards totals</li>
                    <li>Have a suggestion? Reach out on X to @dvdhutch</li>
                  </ul>
                </div>
              )}
            </div>
            <div>
              <div className="sectionTitle">Active Teams ({teams.length})</div>
              <TeamList teams={teams} teamData={teamData} />
            </div>
            <UpcomingGames
              teams={teams}
              onTeamVictory={handleTeamVictory}
            />
          </div>
          <div className="sidebar-bottom">
            <BuyMeACoffee />
          </div>
        </aside>
        <main className="mapArea">
          <MapUSA
            teams={teams}
            fbsTeams={FBS_TEAMS}
            conquestMap={conquestMap}
          />
        </main>
      </div>
    </>
  );
}

export default App;
