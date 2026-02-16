"use client";

import { motion } from "framer-motion";

type Accent = "pink" | "violet" | "sky" | "emerald" | "amber" | "valentine";

type Props = {
  packId: string;
  title: string;
  description: string;
  locked?: boolean;
  selected?: boolean;
  count?: number;
  onToggle?: () => void;
  accent?: Accent;
};

const ACCENT: Record<Accent, string> = {
  pink: "from-pink-500/75 to-rose-500/65",
  violet: "from-violet-500/75 to-fuchsia-500/65",
  sky: "from-sky-500/75 to-cyan-500/65",
  emerald: "from-emerald-500/75 to-teal-500/65",
  amber: "from-amber-500/75 to-orange-500/65",

  // 💘 Valentine: strong but clean
  valentine: "from-rose-600 via-pink-600 to-fuchsia-600",
};

export function PackStack({
  packId,
  title,
  description,
  locked = false,
  selected = false,
  count = 18,
  onToggle,
  accent = "pink",
}: Props) {
  const gradient = ACCENT[accent];
  const isValentine = accent === "valentine";

  return (
    <motion.button
      type="button"
      onClick={() => {
        if (locked) return;
        onToggle?.();
      }}
      disabled={locked}
      whileHover={
        !locked ? { y: -3, scale: isValentine ? 1.03 : 1 } : undefined
      }
      whileTap={!locked ? { scale: 0.98 } : undefined}
      className={[
        "relative w-full flex justify-center select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        locked ? "cursor-not-allowed opacity-70" : "cursor-pointer",
      ].join(" ")}
    >
      <div
        className={[
          "relative w-full",
          "max-w-[240px] sm:max-w-[260px] md:max-w-[290px] lg:max-w-[320px] xl:max-w-[340px]",
          "aspect-[190/250]",
        ].join(" ")}
      >
        {/* Back cards */}
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
            isValentine ? "shadow-[0_26px_110px_rgba(255,0,120,0.22)]" : "",
          ].join(" ")}
        >
          {/* Base glow */}
          <div className="absolute inset-0 opacity-[0.16] bg-[radial-gradient(circle_at_30%_20%,white,transparent_55%),radial-gradient(circle_at_80%_30%,white,transparent_55%)]" />

          {/* Valentine: subtle sparkle + hearts (kept away from header text) */}
          {isValentine ? (
            <>
              <div className="pointer-events-none absolute inset-0 opacity-[0.22] bg-[radial-gradient(circle_at_18%_22%,rgba(255,255,255,0.70),transparent_55%),radial-gradient(circle_at_82%_18%,rgba(255,255,255,0.30),transparent_62%)]" />

              <div className="pointer-events-none absolute inset-0">
                {/* keep icons away from the top-left header area */}

                <div className="absolute bottom-10 left-4 text-white/60 text-sm">
                  ✨
                </div>
                <div className="absolute bottom-6 right-6 text-white/55 text-sm">
                  💞
                </div>
              </div>
            </>
          ) : null}

          {/* Content */}
          <div className="relative h-full p-5 flex flex-col text-left">
            {/* Header row */}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[11px] uppercase tracking-wider text-white/80">
                  Pack
                </div>

                <div className="mt-1 text-[clamp(18px,2.4vw,22px)] font-semibold leading-tight text-white line-clamp-2">
                  {title}
                </div>

                {/* Valentine: short focused tagline (no clutter) */}
                {isValentine ? (
                  <div className="mt-1 text-[12px] font-medium text-white/90">
                    Flirty • Sweet • Spicy
                  </div>
                ) : null}
              </div>

              <div
                className={[
                  "shrink-0 rounded-full ring-1 px-2.5 py-1 text-[11px] font-semibold",
                  isValentine
                    ? "bg-black/15 ring-white/25 text-white"
                    : "bg-white/12 ring-white/20 text-white/90",
                ].join(" ")}
              >
                {count}
              </div>
            </div>
            {/* Body */}
            {isValentine ? (
              <div className="mt-4 rounded-2xl bg-black/18  p-3">
                <div className="text-[11px] font-bold uppercase tracking-wider text-white/75">
                  What you’ll get
                </div>
                {/* <div className="mt-1 text-[13px] leading-relaxed text-white line-clamp-3"> */}
                <div className="mt-3 text-[clamp(12px,1.5vw,14px)] text-white/85 leading-relaxed line-clamp-3">
                  {description}
                </div>
              </div>
            ) : (
              <div className="mt-3 text-[clamp(12px,1.5vw,14px)] text-white/85 leading-relaxed line-clamp-3">
                {description}
              </div>
            )}

            {/* Footer */}
            <div className="mt-auto flex items-center justify-between text-[11px] text-white/85 pt-3">
              <span>
                {locked
                  ? "Locked"
                  : selected
                  ? "Selected"
                  : isValentine
                  ? "Tap to open 💘"
                  : "Tap to open"}
              </span>
              <span>{isValentine ? "💝" : "🃏"}</span>
            </div>
          </div>

          {locked ? (
            <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
          ) : null}
        </div>
      </div>
    </motion.button>
  );
}
