"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

const typeLabel: Record<string, string> = {
  question: "Question",
  scenario: "Scenario",
  confession: "Confession",
  guess: "Guess",
  challenge: "Challenge",
};

export function CardCard({
  type,
  category,
  text,
  children,
}: {
  type: string;
  category: string;
  text: string;
  children?: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-border bg-card p-6 shadow-soft"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs font-medium text-muted-foreground">
          {category} • {typeLabel[type] ?? type}
        </div>
        <div className="text-xs rounded-full bg-secondary px-2 py-1 text-secondary-foreground">
          Card
        </div>
      </div>

      <div className="mt-4 text-xl font-semibold leading-snug">{text}</div>

      {children ? <div className="mt-6">{children}</div> : null}
    </motion.div>
  );
}
