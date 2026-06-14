export type Review = {
  id: string;
  author: {
    initials: string;
    name: string;
    imageUrl?: string;
  };
  when: string;
  route?: string;
  rating: number;
  text: string;
};
