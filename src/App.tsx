import { useState, useEffect } from 'react';
import './App.css';
import type { Team } from './types';
import { TeamList } from './components/TeamList';
import { MapUSA } from './components/MapUSA';
import { getTeamsWithCompleteData, FBS_TEAMS } from './data/fbs_teams';

function App() {
  const [teams, setTeams] = useState<Team[]>([]);

  // Load teams with complete data on component mount
  useEffect(() => {
    const completeTeams = getTeamsWithCompleteData();
    console.log('Loaded teams:', completeTeams);
    setTeams(completeTeams);
  }, []);

  function removeTeam(id: string) {
    setTeams(prev => prev.filter(t => t.id !== id));
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div>
          <div className="sectionTitle">College Football Imperialism Map</div>
          <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 16 }}>
            Teams with location data are automatically displayed. As the season progresses, 
            defeated teams will be removed, leaving only undefeated teams.
          </div>
        </div>
        <div>
          <div className="sectionTitle">Active Teams ({teams.length})</div>
          <TeamList teams={teams} onRemove={removeTeam} />
        </div>
        <div style={{ fontSize: 12, color: '#6b7280' }}>
          Currently showing {teams.length} teams with location data.
        </div>
      </aside>
      <main className="mapArea">
        <MapUSA
          teams={teams}
          fbsTeams={FBS_TEAMS}
          onMapClick={(coords) => {
            // Copy clicked coords to clipboard in JSON for convenience
            navigator.clipboard?.writeText(JSON.stringify(coords));
          }}
        />
      </main>
    </div>
  );
}

export default App;
