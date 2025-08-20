import React from 'react';
import type { Team } from '../types';

type Props = {
  teams: Team[];
  teamData: {
    areas: Map<string, number>;
    countyCounts: Map<string, number>;
  };
};

export const TeamList: React.FC<Props> = ({ teams, teamData }) => {
  return (
    <div style={{ overflow: 'auto', maxHeight: '40vh' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left' }}></th>
            <th style={{ textAlign: 'left' }}></th>
            <th style={{ textAlign: 'left' }}>Team</th>
            <th style={{ textAlign: 'left' }}>Territory (mi²)</th>
          </tr>
        </thead>
        <tbody>
          {teams
            .map(t => {
              const area = teamData.areas.get(t.id) || 0;
              // Convert steradians to square miles
              // Earth's surface area is about 196.9 million square miles
              // 1 steradian = (196.9 million / (4π)) square miles ≈ 15.67 million square miles
              const squareMiles = area * (196.9e6 / (4 * Math.PI));
              return { ...t, squareMiles };
            })
            .sort((a, b) => b.squareMiles - a.squareMiles)
            .map((t, index) => (
              <tr key={t.id}>
                <td style={{ fontWeight: 'bold' }}>{index + 1}</td>
                <td>
                  <span
                    style={{ display: 'inline-block', width: 16, height: 16, background: t.colorHex, borderRadius: 2 }}
                  />
                </td>
                <td>{t.name}</td>
                <td>{Math.round(t.squareMiles).toLocaleString()}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};


