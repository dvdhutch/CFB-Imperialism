import * as topojson from 'topojson-client';
import { geoAlbersUsa, geoArea, geoCentroid } from 'd3-geo';
import type { CountyFeature, CountyNode } from '../types';
// We'll use dynamic import for the TopoJSON data

export async function loadUsCounties(): Promise<{ counties: CountyFeature[]; neighbors: number[][] }> {
  const response = await fetch('https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json');
  
  if (!response.ok) {
    throw new Error(`Failed to fetch TopoJSON data: ${response.status} ${response.statusText}`);
  }
  
  const topo = await response.json();
  
  if (!topo.objects || !topo.objects.counties) {
    throw new Error('Invalid TopoJSON structure - missing counties object');
  }

  if (!topo.objects.counties.geometries || topo.objects.counties.geometries.length === 0) {
    throw new Error('No county geometries found in TopoJSON');
  }
  
  // Convert each geometry to a feature
  const counties: CountyFeature[] = topo.objects.counties.geometries
    .map((geom: any, index: number) => {
      // Convert individual geometry to feature
      const feature = topojson.feature(topo as any, geom);
      const countyId = Number(geom.id || geom.properties?.id || index);
      
      return {
        type: 'Feature' as const,
        geometry: feature.geometry,
        properties: {
          id: countyId,
        },
      };
    })
    .filter((f: CountyFeature) => {
      // Filter out Alaska counties (state FIPS code 02) but keep Hawaii (state FIPS code 15)
      // County FIPS codes for Alaska start with 02, Hawaii with 15
      const countyId = f.properties.id;
      const stateFips = Math.floor(countyId / 1000);
      return stateFips !== 2; // Exclude Alaska (FIPS code 02) but keep Hawaii (FIPS code 15)
    });
  
  // Compute neighbors from the original TopoJSON geometries
  const neighbors: number[][] = topojson.neighbors(topo.objects.counties.geometries);
  return { counties, neighbors };
}

export function computeCountyNodes(counties: CountyFeature[], neighbors: number[][]): CountyNode[] {
  return counties.map((f, index) => ({
    feature: f,
    countyId: f.properties.id,
    area: geoArea(f as any),
    centroid: geoCentroid(f as any) as [number, number],
    index,
    neighbors: neighbors[index] ?? [],
  }));
}

export function createUsaProjection(width: number, height: number) {
  // Use geoAlbersUsa for high-quality zoom and projection, but Alaska counties are filtered out
  return geoAlbersUsa().fitExtent(
    [
      [10, 10],
      [width - 10, height - 10],
    ],
    { type: 'Sphere' } as any,
  );
}


