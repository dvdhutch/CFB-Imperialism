import React from 'react';
import type { Team } from '../types';

type Props = {
  teams: Team[];
  onRemove?: (id: string) => void;
};

export const TeamList: React.FC<Props> = ({ teams, onRemove }) => {
  return (
    <div style={{ overflow: 'auto', maxHeight: '40vh' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left' }}>Color</th>
            <th style={{ textAlign: 'left' }}>Name</th>
            <th style={{ textAlign: 'left' }}>Lat</th>
            <th style={{ textAlign: 'left' }}>Lon</th>
            {onRemove && <th />}
          </tr>
        </thead>
        <tbody>
          {teams.map(t => (
            <tr key={t.id}>
              <td>
                <span
                  style={{ display: 'inline-block', width: 16, height: 16, background: t.colorHex, borderRadius: 2 }}
                />
              </td>
              <td>{t.name}</td>
              <td>{t.coords.lat.toFixed(3)}</td>
              <td>{t.coords.lon.toFixed(3)}</td>
              {onRemove && (
                <td>
                  <button onClick={() => onRemove(t.id)}>Remove</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


