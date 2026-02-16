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

import { phaseSlide, headingIn, subheadingIn, listStagger } from "@/lib/motion";

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const VALENTINE_PACK_ID = "delulu_romance";

type Accent = "pink" | "violet" | "sky" | "emerald" | "amber" | "valentine";

export default function CardTableClient() {
  const [phase, setPhase] = useState<"packs" | "play" | "done">("packs");

  // selection kept for future (you already had it). Not used heavily now.
  const [selectedPacks, setSelectedPacks] = useState<string[]>(["warmup", "fun"]);

  // play phase state (you can keep as-is)
  const [skipLeft, setSkipLeft] = useState(3);
  const [deck, setDeck] = useState<CardDTO[]>([]);
  const [discard, setDiscard] = useState<CardDTO[]>([]);

  // opened pack overlay
  const [openPackId, setOpenPackId] = useState<string | null>(null);

  const unlockedPackIds = useMemo(() => {
    return new Set(PACKS.filter((p) => !p.locked).map((p) => p.id));
  }, []);

  const packs = useMemo(() => {
    // keep original ordering but ensure valentine pack exists in list
    return PACKS.map((p) => ({ ...p, isUnlocked: unlockedPackIds.has(p.id) }));
  }, [unlockedPackIds]);

  const featuredPack = useMemo(
    () => packs.find((p) => p.id === VALENTINE_PACK_ID) ?? null,
    [packs]
  );

  const otherPacks = useMemo(
    () => packs.filter((p) => p.id !== VALENTINE_PACK_ID),
    [packs]
  );

  function togglePack(id: string) {
    setSelectedPacks((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
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

  const progressCurrent = Math.max(1, discard.length);
  const progressTotal = Math.max(1, discard.length + deck.length + 6);

  const openPack = openPackId ? PACKS.find((p) => p.id === openPackId) : null;

  const openPackCount = openPackId
    ? CARDS.filter((c) => c.packId === openPackId).length
    : 0;

  function getAccentForPack(packId: string, fallbackIndex: number): Accent {
    if (packId === VALENTINE_PACK_ID) return "valentine";
    return (["pink", "violet", "sky", "emerald", "amber"] as const)[fallbackIndex % 5];
  }

  return (
    <div className="min-h-screen">
      <Header />

      {/* Packs uses fixed height area so scrolling works smoothly */}
      <main className="pt-24 px-4 h-[calc(100vh-6rem)] overflow-hidden">
        <div className="mx-auto w-full max-w-6xl h-full">
          <AnimatePresence mode="wait">
            {/* ---------------- PACK SELECT ---------------- */}
            {phase === "packs" && (
              <motion.div
                key="packs"
                variants={phaseSlide}
                initial="hidden"
                animate="show"
                exit="exit"
                className="flex flex-col gap-6 h-full"
              >
                <motion.div initial="hidden" animate="show" className="text-center">
                  <motion.h1
                    variants={headingIn}
                    className="text-3xl font-bold mb-2 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 bg-clip-text text-transparent"
                  >
                    Play with Cards ⭐
                  </motion.h1>

                  <motion.p variants={subheadingIn} className="text-muted-foreground">
                    Tap a pack to open it.
                  </motion.p>
                </motion.div>

                {/* Scroll area */}
                <div className="flex-1 min-h-0">
                  <motion.div
                    variants={listStagger}
                    custom={0.12}
                    initial="hidden"
                    animate="show"
                    className="h-full"
                  >
                    <div className="h-full overflow-y-auto overscroll-contain pb-10 pt-2">
                      {/* 2-column layout */}
                      <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
                        {/* LEFT: Featured Valentine column */}
                        <div className="lg:sticky lg:top-2 h-fit px-2 sm:px-4">
                          <div className="rounded-[28px] border border-white/10 bg-card/40 backdrop-blur-md shadow-soft p-4 sm:p-5">
                            <div className="mb-3">
                              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                                Featured
                              </div>
                              <div className="text-xl font-semibold">Valentine Spotlight 💘</div>
                              <div className="text-sm text-muted-foreground mt-1">
                                Romantic prompts, sweet dares, and flirty confessions.
                              </div>
                            </div>

                            {featuredPack ? (
                              <div className="w-full">
                                <PackStack
                                  packId={featuredPack.id}
                                  title={featuredPack.title}
                                  description={featuredPack.description}
                                  locked={!featuredPack.isUnlocked}
                                  selected={selectedPacks.includes(featuredPack.id)}
                                  count={CARDS.filter((c) => c.packId === featuredPack.id).length}
                                  accent={"valentine"}
                                  onToggle={() => {
                                    if (!featuredPack.isUnlocked) return;
                                    // optional: keep selection behavior
                                    togglePack(featuredPack.id);
                                    setOpenPackId(featuredPack.id);
                                  }}
                                />
                              </div>
                            ) : (
                              <div className="text-sm text-muted-foreground">
                                Valentine pack not found (id: {VALENTINE_PACK_ID})
                              </div>
                            )}

                            <div className="mt-6 grid grid-cols-2 gap-2">
                              <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-3">
                                <div className="text-xs text-muted-foreground">Mood</div>
                                <div className="text-sm font-semibold">Romantic</div>
                              </div>
                              <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-3">
                                <div className="text-xs text-muted-foreground">Best for</div>
                                <div className="text-sm font-semibold">Date Night</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* RIGHT: Other packs */}
                        <div className="px-2 sm:px-4">
                          <div className="flex items-end justify-between gap-4 mb-4">
                            <div>
                              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                                All Packs
                              </div>
                              <div className="text-lg font-semibold">More categories</div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {otherPacks.length} packs
                            </div>
                          </div>

                          <div className="grid justify-center grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                            {otherPacks.map((p, index) => {
                              const selected = selectedPacks.includes(p.id);
                              const locked = !p.isUnlocked;

                              const accent = getAccentForPack(p.id, index);

                              const count = CARDS.filter((c) => c.packId === p.id).length;

                              return (
                                <div key={p.id} className="flex justify-center">
                                  <div className="w-full max-w-[200px] sm:max-w-[220px] lg:max-w-[240px] xl:max-w-[260px]">
                                    <PackStack
                                      packId={p.id}
                                      title={p.title}
                                      description={p.description}
                                      locked={locked}
                                      selected={selected}
                                      count={count}
                                      accent={accent}
                                      onToggle={() => {
                                        if (locked) return;
                                        // optional: keep selection behavior
                                        togglePack(p.id);
                                        setOpenPackId(p.id);
                                      }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                      {/* end grid */}
                    </div>
                  </motion.div>
                </div>
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
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                  <ProgressBar current={progressCurrent} total={progressTotal} />
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Completed: {discard.length}</span>
                    <span>Skips: {skipLeft}</span>
                    <span>Deck: {deck.length}</span>
                  </div>
                </motion.div>

                <div className="space-y-3">
                  <Button variant="secondary" className="w-full" onClick={endSession}>
                    End Session
                  </Button>

                  <Button variant="skip" className="w-full" onClick={() => setPhase("packs")}>
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

      {/* Overlay */}
      <AnimatePresence>
        {openPack && (
          <PackOverlay
            key={openPack.id}
            packId={openPack.id}
            title={openPack.title}
            description={openPack.description}
            count={openPackCount}
            accent={
              openPack.id === VALENTINE_PACK_ID
                ? "valentine"
                : (["pink", "violet", "sky", "emerald", "amber"] as const)[
                    PACKS.findIndex((p) => p.id === openPack.id) % 5
                  ]
            }
            onClose={() => setOpenPackId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
