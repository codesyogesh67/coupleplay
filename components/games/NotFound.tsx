"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import Header from "@/components/Header";
import { Button } from "@/components/ui/button";

export default function GameNotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen">
      <Header />

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-lg mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-6xl mb-6">💔</div>

            <h1 className="text-3xl font-bold mb-3">
              Oops… this game doesn’t exist
            </h1>

            <p className="text-muted-foreground mb-8">
              The link might be broken, expired, or the game was never meant to
              be found.
            </p>

            <div className="space-y-3">
              <GameButton
                className="w-full"
                onClick={() => router.push("/games")}
              >
                Go back to Games 💘
              </GameButton>

              <GameButton
                variant="skip"
                className="w-full"
                onClick={() => router.push("/")}
              >
                Back to Home
              </GameButton>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
