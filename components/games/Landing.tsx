"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import FloatingHearts from "@/components/FloatingHearts";

export default function Landing() {
  const router = useRouter();

  return (
    <div className="h-[100dvh] overflow-hidden flex flex-col">
      <FloatingHearts />
      <Header />

      <main className="flex-1 flex items-center justify-center pt-24 pb-16 px-4 relative">
        {/* glow kept but pushed away from text */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-pink-500/6 blur-3xl" />
          <div className="absolute top-48 -left-56 h-[460px] w-[460px] rounded-full bg-rose-500/6 blur-3xl" />
          <div className="absolute -bottom-56 right-[-160px] h-[520px] w-[520px] rounded-full bg-violet-500/6 blur-3xl" />
        </div>

        <div className="w-full max-w-lg mx-auto text-center relative">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="mb-9"
          >
            <h1
              className="
                text-4xl sm:text-5xl leading-[1.05] tracking-tight mb-6
              "
            >
              <span
                className="
                text-4xl sm:text-5xl font-extrabold tracking-tight mb-3
                bg-gradient-to-r from-pink-500 via-rose-500 to-violet-500
                bg-clip-text text-transparent
              "
              >
                Talk.
                <br />
                Connect.
                <br />
                Fall in love again 💘
              </span>
            </h1>

            <p
              className="
                text-base sm:text-[17px] leading-relaxed
                text-zinc-500
              "
            >
              A simple Valentine game to spark{" "}
              <span className="text-zinc-500 font-semibold">deep</span>,{" "}
              <span className="text-zinc-500 font-semibold">fun</span>, and{" "}
              <span className="text-zinc-500 font-semibold">meaningful</span>{" "}
              conversations with your partner.
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <Button
              className="
                w-full h-14 text-base font-medium
                text-zinc-100
                bg-gradient-to-r from-rose-600 to-pink-600
                hover:from-rose-600 hover:to-pink-600
                shadow-[0_20px_60px_-24px_rgba(225,29,72,0.6)]
              "
              onClick={() => router.push("/games")}
            >
              Start a Game 💕
            </Button>

            <p className="text-xs text-zinc-400">
              No signup • No pressure • Just connection
            </p>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="mt-16 text-sm text-zinc-600"
          >
            Built for couples who want more than just small talk ✨
          </motion.div>
        </div>
      </main>
    </div>
  );
}
