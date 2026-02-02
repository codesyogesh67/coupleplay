"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import Header from "@/components/Header";
import { GameButton } from "@/components/ui/game-button";

export default function Results({
  score,
  game,
}: {
  score: number | null;
  game?: string | null;
}) {
  const router = useRouter();

  const getMessage = (score: number) => {
    if (score >= 90) {
      return {
        emoji: "💘",
        title: "Perfect Match",
        description:
          "You’re deeply connected. Your bond is strong, natural, and full of love.",
      };
    }
    if (score >= 75) {
      return {
        emoji: "💞",
        title: "Strong Connection",
        description:
          "You understand each other well and grow stronger with every conversation.",
      };
    }
    return {
      emoji: "💬",
      title: "Growing Together",
      description:
        "Every great relationship grows with honest conversations. Keep talking.",
    };
  };

  if (!score || Number.isNaN(score)) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-24 px-4 text-center">
          <p className="text-muted-foreground">
            No results found. Try playing a game first.
          </p>
          <GameButton className="mt-6" onClick={() => router.push("/games")}>
            Go to Games
          </GameButton>
        </main>
      </div>
    );
  }

  const result = getMessage(score);

  return (
    <div className="min-h-screen">
      <Header />

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-lg mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-6xl mb-6">{result.emoji}</div>
            <h1 className="text-3xl font-bold mb-3">{result.title}</h1>
            <p className="text-muted-foreground mb-8">{result.description}</p>

            <div className="mb-10">
              <span className="text-sm text-muted-foreground">
                Your compatibility score
              </span>
              <div className="text-5xl font-bold mt-2">{score}%</div>
            </div>

            <div className="space-y-3">
              <GameButton
                className="w-full"
                onClick={() => router.push("/games")}
              >
                Try another game 💕
              </GameButton>

              <GameButton
                variant="skip"
                className="w-full"
                onClick={() => router.push("/")}
              >
                Back to Home
              </GameButton>
            </div>

            {game ? (
              <p className="mt-6 text-xs text-muted-foreground">
                Played: {game}
              </p>
            ) : null}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
