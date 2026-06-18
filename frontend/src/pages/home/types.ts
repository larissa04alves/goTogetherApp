export type Similarity = "alta" | "media" | "baixa";
export type Modality = "app" | "carro";

export type Ride = {
  id: string;
  driver: {
    id: string;
    initials: string;
    name: string;
    rating: number;
    ridesCount: number;
    verified: boolean;
    imageUrl?: string;
  };
  car?: {
    model: string;
    plate: string;
  };
  similarity: Similarity;
  similarityMatchPct: number;
  modality: Modality;
  womenOnly: boolean;
  time: string;
  seatsTaken: number;
  seatsTotal: number;
  priceBRL: number;
  route: {
    origin: { label: string; address: string };
    destination: { label: string; address: string };
  };
};
