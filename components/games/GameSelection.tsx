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
  emoji: string; // using emoji as the “avatar”
};

const GAMES: Game[] = [
  {
    id: "cards",
    title: "Spark Deck",
    description:
      "Flip surprise prompts, spend skip tokens, and unlock spicy packs as you go.",
    emoji: "✨", // changed avatar (more “valentine spark” than 🃏)
  },
  {
    id: "questions",
    title: "Couple Questions",
    description:
      "Warm + fun questions that turn a quiet moment into a real conversation.",
    emoji: "💖",
  },
  {
    id: "compatibility",
    title: "Compatibility Night",
    description:
      "Answer together, compare vibes, and get a sweet compatibility recap at the end.",
    emoji: "💞",
  },
];

const THEME: Record<
  Game["id"],
  {
    tint: string;
    ring: string;
    badge: string;
    btn: string;
  }
> = {
  cards: {
    tint: "bg-white/[0.06]",
    ring: "border border-white/15",
    badge: "bg-pink-500/15",
    btn:
      "bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-600 hover:to-pink-600",
  },
  questions: {
    tint: "bg-white/[0.06]",
    ring: "border border-white/15",
    badge: "bg-rose-500/15",
    btn:
      "bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-600 hover:to-pink-600",
  },
  compatibility: {
    tint: "bg-white/[0.06]",
    ring: "border border-white/15",
    badge: "bg-fuchsia-500/15",
    btn:
      "bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-600 hover:to-pink-600",
  },
};

export default function GameSelection() {
  const router = useRouter();
  const startGame = (gameId: string) => router.push(`/play/${gameId}`);

  return (
    <div className="h-[100dvh] text-black flex flex-col">
      {/* bg-[#07060b] */}
      <Header />

      <main className="relative flex-1 min-h-0 pt-24 pb-14 px-4 overflow-y-auto">
        <div className="max-w-xl mx-auto">
          {/* Hero */}
          <motion.div
            initial="hidden"
            animate="show"
            className="text-center mb-10"
          >
            <motion.h1
              variants={headingIn}
              className="
                text-4xl sm:text-5xl font-extrabold tracking-tight mb-3
                bg-gradient-to-r from-pink-500 via-rose-500 to-violet-500
                bg-clip-text text-transparent
              "
            >
              Choose your vibe 💘
            </motion.h1>

            <motion.p variants={subheadingIn} className="text-gray-500">
              Pick a game and start a beautiful conversation together
            </motion.p>

            <div className="mt-6 flex items-center justify-center gap-3 text-sm text-gray-500">
              <span className="h-px w-10 bg-gray-500" />
              <span>3 ways to play</span>
              <span className="h-px w-10 bg-gray-500" />
            </div>
          </motion.div>

          {/* Cards */}
          <motion.div
            variants={listStagger}
            custom={0.18}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            {GAMES.map((game) => {
              const t = THEME[game.id];

              return (
                <motion.div
                  key={game.id}
                  variants={cardIn}
                  whileHover={{ y: -3, scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                  className={[
                    "relative rounded-3xl p-[1px]",
                    "bg-gradient-to-r",
                    t.ring,
                  ].join(" ")}
                >
                  <div
                    className={[
                      "rounded-3xl border border-white/10",
                      "bg-gradient-to-b",
                      t.tint,
                      "backdrop-blur-md",
                      "p-6",
                      "shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_18px_60px_-26px_rgba(236,72,153,0.45)]",
                    ].join(" ")}
                  >
                    <div className="flex items-start gap-4">
                      {/* avatar */}
                      <div className="relative">
                        <div
                          className={[
                            "grid h-12 w-12 place-items-center rounded-2xl",
                            "border border-white/10",
                            "bg-gradient-to-br",
                            t.badge,
                            "text-2xl",
                          ].join(" ")}
                        >
                          {game.emoji}
                        </div>
                        <div className="absolute -inset-3 rounded-3xl bg-white/5 blur-xl opacity-60" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <h2 className="text-xl font-semibold text-black/60">
                            {game.title}
                          </h2>
                        </div>

                        <p className="mt-2 text-sm leading-relaxed text-gray-600">
                          {game.description}
                        </p>

                        <Button
                          onClick={() => startGame(game.id)}
                          className={["w-full mt-5 text-white", t.btn].join(
                            " "
                          )}
                        >
                          Start Game
                        </Button>

                        <div className="mt-3 text-[11px] text-gray-500">
                          Quick, cozy, and made for two.
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          <div className="mt-10 text-center text-xs text-white/35">
            Tip: Start with Couple Questions, then end with Compatibility Night
            ✨
          </div>
        </div>
      </main>
    </div>
  );
}
