import React from 'react';
import type { FbsTeamRecord } from '../data/fbs_teams';
import { CONFERENCE_LOGOS } from '../data/fbs_teams';

type Props = {
  team: FbsTeamRecord;
  onClose: () => void;
  position?: { x: number; y: number };
};

export const TeamPopup: React.FC<Props> = ({ team, onClose }) => {
  const conferenceLogoUrl = CONFERENCE_LOGOS[team.conference] || '';

  return (
    <div 
      className="team-popup-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
    >
      <div
        className="team-popup"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          maxWidth: '400px',
          width: '90%',
          maxHeight: '80vh',
          overflow: 'auto',
          position: 'relative'
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#000',
            zIndex: 1001,
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ×
        </button>

        {/* Stadium image */}
        {team.imageUrl && (
          <div style={{ width: '100%', height: '200px', overflow: 'hidden', borderRadius: '12px 12px 0 0' }}>
            <img
              src={team.imageUrl}
              alt={`${team.stadium}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>
        )}

        {/* Content */}
        <div style={{ padding: '20px' }}>
          {/* Team name and mascot */}
          <div style={{ marginBottom: '16px', textAlign: 'center' }}>
            <h2 style={{ 
              margin: '0 0 4px 0', 
              color: team.colorHex || '#333',
              fontSize: '24px',
              fontWeight: 'bold'
            }}>
              {team.name}
            </h2>
            {team.mascot && (
              <p style={{ 
                margin: '0', 
                color: '#666',
                fontSize: '16px',
                fontStyle: 'italic'
              }}>
                {team.mascot}
              </p>
            )}
          </div>

          {/* Location info */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontWeight: 'bold', marginRight: '8px', minWidth: '60px' }}>Location:</span>
              <span>{team.city}, {team.state}</span>
            </div>
          </div>

          {/* Stadium info */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontWeight: 'bold', marginRight: '8px', minWidth: '60px' }}>Stadium:</span>
              <span>{team.stadium}</span>
            </div>
            {team.stadiumCapacity && (
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontWeight: 'bold', marginRight: '8px', minWidth: '60px' }}>Capacity:</span>
                <span>{team.stadiumCapacity.toLocaleString()}</span>
              </div>
            )}
          </div>

          {/* Conference info */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontWeight: 'bold', marginRight: '8px', minWidth: '80px' }}>Conference:</span>
              {conferenceLogoUrl && (
                <img
                  src={conferenceLogoUrl}
                  alt={`${team.conference} logo`}
                  style={{
                    height: '24px',
                    width: 'auto',
                    maxWidth: '60px'
                  }}
                />
              )}
            </div>
          </div>

          {/* Team logo */}
          {team.logoUrl && (
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <img
                src={team.logoUrl}
                alt={`${team.name} logo`}
                style={{
                  height: '60px',
                  width: 'auto',
                  maxWidth: '120px'
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
