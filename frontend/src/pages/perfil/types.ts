export type Gender = "female" | "male";

export type Profile = {
  name: string;
  initials: string;
  job: string;
  gender: Gender;
  imageUrl?: string;
  identityVerified: boolean;
  stats: {
    rating: number;
    given: number;
    taken: number;
  };
};

export type Review = {
  id: string;
  author: {
    initials: string;
    name: string;
    imageUrl?: string;
  };
  when: string;
  route: string;
  rating: number;
  text: string;
};
