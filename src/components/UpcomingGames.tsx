import React, { useState } from 'react';
import type { UpcomingGame, Team } from '../types';
import { useUpcomingGames } from '../hooks/useUpcomingGames';
import { FBS_TEAMS } from '../data/fbs_teams';

type Props = {
  teams: Team[];
  onTeamVictory: (winningTeamName: string, losingTeamName: string) => void;
};

export const UpcomingGames: React.FC<Props> = ({ teams, onTeamVictory }) => {
  const [selectedWeek, setSelectedWeek] = useState<number>(0);
  const [selectedWinners, setSelectedWinners] = useState<Record<string, string>>({});
  const { games, totalWeeks, isLoading, error } = useUpcomingGames(selectedWeek);

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
        Loading upcoming games...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '20px', color: '#ef4444' }}>
        Error loading games: {error}
      </div>
    );
  }

  const handleTeamClick = (clickedTeamName: string, game: UpcomingGame) => {
    // Determine which team is the opponent
    const opponentTeamName = clickedTeamName === game.awayTeamName 
      ? game.homeTeamName 
      : game.awayTeamName;
    
    // Check if both teams are still active
    const clickedTeam = teams.find(team => team.name === clickedTeamName);
    const opponentTeam = teams.find(team => team.name === opponentTeamName);
    
    if (!clickedTeam) {
      console.warn(`${clickedTeamName} is not an active team`);
      return;
    }
    
    if (!opponentTeam) {
      console.warn(`${opponentTeamName} is not an active team`);
      return;
    }
    
    // Update the selected winner for this game
    setSelectedWinners(prev => ({
      ...prev,
      [game.id]: clickedTeamName
    }));
    
    // Simulate the victory
    onTeamVictory(clickedTeamName, opponentTeamName);
  };

  const getButtonStyle = (teamName: string, game: UpcomingGame, isActive: boolean) => {
    const isSelected = selectedWinners[game.id] === teamName;
    const baseStyle = {
      background: isSelected ? '#10b981' : 'transparent',
      border: 'none',
      cursor: isActive ? 'pointer' : 'not-allowed',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '4px 8px',
      borderRadius: '4px',
      transition: 'all 0.2s ease',
      opacity: isActive ? 1 : 0.5,
      width: '100%',
      color: isSelected ? 'white' : 'inherit'
    };

    return baseStyle;
  };

  const renderGame = (game: UpcomingGame) => {
    // Find team data from FBS_TEAMS
    const awayTeam = FBS_TEAMS.find(team => team.name === game.awayTeamName);
    const homeTeam = FBS_TEAMS.find(team => team.name === game.homeTeamName);

    // Check if teams are still active
    const isAwayTeamActive = teams.some(team => team.name === game.awayTeamName);
    const isHomeTeamActive = teams.some(team => team.name === game.homeTeamName);

    return (
      <div key={game.id} style={{ 
        marginBottom: '10px', 
        padding: '8px', 
        border: '1px solid #e5e7eb', 
        borderRadius: '6px', 
        backgroundColor: '#f9fafb',
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        gap: '8px',
        minHeight: '40px'
      }}>
        {/* Away Team Button - Fixed Position */}
        <button
          onClick={() => handleTeamClick(game.awayTeamName, game)}
          disabled={!isAwayTeamActive || !isHomeTeamActive}
          style={{
            ...getButtonStyle(game.awayTeamName, game, isAwayTeamActive && isHomeTeamActive),
            justifyContent: 'flex-end'
          }}
          onMouseEnter={(e) => {
            if (isAwayTeamActive && isHomeTeamActive && selectedWinners[game.id] !== game.awayTeamName) {
              e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
            }
          }}
          onMouseLeave={(e) => {
            if (selectedWinners[game.id] !== game.awayTeamName) {
              e.currentTarget.style.backgroundColor = selectedWinners[game.id] === game.awayTeamName ? '#10b981' : 'transparent';
            }
          }}
        >
          <span style={{ fontSize: '12px', fontWeight: 'bold', textAlign: 'right' }}>
            {game.awayTeamName}
          </span>
          <div style={{ 
            width: '24px', 
            height: '24px', 
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            backgroundColor: '#e5e7eb',
            flexShrink: 0
          }}>
            {awayTeam?.logoUrl ? (
              <img 
                src={awayTeam.logoUrl} 
                alt={`${game.awayTeamName} logo`}
                style={{ 
                  width: '20px', 
                  height: '20px', 
                  objectFit: 'contain'
                }}
                onError={(e) => {
                  // Fallback to initial if image fails to load
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fallback) {
                    fallback.style.display = 'flex';
                  }
                }}
              />
            ) : null}
            <div style={{ 
              display: awayTeam?.logoUrl ? 'none' : 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '20px',
              height: '20px',
              fontSize: '10px',
              fontWeight: 'bold',
              color: '#6b7280'
            }}>
              {game.awayTeamName.charAt(0)}
            </div>
          </div>
        </button>

        {/* @ Symbol - Fixed Position */}
        <div style={{ 
          fontSize: '14px', 
          fontWeight: 'bold', 
          color: '#6b7280', 
          textAlign: 'center',
          padding: '0 4px',
          flexShrink: 0
        }}>
          @
        </div>

        {/* Home Team Button - Fixed Position */}
        <button
          onClick={() => handleTeamClick(game.homeTeamName, game)}
          disabled={!isAwayTeamActive || !isHomeTeamActive}
          style={{
            ...getButtonStyle(game.homeTeamName, game, isAwayTeamActive && isHomeTeamActive),
            justifyContent: 'flex-start'
          }}
          onMouseEnter={(e) => {
            if (isAwayTeamActive && isHomeTeamActive && selectedWinners[game.id] !== game.homeTeamName) {
              e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
            }
          }}
          onMouseLeave={(e) => {
            if (selectedWinners[game.id] !== game.homeTeamName) {
              e.currentTarget.style.backgroundColor = selectedWinners[game.id] === game.homeTeamName ? '#10b981' : 'transparent';
            }
          }}
        >
          <div style={{ 
            width: '24px', 
            height: '24px', 
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            backgroundColor: '#e5e7eb',
            flexShrink: 0
          }}>
            {homeTeam?.logoUrl ? (
              <img 
                src={homeTeam.logoUrl} 
                alt={`${game.homeTeamName} logo`}
                style={{ 
                  width: '20px', 
                  height: '20px', 
                  objectFit: 'contain'
                }}
                onError={(e) => {
                  // Fallback to initial if image fails to load
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fallback) {
                    fallback.style.display = 'flex';
                  }
                }}
              />
            ) : null}
            <div style={{ 
              display: homeTeam?.logoUrl ? 'none' : 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '20px',
              height: '20px',
              fontSize: '10px',
              fontWeight: 'bold',
              color: '#6b7280'
            }}>
              {game.homeTeamName.charAt(0)}
            </div>
          </div>
          <span style={{ fontSize: '12px', fontWeight: 'bold', textAlign: 'left' }}>
            {game.homeTeamName}
          </span>
        </button>
      </div>
    );
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
        <div className="sectionTitle">Upcoming Games</div>
        <select 
          value={selectedWeek} 
          onChange={(e) => setSelectedWeek(Number(e.target.value))}
          style={{ 
            padding: '2px 6px', 
            border: '1px solid #d1d5db', 
            borderRadius: '4px', 
            fontSize: '12px',
            backgroundColor: 'white',
            color: '#374151'
          }}
        >
          {Array.from({ length: totalWeeks }, (_, i) => (
            <option key={i} value={i}>Week {i}</option>
          ))}
        </select>
      </div>

      {/* Games Container */}
      <div style={{ overflow: 'auto', maxHeight: '40vh' }}>
        {games.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
            No games scheduled for Week {selectedWeek}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {games.map(renderGame)}
          </div>
        )}
      </div>
    </div>
  );
};
