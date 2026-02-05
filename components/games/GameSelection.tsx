"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import Header from "@/components/Header";
import { Button } from "@/components/ui/button";

import { headingIn, subheadingIn, listStagger, cardIn } from "@/lib/motion";

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
            initial="hidden"
            animate="show"
            className="text-center mb-10"
          >
            <motion.h1 variants={headingIn} className="text-3xl font-bold mb-3">
              Choose a Game 💘
            </motion.h1>

            <motion.p variants={subheadingIn} className="text-muted-foreground">
              Pick a game and start a beautiful conversation together
            </motion.p>
          </motion.div>

          {/* Games list */}
          <div className="space-y-4">
            <motion.div
              variants={listStagger}
              custom={0.18}
              initial="hidden"
              animate="show"
              className="space-y-4"
            >
              {GAMES.map((game) => (
                <motion.div
                  key={game.id}
                  variants={cardIn}
                  whileHover={{ y: -2, scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="
                border border-white/20
                rounded-2xl
                bg-white/5
                backdrop-blur-md
                shadow-md
                p-5
              "
                >
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{game.emoji}</div>

                    <div className="flex-1">
                      <h2 className="text-lg font-semibold mb-1">
                        {game.title}
                      </h2>
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
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
