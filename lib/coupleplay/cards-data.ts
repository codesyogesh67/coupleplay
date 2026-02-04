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
  options?: string[]; // optional for guess/choice-like
};

export type PackDTO = {
  id: string;
  title: string;
  description: string;
  locked?: boolean;
};
export const PACKS: PackDTO[] = [
  {
    id: "warmup",
    title: "Card Confessions",
    description: "Honest, cozy, and a little vulnerable.",
  },
  {
    id: "fun",
    title: "Laugh & Spill",
    description: "Silly prompts + fun chaos.",
  },
  {
    id: "deep",
    title: "Truth Roulette",
    description: "Deeper questions with higher stakes.",
    // locked: true,
  },
  {
    id: "future",
    title: "Little Love Cards",
    description: "Romantic, soft, future-us vibes.",
    // locked: true,
  },
];

export const CARDS: CardDTO[] = [
  // Warmup
  {
    id: "w1",
    packId: "warmup",
    packTitle: "Warm Up",
    type: "question",
    text: "What was your first impression of me?",
  },
  {
    id: "w2",
    packId: "warmup",
    packTitle: "Warm Up",
    type: "scenario",
    text: "We get a free flight tomorrow. Where do we go and why?",
  },

  // Fun
  {
    id: "f1",
    packId: "fun",
    packTitle: "Fun & Silly",
    type: "scenario",
    text: "We switch lives for a day. What’s the first thing you’d do?",
  },
  {
    id: "f2",
    packId: "fun",
    packTitle: "Fun & Silly",
    type: "challenge",
    text: "Compliment me in the most dramatic way possible. (30 seconds)",
  },

  // Deep
  {
    id: "d1",
    packId: "deep",
    packTitle: "Deep Talk",
    type: "confession",
    text: "Say one thing you wish I understood better about you.",
  },
  {
    id: "d2",
    packId: "deep",
    packTitle: "Deep Talk",
    type: "question",
    text: "What do you need more of from me lately?",
  },

  // Future
  {
    id: "fu1",
    packId: "future",
    packTitle: "Future",
    type: "question",
    text: "In two years, what does a perfect weekend look like for us?",
  },
  {
    id: "fu2",
    packId: "future",
    packTitle: "Future",
    type: "guess",
    text: "Guess: what’s my ideal ‘date night’?",
    options: ["Cozy at home", "Dinner out", "Adventure", "Surprise me"],
  },
];
