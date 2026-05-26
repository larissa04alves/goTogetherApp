export type Similarity = "alta" | "media" | "baixa";
export type Modality = "app" | "carro";

export type Ride = {
  id: string;
  driver: {
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
  time: string;
  seatsTaken: number;
  seatsTotal: number;
  priceBRL: number;
};

export type Route = {
  origin: string;
  destination: string;
};
