"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import FloatingHearts from "@/components/FloatingHearts";

export default function Landing() {
  const router = useRouter();

  return (
    <div className="min-h-screen">
      <FloatingHearts />
      <Header />

      <main className="pt-24 pb-16 px-4">
        <div className="min-h-[calc(100vh-6rem)] flex items-center">
          <div className="max-w-lg mx-auto text-center w-full">
            {/* Hero */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-10"
            >
              <h1 className="text-4xl font-bold leading-tight mb-4">
                Talk.
                <br />
                Connect.
                <br />
                Fall in love again 💘
              </h1>

              <p className="text-muted-foreground text-base">
                A simple Valentine game to spark deep, fun, and meaningful
                conversations with your partner.
              </p>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <Button
                className="w-full h-14 text-base"
                onClick={() => router.push("/games")}
              >
                Start a Game 💕
              </Button>

              <p className="text-xs text-muted-foreground">
                No signup • No pressure • Just connection
              </p>
            </motion.div>

            {/* Footer note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-16 text-sm text-muted-foreground"
            >
              Built for couples who want more than just small talk ✨
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
