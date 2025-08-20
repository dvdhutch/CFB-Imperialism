import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import type { D3ZoomEvent } from 'd3';
import { geoPath } from 'd3-geo';
import { loadUsCounties, computeCountyNodes, createUsaProjection } from '../utils/geo';
import type { Team, CountyNode } from '../types';
import { assignCountiesToTeams } from '../utils/assignment';
import type { FbsTeamRecord } from '../data/fbs_teams';
import type { ConquestMap } from '../utils/conquestTracker';
import { TeamPopup } from './TeamPopup';

type Props = {
  teams: Team[];
  fbsTeams: FbsTeamRecord[]; // Full team data for popups
  conquestMap?: ConquestMap | null;
  onMapClick?: (coords: { lat: number; lon: number }) => void;
};

export const MapUSA: React.FC<Props> = ({ teams, fbsTeams, conquestMap, onMapClick }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [counties, setCounties] = useState<CountyNode[] | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<FbsTeamRecord | null>(null);
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null);
  const [selectedTeamTerritory, setSelectedTeamTerritory] = useState<number | undefined>(undefined);
  const [containerSize, setContainerSize] = useState({ width: 960, height: 600 });

  // Get container dimensions
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    loadUsCounties().then(({ counties, neighbors }) => {
      const countyNodes = computeCountyNodes(counties, neighbors);
      setCounties(countyNodes);
    }).catch(error => {
      console.error('Error loading counties:', error);
    });
  }, []);

  const projection = useMemo(() => createUsaProjection(containerSize.width, containerSize.height), [containerSize.width, containerSize.height]);
  const path = useMemo(() => geoPath(projection), [projection]);

  const assignment = useMemo(() => {
    if (!counties || teams.length === 0 || counties.length === 0) return null;
    try {
      return assignCountiesToTeams(counties, teams, conquestMap || undefined);
    } catch (error) {
      console.error('Error assigning counties to teams:', error);
      return null;
    }
  }, [counties, teams, conquestMap]);

  // Calculate territory centers for logo placement with conquest logic
  const territoryCenters = useMemo(() => {
    if (!assignment || !counties || !conquestMap) return new Map();
    
    const centers = new Map<string, [number, number]>();
    
    for (const team of teams) {
      // Find all counties assigned to this team
      const teamCounties = counties.filter(county => 
        assignment.countyIdToTeamId.get(county.countyId) === team.id
      );
      
      if (teamCounties.length === 0) continue;
      
      // Separate original and conquered counties
      const originalCounties = teamCounties.filter(county => {
        // A county is "original" if it was initially assigned to this team
        // We need to check if this county was originally closest to this team's stadium
        let closestTeam = fbsTeams[0];
        let minDistance = Infinity;

        for (const fbsTeam of fbsTeams) {
          if (!fbsTeam.location) continue;
          const stadiumCoords = [fbsTeam.location.lon, fbsTeam.location.lat] as [number, number];
          const distance = d3.geoDistance(stadiumCoords, county.centroid as [number, number]);
          
          if (distance < minDistance) {
            minDistance = distance;
            closestTeam = fbsTeam;
          }
        }
        
        return closestTeam.id === team.id;
      });
      
      const conqueredCounties = teamCounties.filter(county =>
        !originalCounties.includes(county)
      );
      
      // If no conquered territory, use simple centroid
      if (conqueredCounties.length === 0) {
        // Calculate weighted centroid for original territory
        let totalArea = 0;
        let weightedLon = 0;
        let weightedLat = 0;
        
        for (const county of originalCounties) {
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
      } else {
        // Check if conquered territory is contiguous with original territory
        const isContiguous = conqueredCounties.some(conqueredCounty =>
          originalCounties.some(originalCounty => {
            const [lon1, lat1] = conqueredCounty.centroid;
            const [lon2, lat2] = originalCounty.centroid;
            const distance = Math.sqrt(Math.pow(lon1 - lon2, 2) + Math.pow(lat1 - lat2, 2));
            return distance < 0.5; // Threshold for "adjacent" counties
          })
        );
        
        if (isContiguous) {
          // Place logo in center of total territory (original + conquered)
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
        } else {
          // Place separate logos for original and conquered territories
          // Original territory logo
          if (originalCounties.length > 0) {
            let totalArea = 0;
            let weightedLon = 0;
            let weightedLat = 0;
            
            for (const county of originalCounties) {
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
          
          // Conquered territory logo (use a different key to distinguish)
          if (conqueredCounties.length > 0) {
            let totalArea = 0;
            let weightedLon = 0;
            let weightedLat = 0;
            
            for (const county of conqueredCounties) {
              const [lon, lat] = county.centroid;
              const area = county.area;
              
              weightedLon += lon * area;
              weightedLat += lat * area;
              totalArea += area;
            }
            
            if (totalArea > 0) {
              const centerLon = weightedLon / totalArea;
              const centerLat = weightedLat / totalArea;
              centers.set(`${team.id}_conquered`, [centerLon, centerLat]);
            }
          }
        }
      }
    }
    
    return centers;
  }, [assignment, counties, teams, conquestMap]);

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
    
    // Create logo data array including both original and conquered territories
    const logoData: Array<{
      teamId: string;
      logoUrl: string;
      teamName: string;
      center: [number, number];
      isConquered: boolean;
    }> = [];
    
    for (const team of teams) {
      if (!team.logoUrl || team.logoUrl.trim() === '') continue;
      
      // Add original territory logo
      const originalCenter = territoryCenters.get(team.id);
      if (originalCenter) {
        logoData.push({
          teamId: team.id,
          logoUrl: team.logoUrl,
          teamName: team.name,
          center: originalCenter,
          isConquered: false
        });
      }
      
      // Add conquered territory logo
      const conqueredCenter = territoryCenters.get(`${team.id}_conquered`);
      if (conqueredCenter) {
        logoData.push({
          teamId: team.id,
          logoUrl: team.logoUrl,
          teamName: team.name,
          center: conqueredCenter,
          isConquered: true
        });
      }
    }
    
    logoGroup.selectAll('image.team-logo')
      .data(logoData)
      .join('image')
      .attr('class', 'team-logo')
      .attr('href', d => d.logoUrl)
      .attr('x', d => {
        const projected = projection(d.center);
        return projected ? projected[0] - 7.03125 : -9999; // Center the 14.0625px wide image
      })
      .attr('y', d => {
        const projected = projection(d.center);
        return projected ? projected[1] - 7.03125 : -9999; // Center the 14.0625px tall image
      })
      .attr('width', 14.0625)
      .attr('height', 14.0625)
      .style('pointer-events', 'none') // Allow clicks to pass through
      .style('opacity', d => d.isConquered ? 0.8 : 1) // Slightly transparent for conquered logos
      .append('title')
      .text(d => `${d.teamName}${d.isConquered ? ' (Conquered Territory)' : ''}`);

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
            const teamArea = assignment.teamIdToArea.get(teamId) || 0;
            // Convert steradians to square miles
            const squareMiles = teamArea * (196.9e6 / (4 * Math.PI));
            setSelectedTeam(fullTeamData);
            setPopupPosition({ x, y });
            setSelectedTeamTerritory(squareMiles);
          }
        }
      })
      .style('cursor', 'pointer');
  }, [counties, assignment, teams, path, projection, onMapClick, territoryCenters, containerSize]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <svg ref={svgRef} width={containerSize.width} height={containerSize.height} style={{ background: 'white', border: '1px solid #ddd' }} />
      {selectedTeam && popupPosition && (
                  <TeamPopup
            team={selectedTeam}
            position={popupPosition}
            territorySize={selectedTeamTerritory}
            onClose={() => {
              setSelectedTeam(null);
              setPopupPosition(null);
              setSelectedTeamTerritory(undefined);
            }}
          />
      )}
    </div>
  );
};


