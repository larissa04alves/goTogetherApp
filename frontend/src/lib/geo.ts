export type LngLat = [number, number];

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const OSRM_URL = "https://router.project-osrm.org/route/v1/driving";

type NominatimResult = {
  lon: string;
  lat: string;
};

export async function geocodeAddress(query: string): Promise<LngLat | null> {
  const url = `${NOMINATIM_URL}?format=jsonv2&limit=1&countrycodes=br&q=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    headers: { "Accept-Language": "pt-BR" },
  });
  if (!res.ok) {
    throw new Error(`Geocoding falhou (${res.status})`);
  }
  const results = (await res.json()) as NominatimResult[];
  const first = results[0];
  if (!first) return null;
  return [Number(first.lon), Number(first.lat)];
}

export type DrivingRoute = {
  coordinates: LngLat[];
  distanceKm: number;
  durationMin: number;
};

type OsrmResponse = {
  routes?: {
    geometry: { coordinates: LngLat[] };
    distance: number;
    duration: number;
  }[];
};

export async function fetchDrivingRoute(
  from: LngLat,
  to: LngLat,
): Promise<DrivingRoute | null> {
  const coords = `${from[0]},${from[1]};${to[0]},${to[1]}`;
  const url = `${OSRM_URL}/${coords}?overview=full&geometries=geojson`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Roteamento falhou (${res.status})`);
  }
  const data = (await res.json()) as OsrmResponse;
  const route = data.routes?.[0];
  if (!route) return null;
  return {
    coordinates: route.geometry.coordinates,
    distanceKm: route.distance / 1000,
    durationMin: route.duration / 60,
  };
}
