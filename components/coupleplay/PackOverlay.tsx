"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CARDS } from "@/lib/coupleplay/cards";
import { type CardDTO } from "@/lib/coupleplay/types";
import { FanCard } from "./FanCard";
import { Typewriter } from "./Typewriter";

function typeLabel(t: CardDTO["type"]) {
  switch (t) {
    case "question":
      return "Question";
    case "scenario":
      return "Scenario";
    case "confession":
      return "Confession";
    case "guess":
      return "Guess";
    case "challenge":
      return "Challenge";
    default:
      return "Card";
  }
}

function typePillClass(t: CardDTO["type"]) {
  switch (t) {
    case "confession":
      return "bg-white/20 ring-1 ring-white/25 text-white";
    case "challenge":
      return "bg-white/25 ring-1 ring-white/30 text-white";
    case "guess":
      return "bg-white/18 ring-1 ring-white/25 text-white";
    case "scenario":
      return "bg-white/16 ring-1 ring-white/20 text-white";
    case "question":
    default:
      return "bg-white/14 ring-1 ring-white/20 text-white";
  }
}

type EffectType =
  | "BOTH_ANSWER"
  | "PARTNER_ANSWERS"
  | "NO_SKIP_NEXT"
  | "DOUBLE_DRAW";

type EffectState = {
  type: EffectType;
  title: string;
  hint: string;
};

const EFFECTS: Record<EffectType, EffectState> = {
  BOTH_ANSWER: {
    type: "BOTH_ANSWER",
    title: "Both Answer",
    hint: "You both must answer this card.",
  },
  PARTNER_ANSWERS: {
    type: "PARTNER_ANSWERS",
    title: "Partner Answers",
    hint: "Your partner answers for you. No dodging 😈",
  },
  NO_SKIP_NEXT: {
    type: "NO_SKIP_NEXT",
    title: "No Skip Next",
    hint: "Your next draw cannot be skipped.",
  },
  DOUBLE_DRAW: {
    type: "DOUBLE_DRAW",
    title: "Double Draw",
    hint: "After this, draw one more card immediately.",
  },
};

function pickEffect(): EffectState | null {
  const chance = 0.35;
  if (Math.random() > chance) return null;

  const pool: EffectType[] = [
    "BOTH_ANSWER",
    "PARTNER_ANSWERS",
    "NO_SKIP_NEXT",
    "DOUBLE_DRAW",
  ];
  const t = pool[Math.floor(Math.random() * pool.length)];
  return EFFECTS[t];
}

function effectPillClass(t: EffectType) {
  switch (t) {
    case "BOTH_ANSWER":
      return "bg-white/22 ring-1 ring-white/25 text-white";
    case "PARTNER_ANSWERS":
      return "bg-white/26 ring-1 ring-white/30 text-white";
    case "NO_SKIP_NEXT":
      return "bg-white/18 ring-1 ring-white/22 text-white";
    case "DOUBLE_DRAW":
      return "bg-white/20 ring-1 ring-white/24 text-white";
  }
}

const CARD_BG: Record<"pink" | "violet" | "sky" | "emerald" | "amber", string> = {
  pink: "from-pink-600 to-rose-600",
  violet: "from-violet-600 to-fuchsia-600",
  sky: "from-sky-600 to-cyan-600",
  emerald: "from-emerald-600 to-teal-600",
  amber: "from-amber-600 to-orange-600",
};

export function PackOverlay({
  packId,
  title,
  description,
  count,
  accent,
  onClose,
}: {
  packId: string;
  title: string;
  description: string;
  count: number;
  accent: "pink" | "violet" | "sky" | "emerald" | "amber";
  onClose: () => void;
}) {
  const packCards = useMemo(
    () => CARDS.filter((c) => c.packId === packId),
    [packId]
  );

  const [effect, setEffect] = useState<EffectState | null>(null);
  const [noSkipNext, setNoSkipNext] = useState(false);

  const [remaining, setRemaining] = useState<CardDTO[]>([]);
  const [revealed, setRevealed] = useState<CardDTO | null>(null);

  const [skipsLeft, setSkipsLeft] = useState(2);

  useMemo(() => {
    const shuffled = [...packCards].sort(() => Math.random() - 0.5);
    setRemaining(shuffled);
    setRevealed(null);
    setSkipsLeft(2);

    setEffect(null);
    setNoSkipNext(false);

    return null;
  }, [packCards]);

  const spread = remaining.slice(0, 5);

  function revealCard(card: CardDTO) {
    const e = pickEffect();

    setRevealed(card);
    setEffect(e);

    setRemaining((prev) => prev.filter((c) => c.id !== card.id));

    if (e?.type === "NO_SKIP_NEXT") {
      setNoSkipNext(true);
    }

    if (e?.type === "DOUBLE_DRAW") {
      setTimeout(() => {
        setRemaining((prev) => {
          if (prev.length === 0) return prev;
          const next = prev[0];
          setRevealed(next);
          setEffect(null);
          return prev.slice(1);
        });
      }, 450);
    }
  }

  function skipTopCard() {
    if (noSkipNext) return;
    if (skipsLeft <= 0) return;
    if (remaining.length === 0) return;

    setSkipsLeft((s) => Math.max(0, s - 1));
    setRevealed(null);
    setEffect(null);

    setRemaining((prev) => prev.slice(1));
  }

  return (
    <motion.div
      className="fixed inset-0 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop (neutral) */}
      <motion.button
        type="button"
        aria-label="Close pack"
        className={["absolute inset-0"].join(
          " "
        )}
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col">
        <div className="mx-auto w-full max-w-6xl px-4 py-4 sm:px-6 sm:py-6 flex flex-col h-full">
          {/* ✅ Accent "table" only inside this box */}
          <div
            className={[
              "relative flex flex-col h-full",
              "rounded-[34px] border border-white/10 shadow-soft overflow-hidden",
            ].join(" ")}
          >
            {/* subtle table texture + vignette */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.10] bg-[radial-gradient(circle_at_30%_20%,white,transparent_55%),radial-gradient(circle_at_80%_35%,white,transparent_60%)]" />
            <div className="pointer-events-none absolute inset-0 bg-black/25" />

            {/* ✅ actual content */}
            <div className="relative flex flex-col h-full p-4 sm:p-6">
              {/* Top bar */}
              <div className="flex items-start justify-between gap-4">
              

                <Button variant="secondary" onClick={onClose}>
                  Close
                </Button>
              </div>

              {/* Shared deck expands */}
              <div className="mt-6 flex justify-center">
  <motion.div
    layoutId={`pack-front-${packId}`}
    className={[
      "w-full max-w-[520px] aspect-[190/220]",
      "rounded-[30px] border shadow-soft overflow-hidden",
      "bg-gradient-to-br",
      CARD_BG[accent],
      "relative",
    ].join(" ")}
  >
    {/* Accent glow texture (keeps it premium but still solid color) */}
    <div className="pointer-events-none absolute inset-0 opacity-[0.18] bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.55),transparent_55%),radial-gradient(circle_at_80%_35%,rgba(255,255,255,0.35),transparent_60%)]" />
    <div className="pointer-events-none absolute inset-0 bg-black/10" />

    {/* Content */}
    <div className="relative h-full p-6 sm:p-7 flex flex-col">
      {/* Top: title + count */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
         
          <div className="mt-1 text-2xl sm:text-3xl font-semibold text-white leading-tight">
            {title}
          </div>
          <div className="mt-2 text-sm text-white/85 leading-relaxed line-clamp-2">
            {description}
          </div>
        </div>

        <div className="shrink-0 text-[11px] rounded-full bg-white/18 px-3 py-1 text-white/90 ring-1 ring-white/15">
          {remaining.length} left
        </div>
      </div>

      {/* Middle: pills + effect */}
      <div className="mt-5 flex items-start justify-between gap-4">
        <div className="space-y-2">
          {/* Type pill / Unrevealed */}
          {revealed ? (
            <div
              className={[
                "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
                typePillClass(revealed.type),
              ].join(" ")}
            >
              {typeLabel(revealed.type)}
            </div>
          ) : (
            <div className="inline-flex items-center rounded-full bg-white/12 px-3 py-1 text-xs text-white/85 ring-1 ring-white/15">
              Unrevealed
            </div>
          )}

          {/* Effect pill + hint */}
          {effect ? (
            <div className="space-y-1">
              <div
                className={[
                  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
                  effectPillClass(effect.type),
                ].join(" ")}
              >
                ✨ {effect.title}
              </div>
              <div className="text-xs text-white/80 leading-snug max-w-[40ch]">
                {effect.hint}
              </div>
            </div>
          ) : null}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {!revealed ? (
            <button
              type="button"
              onClick={skipTopCard}
              disabled={noSkipNext || skipsLeft <= 0 || remaining.length === 0}
              className={[
                "inline-flex items-center rounded-full px-3 py-1.5 text-xs sm:text-sm font-medium transition",
                "ring-1 ring-white/20",
                noSkipNext
                  ? "bg-white/5 text-white/40 cursor-not-allowed"
                  : skipsLeft <= 0 || remaining.length === 0
                  ? "bg-white/5 text-white/40 cursor-not-allowed"
                  : "bg-white/12 hover:bg-white/20 text-white/90 hover:text-white",
              ].join(" ")}
            >
              {noSkipNext ? "Skip Locked" : `Skip (${skipsLeft})`}
            </button>
          ) : null}

          {revealed ? (
            <button
              type="button"
              onClick={() => {
                setRevealed(null);
                setEffect(null);
                if (noSkipNext) setNoSkipNext(false);
              }}
              className="inline-flex items-center rounded-full px-3 py-1.5 bg-white/12 hover:bg-white/22 ring-1 ring-white/20 text-xs sm:text-sm font-medium text-white/90 hover:text-white transition"
            >
              Hide
            </button>
          ) : null}
        </div>
      </div>

      {/* Reveal panel (centered, roomy) */}
      <div className="mt-6 flex-1 flex flex-col justify-center">
        {!revealed ? (
          <div className="text-center text-white/85 text-lg sm:text-xl">
            Pick a card below ✨
          </div>
        ) : (
          <div className="flex flex-col items-center gap-5">
            <div className="w-full max-w-[92%] text-center">
              <div className="text-4xl sm:text-[44px] font-semibold leading-[1.25] text-white">
                <Typewriter text={revealed.text} />
              </div>
            </div>

            {revealed.type === "guess" && revealed.options?.length ? (
              <div className="flex flex-wrap justify-center gap-2">
                {revealed.options.map((opt) => (
                  <div
                    key={opt}
                    className="rounded-full bg-white/12 ring-1 ring-white/15 px-3 py-1 text-xs text-white/90"
                  >
                    {opt}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Footer hint */}
      <div className="pt-4 flex items-center justify-between">
        <div className="text-xs text-white/75">Tap a card below to reveal</div>
        <div className="text-[11px] text-white/70">
          {Math.min(5, remaining.length)} visible
        </div>
      </div>
    </div>
  </motion.div>
</div>


              {/* 5-card spreader */}
              <div className="mt-auto pt-5 flex justify-center">
                <motion.div className="relative h-[190px] w-full max-w-[640px]">
                  <AnimatePresence>
                    {spread.map((card, i) => (
                      <FanCard
                        key={card.id}
                        card={card}
                        i={i}
                        total={spread.length}
                        onPick={revealCard}
                        containerWidth={640}
                      />
                    ))}
                  </AnimatePresence>

                  {remaining.length === 0 ? (
                   <div className="absolute inset-0 flex items-center justify-center">
                   <div className="rounded-full bg-background/80 backdrop-blur px-4 py-2 text-sm text-foreground shadow-sm border">
                     No cards left ✅
                   </div>
                 </div>
                  ) : null}
                </motion.div>
              </div>

              <div className="mt-3 text-center text-xs text-muted-foreground">
                Showing {Math.min(5, remaining.length)} of {remaining.length} cards
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
