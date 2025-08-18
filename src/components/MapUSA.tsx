import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import type { D3ZoomEvent } from 'd3';
import { geoPath } from 'd3-geo';
import { loadUsCounties, computeCountyNodes, createUsaProjection } from '../utils/geo';
import type { Team, CountyNode } from '../types';
import { assignCountiesToTeams } from '../utils/assignment';
import type { FbsTeamRecord } from '../data/fbs_teams';
import { TeamPopup } from './TeamPopup';

type Props = {
  teams: Team[];
  fbsTeams: FbsTeamRecord[]; // Full team data for popups
  width?: number;
  height?: number;
  onMapClick?: (coords: { lat: number; lon: number }) => void;
};

export const MapUSA: React.FC<Props> = ({ teams, fbsTeams, width = 960, height = 600, onMapClick }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [counties, setCounties] = useState<CountyNode[] | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<FbsTeamRecord | null>(null);
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    loadUsCounties().then(({ counties, neighbors }) => {
      const countyNodes = computeCountyNodes(counties, neighbors);
      setCounties(countyNodes);
    }).catch(error => {
      console.error('Error loading counties:', error);
    });
  }, []);

  const projection = useMemo(() => createUsaProjection(width, height), [width, height]);
  const path = useMemo(() => geoPath(projection), [projection]);

  const assignment = useMemo(() => {
    if (!counties || teams.length === 0 || counties.length === 0) return null;
    try {
      return assignCountiesToTeams(counties, teams);
    } catch (error) {
      console.error('Error assigning counties to teams:', error);
      return null;
    }
  }, [counties, teams]);

  // Calculate territory centers for logo placement
  const territoryCenters = useMemo(() => {
    if (!assignment || !counties) return new Map();
    
    const centers = new Map<string, [number, number]>();
    
    for (const team of teams) {
      // Find all counties assigned to this team
      const teamCounties = counties.filter(county => 
        assignment.countyIdToTeamId.get(county.countyId) === team.id
      );
      
      if (teamCounties.length === 0) continue;
      
      // Calculate weighted centroid based on county areas
      let totalArea = 0;
      let weightedLon = 0;
      let weightedLat = 0;
      
      for (const county of teamCounties) {
        const [lon, lat] = county.centroid;
        const area = county.area;
        
        weightedLon += lon * area;
        weightedLat += lat * area;
        totalArea += area;
      }
      
      if (totalArea > 0) {
        const centerLon = weightedLon / totalArea;
        const centerLat = weightedLat / totalArea;
        centers.set(team.id, [centerLon, centerLat]);
      }
    }
    
    return centers;
  }, [assignment, counties, teams]);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g');
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.8, 20])
      .on('zoom', (event: D3ZoomEvent<SVGSVGElement, unknown>) => {
        g.attr('transform', event.transform.toString());
      });
    svg.call(zoom as any);

    if (!counties) {
      console.log('No counties loaded yet');
      return;
    }

    // Draw counties, fill by assignment if any
    g
      .selectAll('path.county')
      .data(counties, (d: any) => d.countyId)
      .join('path')
      .attr('class', 'county')
      .attr('d', (d) => path(d.feature)!)
      .attr('fill', (d) => {
        if (!assignment) return '#f0f0f0';
        const teamId = assignment.countyIdToTeamId.get(d.countyId);
        const team = teams.find(t => t.id === teamId);
        return team?.colorHex ?? '#ddd';
      })
      .attr('stroke', '#999')
      .attr('stroke-width', 0.3);

    // Draw team pins
    const pinGroup = g.append('g').attr('class', 'pins');
    pinGroup.selectAll('circle.pin')
      .data(teams)
      .join('circle')
      .attr('class', 'pin')
      .attr('cx', t => projection([t.coords.lon, t.coords.lat])?.[0] ?? -9999)
      .attr('cy', t => projection([t.coords.lon, t.coords.lat])?.[1] ?? -9999)
      .attr('r', 1)
      .attr('fill', t => t.colorHex)
      .attr('stroke', '#111')
      .attr('stroke-width', 0.2)
      .append('title')
      .text(t => t.name);

    // Draw team logos at territory centers
    const logoGroup = g.append('g').attr('class', 'logos');
    
    // Filter teams that have logos and territory centers
    const teamsWithLogos = teams.filter(team => 
      team.logoUrl && team.logoUrl.trim() !== '' && territoryCenters.has(team.id)
    );
    
    logoGroup.selectAll('image.team-logo')
      .data(teamsWithLogos)
      .join('image')
      .attr('class', 'team-logo')
      .attr('href', t => t.logoUrl)
      .attr('x', t => {
        const center = territoryCenters.get(t.id);
        if (!center) return -9999;
        const projected = projection(center);
        return projected ? projected[0] - 7.03125 : -9999; // Center the 14.0625px wide image
      })
      .attr('y', t => {
        const center = territoryCenters.get(t.id);
        if (!center) return -9999;
        const projected = projection(center);
        return projected ? projected[1] - 7.03125 : -9999; // Center the 14.0625px tall image
      })
      .attr('width', 14.0625)
      .attr('height', 14.0625)
      .style('pointer-events', 'none') // Allow clicks to pass through
      .append('title')
      .text(t => t.name);

    if (onMapClick) {
      svg.on('click', (event: MouseEvent) => {
        const [x, y] = d3.pointer(event, svg.node());
        const invert = projection.invert?.([x, y]);
        if (!invert) return;
        const [lon, lat] = invert;
        onMapClick({ lat, lon });
      });
    }

    // Add click handler for counties to show team popups
    g.selectAll('path.county')
      .on('click', (event: MouseEvent, d: any) => {
        if (!assignment) return;
        
        const teamId = assignment.countyIdToTeamId.get(d.countyId);
        if (teamId) {
          const fullTeamData = fbsTeams.find(fbsTeam => fbsTeam.id === teamId);
          if (fullTeamData) {
            const [x, y] = d3.pointer(event, document.body);
            setSelectedTeam(fullTeamData);
            setPopupPosition({ x, y });
          }
        }
      })
      .style('cursor', 'pointer');
  }, [counties, assignment, teams, path, projection, onMapClick, territoryCenters]);

  return (
    <>
      <svg ref={svgRef} width={width} height={height} style={{ background: 'white', border: '1px solid #ddd' }} />
      {selectedTeam && popupPosition && (
        <TeamPopup
          team={selectedTeam}
          position={popupPosition}
          onClose={() => {
            setSelectedTeam(null);
            setPopupPosition(null);
          }}
        />
      )}
    </>
  );
};


