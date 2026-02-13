"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Header from "@/components/Header";
import ProgressBar from "@/components/ProgressBar";
import { Button } from "@/components/ui/button";

import { PackStack } from "@/components/coupleplay/PackStack";
import { PACKS } from "@/lib/coupleplay/packs";
import { CARDS } from "@/lib/coupleplay/cards";
import { type CardDTO } from "@/lib/coupleplay/types";
import { PackOverlay } from "./PackOverlay";


import { phaseSlide, headingIn, subheadingIn, listStagger, cardIn } from "@/lib/motion";

const PICK_COUNT = 5;
const SKIP_LIMIT = 3;


function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function CardTableClient() {
  const [phase, setPhase] = useState<"packs" | "play" | "done">("packs");
  const [selectedPacks, setSelectedPacks] = useState<string[]>([
    "warmup",
    "fun",
  ]);

  const [overlayCards, setOverlayCards] = useState<CardDTO[]>([]);
  const [overlayQueue, setOverlayQueue] = useState<CardDTO[]>([]);
  const [overlaySkipsLeft, setOverlaySkipsLeft] = useState(SKIP_LIMIT);

  const [skipLeft, setSkipLeft] = useState(3);
  const [deck, setDeck] = useState<CardDTO[]>([]);
  const [discard, setDiscard] = useState<CardDTO[]>([]);

  // ✅ NEW: opened pack state
  const [openPackId, setOpenPackId] = useState<string | null>(null);

  const unlockedPackIds = useMemo(() => {
    return new Set(PACKS.filter((p) => !p.locked).map((p) => p.id));
  }, []);

  const packs = useMemo(() => {
    return PACKS.map((p) => ({ ...p, isUnlocked: unlockedPackIds.has(p.id) }));
  }, [unlockedPackIds]);

  function togglePack(id: string) {
    setSelectedPacks((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function start() {
    const cards = CARDS.filter((c) => selectedPacks.includes(c.packId));
    const shuffled = shuffle(cards);

    setDeck(shuffled);
    setDiscard([]);
    setSkipLeft(3);
    setPhase("play");
  }

  function endSession() {
    setPhase("done");
  }

  function skipOverlayCard(cardId: string) {
    if (overlaySkipsLeft <= 0) return;
  
    setOverlayCards((prev) => {
      const idx = prev.findIndex((c) => c.id === cardId);
      if (idx === -1) return prev;
  
      // If no more cards available in the pack, just remove it (or keep it—your choice).
      if (overlayQueue.length === 0) {
        const copy = [...prev];
        copy.splice(idx, 1);
        return copy;
      }
  
      // Replace this slot with the next card from queue
      const next = overlayQueue[0];
      const copy = [...prev];
      copy[idx] = next;
      return copy;
    });
  
    setOverlayQueue((q) => q.slice(1));
    setOverlaySkipsLeft((s) => Math.max(0, s - 1));
  }
  


  const progressCurrent = Math.max(1, discard.length);
  const progressTotal = Math.max(1, discard.length + deck.length + 6);

  // ✅ current open pack data
  const openPack = openPackId ? PACKS.find((p) => p.id === openPackId) : null;
  const openPackCount = openPackId
    ? CARDS.filter((c) => c.packId === openPackId).length
    : 0;

  return (
    <div className="min-h-screen">
      <Header />

      <main className="pt-24 pb-12 px-4">
        <div className="max-w-lg mx-auto">
          <AnimatePresence mode="wait">
            {/* ---------------- PACK SELECT ---------------- */}
            {phase === "packs" && (
             <motion.div
             key="packs"
             variants={phaseSlide}
             initial="hidden"
             animate="show"
             exit="exit"
             className="space-y-6"
           >
           
           <motion.div initial="hidden" animate="show" className="text-center">
  <motion.h1
    variants={headingIn}
    className="text-3xl font-bold mb-2 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 bg-clip-text text-transparent"
  >
  Play with Cards ⭐
  </motion.h1>



  <motion.p variants={subheadingIn} className="text-muted-foreground">
    Tap a pack to open it. (We’ll add reveal + session flow next.)
  </motion.p>
  </motion.div>


                {/* Packs */}
                <motion.div
  variants={listStagger}
  custom={0.12}           // slower/faster here (0.10–0.18)
  initial="hidden"
  animate="show"
  className="p-2"
>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-14 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">
                    {packs.map((p, index) => {
                      const selected = selectedPacks.includes(p.id);
                      const locked = !p.isUnlocked;

                      const accent = ([
                        "pink",
                        "violet",
                        "sky",
                        "emerald",
                        "amber",
                      ] as const)[index % 5];

                      const count = CARDS.filter((c) => c.packId === p.id)
                        .length;

                      return (
                        <div key={p.id} className="flex justify-center px-2">
                          <PackStack
                            packId={p.id} // ✅ required for shared animation
                            title={p.title}
                            description={p.description}
                            locked={locked}
                            selected={selected}
                            count={count}
                            accent={accent}
                            onToggle={() => {
                              if (locked) return;
                            
                              const packCards = shuffle(CARDS.filter((c) => c.packId === p.id));
                            
                              setOpenPackId(p.id);
                              setOverlayCards(packCards.slice(0, PICK_COUNT));
                              setOverlayQueue(packCards.slice(PICK_COUNT));
                              setOverlaySkipsLeft(SKIP_LIMIT);
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </motion.div>

                {/* ✅ Removed Start Card Game button (as you requested) */}
                {/* If you still want selection logic later, we can reintroduce it in overlay */}
              </motion.div>
            )}

            {/* ---------------- PLAY TABLE ---------------- */}
            {phase === "play" && (
              <motion.div
                key="play"
                variants={phaseSlide}
                initial="hidden"
                animate="show"
                exit="exit"
                className="space-y-6"
              >
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <ProgressBar
                    current={progressCurrent}
                    total={progressTotal}
                  />
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Completed: {discard.length}</span>
                    <span>Skips: {skipLeft}</span>
                    <span>Deck: {deck.length}</span>
                  </div>
                </motion.div>

                <div className="space-y-3">
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={endSession}
                  >
                    End Session
                  </Button>

                  <Button
                    variant="skip"
                    className="w-full"
                    onClick={() => setPhase("packs")}
                  >
                    Back to Packs
                  </Button>
                </div>
              </motion.div>
            )}

            {/* ---------------- DONE ---------------- */}
            {phase === "done" && (
              <motion.div
                key="done"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 text-center"
              >
                <h1 className="text-3xl font-bold">Session Complete ✨</h1>
                <p className="text-muted-foreground">
                  You completed {discard.length} cards. Want another round?
                </p>

                <div className="rounded-3xl border border-border bg-card p-6 shadow-soft text-left">
                  <div className="text-sm font-semibold mb-2">Last 3 cards</div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {discard
                      .slice(-3)
                      .reverse()
                      .map((c) => (
                        <li key={c.id}>
                          • {c.packTitle}: {c.text}
                        </li>
                      ))}
                  </ul>
                </div>

                <Button className="w-full" onClick={() => setPhase("packs")}>
                  Play Again
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* ✅ Overlay lives OUTSIDE max-w-lg so it can be wide */}
      <AnimatePresence>
        {openPack && (
          <PackOverlay
            key={openPack.id}
            packId={openPack.id}
            title={openPack.title}
            description={openPack.description}
            count={openPackCount}
            accent={
              (["pink", "violet", "sky", "emerald", "amber"] as const)[
                PACKS.findIndex((p) => p.id === openPack.id) % 5
              ]
            }
            // cards={overlayCards}
            // skipsLeft={overlaySkipsLeft}
            // onSkip={skipOverlayCard}
            onClose={() => setOpenPackId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
