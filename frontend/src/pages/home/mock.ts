import type { Ride, Route } from "./types";

export const mockRoute: Route = {
  origin: "PUCPR",
  destination: "Casa",
};

export const mockRides: Ride[] = [
  {
    id: "1",
    driver: {
      initials: "CR",
      name: "Carlos Ronaldo",
      rating: 4.9,
      ridesCount: 32,
    },
    similarity: "alta",
    modality: "app",
    time: "23:00",
    seatsTaken: 2,
    seatsTotal: 5,
    priceBRL: 5.9,
  },
  {
    id: "2",
    driver: {
      initials: "LR",
      name: "Luana Rocha",
      rating: 4.7,
      ridesCount: 18,
    },
    similarity: "media",
    modality: "carro",
    time: "23:00",
    seatsTaken: 4,
    seatsTotal: 5,
    priceBRL: 4.5,
  },
  {
    id: "3",
    driver: {
      initials: "RD",
      name: "Ramon Dino",
      rating: 4.5,
      ridesCount: 9,
    },
    similarity: "baixa",
    modality: "app",
    time: "23:50",
    seatsTaken: 1,
    seatsTotal: 3,
    priceBRL: 2.5,
  },
];
