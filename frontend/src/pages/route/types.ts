export type Endpoint = {
  label: string;
  address: string;
  kind: "origin" | "home" | "work";
  lat: number;
  lng: number;
};

export type SavedRoute = {
  id: string;
  origin: Endpoint;
  destination: Endpoint;
  departureTime: string;
};
