import { PrismaClient, QuestionType } from "@prisma/client";

const prisma = new PrismaClient();
const gameQuestions: Record<
  string,
  { question: string; category: string; type: "discuss" | "choice" | "input" }[]
> = {
  questions: [
    // Warm-up
    {
      question: "What moment today made you feel closest to me?",
      category: "Warm-up",
      type: "discuss",
    },
    {
      question: "What’s one small thing I did recently that you appreciated?",
      category: "Warm-up",
      type: "discuss",
    },
    {
      question: "What’s a recent ‘us’ moment you want to relive?",
      category: "Warm-up",
      type: "discuss",
    },

    // Fun
    {
      question:
        "If we had a free day with no responsibilities, how would we spend it?",
      category: "Fun",
      type: "discuss",
    },
    {
      question: "Which date idea sounds most like us?",
      category: "Fun",
      type: "choice",
    },
    {
      question: "What’s a silly tradition we should start?",
      category: "Fun",
      type: "discuss",
    },
    {
      question: "If we were a duo in a movie, what genre would we be?",
      category: "Fun",
      type: "input",
    },

    // Emotional
    {
      question: "When do you feel most loved by me?",
      category: "Emotional",
      type: "discuss",
    },
    {
      question:
        "What’s something you wish I understood about you without you having to explain it?",
      category: "Emotional",
      type: "discuss",
    },
    {
      question: "What’s one insecurity you’re working on right now?",
      category: "Emotional",
      type: "discuss",
    },

    // Trust
    {
      question: "What helps you feel safe being fully honest with me?",
      category: "Trust",
      type: "discuss",
    },
    {
      question: "What does ‘loyalty’ mean to you in a relationship?",
      category: "Trust",
      type: "discuss",
    },

    // Conflict
    {
      question:
        "When we argue, what do you need from me in the first 10 minutes?",
      category: "Conflict",
      type: "discuss",
    },
    {
      question: "Which repair attempt works best for you after tension?",
      category: "Conflict",
      type: "choice",
    },

    // Future
    {
      question: "What’s one shared goal you’d love us to achieve this year?",
      category: "Future",
      type: "discuss",
    },
    {
      question:
        "What kind of life do you want to build—calm, adventurous, or a mix?",
      category: "Future",
      type: "choice",
    },
    {
      question: "What would make you feel proud of us in 5 years?",
      category: "Future",
      type: "discuss",
    },
  ],

  "know-me": [
    // Emotional
    {
      question: "What do you think I’m most afraid of losing?",
      category: "Emotional",
      type: "input",
    },
    {
      question: "When I’m stressed, what’s the most helpful way to support me?",
      category: "Emotional",
      type: "choice",
    },
    {
      question: "What compliment means the most to me?",
      category: "Emotional",
      type: "input",
    },

    // Fun
    {
      question: "What’s my secret ‘feel-good’ habit?",
      category: "Fun",
      type: "input",
    },
    {
      question: "Which gift would make me happiest?",
      category: "Fun",
      type: "choice",
    },

    // Values
    {
      question:
        "What do you think I value more: comfort, freedom, or achievement?",
      category: "Values",
      type: "choice",
    },
    {
      question: "What’s one principle I refuse to compromise on?",
      category: "Values",
      type: "input",
    },

    // Growth
    {
      question: "What’s one way you’ve seen me grow since we met?",
      category: "Growth",
      type: "discuss",
    },
    {
      question: "What do you think I’m still learning in love?",
      category: "Growth",
      type: "input",
    },
  ],

  compatibility: [
    // Lifestyle
    {
      question: "What’s our ideal weekend rhythm?",
      category: "Warm-up",
      type: "choice",
    },
    {
      question: "How do you like to receive affection most days?",
      category: "Intimacy",
      type: "choice",
    },

    // Conflict styles
    {
      question: "When conflict happens, what’s the healthiest pattern for us?",
      category: "Conflict",
      type: "choice",
    },
    {
      question: "What’s your preferred way to repair after conflict?",
      category: "Conflict",
      type: "choice",
    },

    // Values / Future
    {
      question: "What matters more long-term: stability, growth, or adventure?",
      category: "Future",
      type: "choice",
    },
    {
      question: "How should we handle big decisions?",
      category: "Values",
      type: "choice",
    },

    // Money (important + spicy but safe)
    { question: "What’s your money style?", category: "Money", type: "choice" },
    {
      question: "When it comes to spending, what’s ‘too much’ for you?",
      category: "Money",
      type: "discuss",
    },

    // Family / Social
    {
      question: "How much time feels right with family and friends?",
      category: "Family",
      type: "choice",
    },
  ],
};
const choiceOptions: Record<string, string[]> = {
  "Which date idea sounds most like us?": [
    "Cozy movie + snacks",
    "Trying a new restaurant",
    "Long walk + deep talk",
    "Game night / playful competition",
  ],
  "Which repair attempt works best for you after tension?": [
    "A hug / physical comfort",
    "A calm talk + apology",
    "Time alone then reconnect",
    "Do something fun to reset",
  ],
  "What kind of life do you want to build—calm, adventurous, or a mix?": [
    "Calm and steady",
    "Adventurous and spontaneous",
    "A balanced mix",
    "Depends on the season",
  ],
  "When I’m stressed, what’s the most helpful way to support me?": [
    "Listen without fixing",
    "Help me problem-solve",
    "Give me space",
    "Distract me with something fun",
  ],
  "Which gift would make me happiest?": [
    "Something sentimental",
    "Something useful",
    "An experience together",
    "A surprise I didn’t expect",
  ],
  "What do you think I value more: comfort, freedom, or achievement?": [
    "Comfort",
    "Freedom",
    "Achievement",
    "A mix of all",
  ],
  "What’s our ideal weekend rhythm?": [
    "Slow mornings + cozy plans",
    "One adventure day, one rest day",
    "Social + friends + plans",
    "Spontaneous, no schedule",
  ],
  "How do you like to receive affection most days?": [
    "Touch (hugs, cuddles)",
    "Words (compliments, reassurance)",
    "Time (focused attention)",
    "Help (support and actions)",
  ],
  "When conflict happens, what’s the healthiest pattern for us?": [
    "Talk it out right away",
    "Pause and come back later",
    "Write it down first",
    "Take a walk then talk",
  ],
  "What’s your preferred way to repair after conflict?": [
    "Apology + reassurance",
    "Quality time together",
    "Physical comfort",
    "A plan to do better next time",
  ],
  "What matters more long-term: stability, growth, or adventure?": [
    "Stability",
    "Growth",
    "Adventure",
    "A balance",
  ],
  "How should we handle big decisions?": [
    "Talk until we fully agree",
    "List pros/cons then decide",
    "Sleep on it and revisit",
    "Set a deadline and commit",
  ],
  "What’s your money style?": [
    "Saver",
    "Spender",
    "Balanced",
    "Depends on goals",
  ],
  "How much time feels right with family and friends?": [
    "A lot (they’re central)",
    "Balanced mix",
    "Mostly us, some social",
    "Depends on the month",
  ],

  // keep your existing ones too:
  "What's my favorite comfort food?": [
    "Pizza",
    "Ice Cream",
    "Pasta",
    "Chocolate",
  ],
  "What's the first thing I'd buy if I won the lottery?": [
    "House",
    "Car",
    "Trip",
    "Business",
  ],
  "How do you prefer to spend a quiet evening together?": [
    "Movies at home",
    "Cooking together",
    "Reading side by side",
    "Walking outside",
  ],
  "What's your love language?": [
    "Words of affirmation",
    "Acts of service",
    "Receiving gifts",
    "Quality time",
  ],
  "How do you handle disagreements?": [
    "Talk it out immediately",
    "Take time to cool off",
    "Write it down",
    "Seek compromise",
  ],
  "What's more important: adventure or stability?": [
    "Adventure",
    "Stability",
    "A mix of both",
    "Depends on the day",
  ],
  "How often do you need alone time?": ["Daily", "Weekly", "Rarely", "Never"],
};

async function main() {
  // upsert games
  const games = [
    { id: "questions", title: "Couple Questions" },
    { id: "know-me", title: "Know Me" },
    { id: "compatibility", title: "Compatibility" },
  ];

  for (const g of games) {
    await prisma.game.upsert({
      where: { id: g.id },
      update: { title: g.title },
      create: { id: g.id, title: g.title },
    });
  }

  // wipe old questions (optional)
  await prisma.question.deleteMany({
    where: { gameId: { in: games.map((g) => g.id) } },
  });

  // insert questions with order + options
  // ✅ DON'T wipe everything in prod
  // await prisma.question.deleteMany({});

  for (const [gameId, questions] of Object.entries(gameQuestions)) {
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];

      await prisma.question.upsert({
        where: {
          gameId_order: {
            gameId,
            order: i,
          },
        },
        update: {
          text: q.question,
          category: q.category,
          type: q.type as QuestionType,
          options: q.type === "choice" ? choiceOptions[q.question] ?? [] : [],
        },
        create: {
          gameId,
          text: q.question,
          category: q.category,
          type: q.type as QuestionType,
          options: q.type === "choice" ? choiceOptions[q.question] ?? [] : [],
          order: i,
        },
      });
    }
  }

  console.log("Seed complete ✅");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
