"use client";

import { motion } from "framer-motion";

type Props = {
  packId: string;
  title: string;
  description: string;
  locked?: boolean;
  selected?: boolean;
  count?: number;
  onToggle?: () => void;
  accent?: "pink" | "violet" | "sky" | "emerald" | "amber";
};

const ACCENT: Record<NonNullable<Props["accent"]>, string> = {
  pink: "from-pink-500/75 to-rose-500/65",
  violet: "from-violet-500/75 to-fuchsia-500/65",
  sky: "from-sky-500/75 to-cyan-500/65",
  emerald: "from-emerald-500/75 to-teal-500/65",
  amber: "from-amber-500/75 to-orange-500/65",
};

export function PackStack({
  packId,
  title,
  description,
  locked,
  selected,
  count = 18,
  onToggle,
  accent = "pink",
}: Props) {
  const gradient = ACCENT[accent];

  return (
    <motion.button
      type="button"
      onClick={() => {
        if (locked) return;
        onToggle?.();
      }}
      disabled={locked}
      whileHover={!locked ? { y: -3 } : undefined}
      whileTap={!locked ? { scale: 0.98 } : undefined}
      className={[
        "relative w-full", // ✅ add overflow-hidden
        "max-w-[240px] sm:max-w-[260px] md:max-w-[290px] lg:max-w-[320px] xl:max-w-[340px]",
        "aspect-[190/250]",
        "select-none",
        locked ? "cursor-not-allowed opacity-70" : "cursor-pointer",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
      ].join(" ")}
    >
      {/* Spread container */}
      <div className="absolute inset-0">
        {/* Back cards — more spread */}
        <div className="absolute inset-0 rounded-[26px] border bg-card shadow-soft -rotate-[14deg] translate-y-[18px] -translate-x-[18px]" />
        <div className="absolute inset-0 rounded-[26px] border bg-card shadow-soft -rotate-[8deg] translate-y-[10px] -translate-x-[10px]" />
        <div className="absolute inset-0 rounded-[26px] border bg-card shadow-soft -rotate-[3deg] translate-y-[4px] -translate-x-[3px]" />

        {/* Front card */}
        <div
          className={[
            "absolute inset-0 rounded-[30px] border shadow-soft overflow-hidden",
            "bg-gradient-to-br",
            gradient,
            selected ? "ring-2 ring-white/70" : "",
          ].join(" ")}
        >
          <div className="absolute inset-0 opacity-[0.18] bg-[radial-gradient(circle_at_30%_20%,white,transparent_55%),radial-gradient(circle_at_80%_30%,white,transparent_55%)]" />

          <div className="relative h-full p-5 flex flex-col text-left">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="text-[11px] uppercase tracking-wider text-white/80">
                  Pack
                </div>
                <div className="text-xl font-semibold text-white leading-tight">
                  {title}
                </div>
              </div>

              <div className="text-[11px] rounded-full bg-white/20 px-3 py-1 text-white/90">
                {count} cards
              </div>
            </div>

            <div className="mt-3 text-sm text-white/85 leading-relaxed line-clamp-3">
              {description}
            </div>

            <div className="mt-auto flex items-center justify-between text-[11px] text-white/80">
              <span>
                {locked ? "Locked" : selected ? "Selected" : "Tap to select"}
              </span>
              <span>🃏</span>
            </div>
          </div>

          {/* Optional: a subtle locked overlay (looks premium) */}
          {locked ? (
            <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
          ) : null}
        </div>
      </div>
    </motion.button>
  );
}
