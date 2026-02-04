"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import Header from "@/components/Header";
import { Button } from "@/components/ui/button";

type Game = {
  id: string;
  title: string;
  description: string;
  emoji: string;
};

const GAMES: Game[] = [
  {
    id: "cards",
    title: "Card Table",
    description:
      "Draw random cards, use skip tokens, unlock packs — real game night vibes",
    emoji: "🃏",
  },
  {
    id: "questions",
    title: "Couple Questions",
    description: "Warm, fun questions to spark meaningful conversations",
    emoji: "💖",
  },
  {
    id: "compatibility",
    title: "Compatibility Night",
    description: "Answer together and get a thoughtful compatibility summary",
    emoji: "💞",
  },
];
export default function GameSelection() {
  const router = useRouter();

  const startGame = (gameId: string) => {
    router.push(`/play/${gameId}`);
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main className="pt-24 pb-12 px-4">
        <div className="max-w-lg mx-auto">
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="text-3xl font-bold mb-3">Choose a Game 💘</h1>
            <p className="text-muted-foreground">
              Pick a game and start a beautiful conversation together
            </p>
          </motion.div>

          {/* Games list */}
          <div className="space-y-4">
            {GAMES.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-3xl border border-border bg-card p-5 shadow-soft"
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{game.emoji}</div>

                  <div className="flex-1">
                    <h2 className="text-lg font-semibold mb-1">{game.title}</h2>
                    <p className="text-sm text-muted-foreground mb-4">
                      {game.description}
                    </p>

                    <Button
                      onClick={() => startGame(game.id)}
                      className="w-full"
                    >
                      Start Game
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
