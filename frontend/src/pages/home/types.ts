export type Similarity = "alta" | "media" | "baixa";
export type Modality = "app" | "carro";

export type Ride = {
  id: string;
  driver: {
    initials: string;
    name: string;
    rating: number;
    ridesCount: number;
    imageUrl?: string;
  };
  similarity: Similarity;
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
