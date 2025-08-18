import React, { useEffect, useMemo, useState } from 'react';
import { FBS_TEAM_NAMES, FBS_TEAMS } from '../data/fbs_teams';
import type { Team } from '../types';

type Props = {
  onAddTeam: (team: Omit<Team, 'id'>) => void;
};

export const TeamForm: React.FC<Props> = ({ onAddTeam }) => {
  const [name, setName] = useState('');
  const [colorHex, setColorHex] = useState('#7b1fa2');
  const [logoUrl, setLogoUrl] = useState('');
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');

  const suggestions = useMemo(() => {
    if (!name) return [] as string[];
    const q = name.toLowerCase();
    return FBS_TEAM_NAMES.filter(n => n.toLowerCase().includes(q)).slice(0, 8);
  }, [name]);

  // Prefill coordinates and other data if the typed name exactly matches a known FBS team
  useEffect(() => {
    const match = FBS_TEAMS.find(t => t.name.toLowerCase() === name.toLowerCase());
    if (match?.location) {
      setLat(String(match.location.lat));
      setLon(String(match.location.lon));
      if (match.colorHex) setColorHex(match.colorHex);
      if (match.logoUrl) setLogoUrl(match.logoUrl);
    }
  }, [name]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const latNum = Number(lat);
    const lonNum = Number(lon);
    if (!name || Number.isNaN(latNum) || Number.isNaN(lonNum)) return;
    onAddTeam({ name, colorHex, logoUrl, coords: { lat: latNum, lon: lonNum } });
    setName('');
    setLogoUrl('');
    setLat('');
    setLon('');
  }

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <label>
        Team name
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          list="team-suggestions"
          placeholder="Start typing…"
        />
      </label>
      <datalist id="team-suggestions">
        {suggestions.map(s => (
          <option key={s} value={s} />
        ))}
      </datalist>

      <label>
        Color
        <input type="color" value={colorHex} onChange={e => setColorHex(e.target.value)} />
      </label>

      <label>
        Logo URL
        <input 
          type="url" 
          value={logoUrl} 
          onChange={e => setLogoUrl(e.target.value)} 
          placeholder="https://example.com/logo.png (optional)"
        />
      </label>

      <div style={{ display: 'flex', gap: 8 }}>
        <label style={{ flex: 1 }}>
          Latitude
          <input value={lat} onChange={e => setLat(e.target.value)} placeholder="e.g. 42.056" />
        </label>
        <label style={{ flex: 1 }}>
          Longitude
          <input value={lon} onChange={e => setLon(e.target.value)} placeholder="e.g. -87.675" />
        </label>
      </div>

      <button type="submit">Add Team</button>
    </form>
  );
};


