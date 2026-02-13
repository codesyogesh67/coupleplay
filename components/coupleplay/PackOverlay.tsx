"use client";

import { useEffect, useMemo, useReducer } from "react";
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

const CARD_BG: Record<"pink" | "violet" | "sky" | "emerald" | "amber", string> = {
  pink: "from-pink-600 to-rose-600",
  violet: "from-violet-600 to-fuchsia-600",
  sky: "from-sky-600 to-cyan-600",
  emerald: "from-emerald-600 to-teal-600",
  amber: "from-amber-600 to-orange-600",
};

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const PICK_COUNT = 5;
const SKIP_LIMIT = 3;

type State = {
  visible: CardDTO[];
  queue: CardDTO[];
  revealed: CardDTO | null;
  revealedIndex: number | null; // where the removed card was
  skipsUsed: number; // 0..3

  keptIds: Set<string>; 
};

type Action =
  | { type: "INIT"; cards: CardDTO[] }
  | { type: "REVEAL"; card: CardDTO; index: number }
  | { type: "SKIP" }
  | { type: "REPLAY"; cards: CardDTO[]}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "INIT": {
      const keptIds = new Set<string>();
      const pool = buildPool(action.cards,keptIds)
      
      return {
        visible: pool.slice(0, PICK_COUNT),
        queue: pool.slice(PICK_COUNT),
        revealed: null,
        revealedIndex: null,
        skipsUsed: 0,
        keptIds,
      };
    }

    case "REVEAL": {
      const nextKept = new Set(state.keptIds);
    
      // ✅ if there was a revealed card, and you didn’t skip it, it becomes KEPT
      if (state.revealed) nextKept.add(state.revealed.id);
    
      // remove tapped card from fan (so card count decreases)
      const nextVisible = state.visible.filter((c) => c.id !== action.card.id);
    
      return {
        ...state,
        keptIds: nextKept,
        revealed: action.card,
        revealedIndex: action.index,
        visible: nextVisible,
      };
    }

    case "REPLAY": {
      const nextKept = new Set(state.keptIds);
      if (state.revealed) nextKept.add(state.revealed.id);
    
      const pool = buildPool(action.cards, nextKept);
    
      return {
        ...state,
        keptIds: nextKept,
        visible: pool.slice(0, PICK_COUNT),
        queue: pool.slice(PICK_COUNT),
        revealed: null,
        revealedIndex: null,
        skipsUsed: 0,
      };
    }
    
    case "SKIP": {
      if (!state.revealed) return state;
      if (state.revealedIndex === null) return state;
      if (state.skipsUsed >= SKIP_LIMIT) return state;
      if (state.visible.length >= PICK_COUNT) return state;
    
      // ✅ put skipped card back into queue (allowed to return later)
      const queueWithSkipped = [...state.queue, state.revealed];
    
      // pick next card that is not in visible and not kept
      const banned = new Set(state.visible.map((c) => c.id));
      for (const id of state.keptIds) banned.add(id);
    
      const idx = queueWithSkipped.findIndex((c) => !banned.has(c.id));
      if (idx === -1) {
        // nothing we can safely add; just clear revealed and count skip
        return {
          ...state,
          revealed: null,
          revealedIndex: null,
          skipsUsed: Math.min(SKIP_LIMIT, state.skipsUsed + 1),
          queue: queueWithSkipped,
        };
      }
    
      const next = queueWithSkipped[idx];
      const nextQueue = [...queueWithSkipped.slice(0, idx), ...queueWithSkipped.slice(idx + 1)];
    
      // ✅ insert exactly ONE card back into fan
      const insertAt = Math.min(state.revealedIndex, state.visible.length);
      const nextVisible = [...state.visible];
      nextVisible.splice(insertAt, 0, next);
    
      return {
        ...state,
        visible: nextVisible,
        queue: nextQueue,
        revealed: null,
        revealedIndex: null,
        skipsUsed: Math.min(SKIP_LIMIT, state.skipsUsed + 1),
      };
    }
    

    default:
      return state;
  }
}

function buildPool(cards: CardDTO[], keptIds: Set<string>) {
  return shuffle(cards.filter((c) => !keptIds.has(c.id)));
}


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
  const packCards = useMemo(() => CARDS.filter((c) => c.packId === packId), [packId]);

  const [state, dispatch] = useReducer(reducer, {
    visible: [],
    queue: [],
    revealed: null,
    revealedIndex: null,
    skipsUsed: 0,
    keptIds: new Set<string>()
  });

  useEffect(() => {
    dispatch({ type: "INIT", cards: packCards });
  }, [packCards]);

  const { visible, queue, revealed, skipsUsed } = state;

  const canSkip = !!revealed && skipsUsed < SKIP_LIMIT && queue.length > 0 && visible.length < PICK_COUNT;

  return (
    <motion.div className="fixed inset-0 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Backdrop */}
      <motion.button
        type="button"
        aria-label="Close pack"
        className="absolute inset-0"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col">
        <div className="mx-auto w-full max-w-6xl px-4 py-4 sm:px-6 sm:py-6 flex flex-col h-full">
          <div className="relative flex flex-col h-full rounded-[34px] border border-white/10 shadow-soft overflow-hidden">
            <div className="pointer-events-none absolute inset-0 opacity-[0.10] bg-[radial-gradient(circle_at_30%_20%,white,transparent_55%),radial-gradient(circle_at_80%_35%,white,transparent_60%)]" />
            <div className="pointer-events-none absolute inset-0 bg-black/25" />

            <div className="relative flex flex-col h-full p-4 sm:p-6">
              {/* Top bar */}
              <div className="flex items-start justify-between gap-4">
                <Button variant="secondary" onClick={onClose}>
                  Close
                </Button>
              </div>

              {/* Big card */}
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
                  <div className="pointer-events-none absolute inset-0 opacity-[0.18] bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.55),transparent_55%),radial-gradient(circle_at_80%_35%,rgba(255,255,255,0.35),transparent_60%)]" />
                  <div className="pointer-events-none absolute inset-0 bg-black/10" />

                  <div className="relative h-full p-6 sm:p-7 flex flex-col">
                    {/* Title/desc */}
                    <div className="min-w-0">
                      <div className="mt-1 text-2xl sm:text-3xl font-semibold text-white leading-tight">{title}</div>
                      <div className="mt-2 text-sm text-white/85 leading-relaxed line-clamp-2">{description}</div>
                    </div>

                    {/* Type pill */}
                    <div className="mt-5">
                      {revealed ? (
                        <div className={["inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold", typePillClass(revealed.type)].join(" ")}>
                          {typeLabel(revealed.type)}
                        </div>
                      ) : (
                        <div className="inline-flex items-center rounded-full bg-white/12 px-3 py-1 text-xs text-white/85 ring-1 ring-white/15">
                          Unrevealed
                        </div>
                      )}
                    </div>

                    {/* Reveal panel */}
                    <div className="mt-6 flex-1 flex flex-col justify-center">
                      {!revealed ? (
                        <div className="text-center text-white/85 text-lg sm:text-xl">Pick a card below ✨</div>
                      ) : (
                        <div className="flex flex-col items-center gap-5">
                          <div className="w-full max-w-[92%] text-center">
                            <div className="text-2xl sm:text-[44px] font-semibold leading-[1.35] text-white">
                              <Typewriter text={revealed.text} />
                            </div>
                          </div>

                          {revealed.type === "guess" && revealed.options?.length ? (
                            <div className="flex flex-wrap justify-center gap-2">
                              {revealed.options.map((opt) => (
                                <div key={opt} className="rounded-full bg-white/12 ring-1 ring-white/15 px-3 py-1 text-xs text-white/90">
                                  {opt}
                                </div>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      )}
                    </div>

                    {/* Footer: Tap | Skips | cards */}
                    <div className="pt-4 flex items-center justify-between gap-3">
                      <div className="text-xs text-white/75">Tap a card below to reveal</div>

                      <button
                        type="button"
                        onClick={() => dispatch({ type: "SKIP" })}
                        disabled={!canSkip}
                        className={[
                          "text-xs rounded-full px-3 py-1 ring-1 ring-white/15 transition",
                          canSkip
                            ? "bg-white/12 text-white/85 hover:bg-white/20 hover:text-white"
                            : "bg-white/5 text-white/45 cursor-not-allowed",
                        ].join(" ")}
                      >
                        Skips {skipsUsed}/{SKIP_LIMIT}
                      </button>

                      <div className="text-xs text-white/75">
                        {visible.length}/{PICK_COUNT} cards
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Fan */}
              <div className="mt-auto pt-5 flex justify-center">
                <motion.div className="relative h-[190px] w-full max-w-[640px]">
                  <AnimatePresence>
                    {visible.map((card, i) => (
                      <FanCard
                        key={card.id}
                        card={card}
                        i={i}
                        total={visible.length}
                        onPick={() => dispatch({ type: "REVEAL", card, index: i })}
                        containerWidth={640}
                      />
                    ))}
                  </AnimatePresence>

                  {visible.length === 0 ? (
  <div className="absolute inset-0 flex items-center justify-center">
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25 }}
      className="bg-background/80 backdrop-blur-xl border border-border/60 shadow-lg rounded-3xl px-6 py-6 text-center max-w-[260px]"
    >
      <div className="text-lg font-semibold">
        Thats all!! 😌
      </div>

      <div className="text-sm text-muted-foreground mt-1">
       Lets grab more cards!
      </div>

      <Button
        onClick={() => dispatch({ type: "REPLAY", cards: packCards })}
        className="mt-4 w-full rounded-full"
      >
       Shuffle & Play Again
      </Button>
    </motion.div>
  </div>
) : null}


                </motion.div>
              </div>

              <div className="mt-3 text-center text-xs text-muted-foreground">
                Showing {visible.length} of {PICK_COUNT} cards (pack total: {count})
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
