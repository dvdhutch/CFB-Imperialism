export type LatLng = {
  lat: number;
  lon: number;
};

export type Team = {
  id: string;
  name: string;
  colorHex: string;
  logoUrl: string;
  coords: LatLng; // geographic coordinates (WGS84)
};

export type CountyFeature = GeoJSON.Feature<GeoJSON.MultiPolygon | GeoJSON.Polygon, {
  id: number;
  name?: string;
  state?: string;
}>;

export type CountyWithMetrics = {
  feature: CountyFeature;
  countyId: number;
  area: number; // spherical area in steradians (from d3.geoArea)
  centroid: [number, number]; // [lon, lat]
};

export type CountyNode = CountyWithMetrics & {
  index: number; // index within the original TopoJSON geometries array
  neighbors: number[]; // neighboring county indexes
};

export type AssignmentResult = {
  countyIdToTeamId: Map<number, string>;
  teamIdToArea: Map<string, number>;
  totalArea: number;
};


