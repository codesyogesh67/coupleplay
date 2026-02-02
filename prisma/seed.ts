import { PrismaClient, QuestionType } from "@prisma/client";

const prisma = new PrismaClient();

const gameQuestions: Record<
  string,
  { question: string; category: string; type: "discuss" | "choice" | "input" }[]
> = {
  questions: [
    {
      question: "What's one thing you've always wanted to try together?",
      category: "Fun",
      type: "discuss",
    },
    {
      question: "When did you first realize you were falling in love?",
      category: "Emotional",
      type: "discuss",
    },
    {
      question: "What's your favorite memory of us?",
      category: "Warm-up",
      type: "discuss",
    },
    {
      question: "Where do you see us in 5 years?",
      category: "Future",
      type: "discuss",
    },
    {
      question: "What small thing do I do that makes you happy?",
      category: "Emotional",
      type: "discuss",
    },
  ],
  "know-me": [
    {
      question: "What's my biggest fear?",
      category: "Emotional",
      type: "input",
    },
    {
      question: "What's my favorite comfort food?",
      category: "Fun",
      type: "choice",
    },
    {
      question: "What's my dream vacation destination?",
      category: "Future",
      type: "input",
    },
    {
      question: "What song reminds you of me?",
      category: "Warm-up",
      type: "input",
    },
    {
      question: "What's the first thing I'd buy if I won the lottery?",
      category: "Fun",
      type: "choice",
    },
  ],
  compatibility: [
    {
      question: "How do you prefer to spend a quiet evening together?",
      category: "Warm-up",
      type: "choice",
    },
    {
      question: "What's your love language?",
      category: "Emotional",
      type: "choice",
    },
    {
      question: "How do you handle disagreements?",
      category: "Emotional",
      type: "choice",
    },
    {
      question: "What's more important: adventure or stability?",
      category: "Future",
      type: "choice",
    },
    {
      question: "How often do you need alone time?",
      category: "Fun",
      type: "choice",
    },
  ],
};

const choiceOptions: Record<string, string[]> = {
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
  await prisma.question.deleteMany({});

  // insert questions with order + options
  for (const [gameId, questions] of Object.entries(gameQuestions)) {
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      await prisma.question.create({
        data: {
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
