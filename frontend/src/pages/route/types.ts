export type Endpoint = {
  label: string;
  address: string;
  kind: "origin" | "home" | "work";
};

export type SavedRoute = {
  id: string;
  origin: Endpoint;
  destination: Endpoint;
  departureTime: string;
};
