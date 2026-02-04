export type CardType =
  | "question"
  | "scenario"
  | "confession"
  | "guess"
  | "challenge";

export type CardDTO = {
  id: string;
  packId: string;
  packTitle: string;
  type: CardType;
  text: string;
  options?: string[];
};

export type PackDTO = {
  id: string;
  title: string;
  description: string;
  locked?: boolean;
};
