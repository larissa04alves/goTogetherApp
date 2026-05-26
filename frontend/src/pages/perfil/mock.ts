import type { Profile, Review } from "./types";

export const mockProfile: Profile = {
  name: "Visitante",
  initials: "VI",
  job: "Estudante de Engenharia de Software",
  gender: "female",
  identityVerified: true,
  stats: {
    rating: 4.9,
    given: 12,
    taken: 28,
  },
};

export const mockReviews: Review[] = [
  {
    id: "1",
    author: { initials: "CR", name: "Carlos Ronaldo" },
    when: "há 2 dias",
    route: "PUCPR · Casa",
    rating: 5,
    text: "Pontual, super tranquila no trajeto. Recomendo demais!",
  },
  {
    id: "2",
    author: { initials: "JM", name: "Júlia Mendes" },
    when: "há 1 semana",
    route: "PUCPR · Casa",
    rating: 5,
    text: "Carona super segura, dirige com calma. Já virou rotina!",
  },
];
