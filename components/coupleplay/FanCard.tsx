import { motion } from "framer-motion";
import type { CardDTO } from "@/lib/coupleplay/cards-data";

export function FanCard({
  card,
  i,
  total,
  onPick,
}: {
  card: CardDTO;
  i: number;
  total: number;
  onPick: (card: CardDTO) => void;
}) {
  const mid = (total - 1) / 2;
  const offset = i - mid;

  // ✅ packed values for 5 cards
  const X_STEP = 26; // was 64 (too spread)
  const ROT_STEP = 7; // was 10 (a bit heavy with packed fan)
  const Y_STEP = 1.5; // tiny lift so center looks slightly on top

  return (
    <motion.button
      type="button"
      onClick={() => onPick(card)}
      className="absolute left-1/2 top-0 rounded-2xl border bg-card shadow-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      style={{
        width: 112,
        height: 160,
        // ✅ stronger "pointed at bottom" pivot (deeper origin)
        transformOrigin: "50% 170%",
      }}
      initial={{ opacity: 0, y: 18, rotate: 0, x: 0, scale: 0.96 }}
      animate={{
        opacity: 1,
        y: Math.abs(offset) * 1.5, // subtle layering
        rotate: offset * ROT_STEP, // tight fan
        x: offset * X_STEP - 56, // packed fan
        scale: 1,
        transition: { type: "spring", stiffness: 420, damping: 30 },
      }}
      exit={{
        opacity: 0,
        y: -14,
        rotate: offset * ROT_STEP,
        x: offset * X_STEP,
        scale: 0.92,
        transition: { duration: 0.18 },
      }}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="relative h-full w-full overflow-hidden rounded-2xl">
        <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle_at_20%_20%,white,transparent_55%),radial-gradient(circle_at_70%_40%,white,transparent_55%)]" />
        <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.06] to-transparent" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-full bg-foreground/5 px-3 py-1 text-xs text-muted-foreground">
            Tap to reveal
          </div>
        </div>

        <div className="absolute left-3 top-3 text-[10px] text-muted-foreground/80">
          🂠
        </div>
      </div>
    </motion.button>
  );
}
