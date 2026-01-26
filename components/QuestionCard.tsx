import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface QuestionCardProps {
  question: string;
  category?: string;
  children?: ReactNode;
}

const categoryColors: Record<string, string> = {
  "Warm-up": "bg-accent/20 text-accent",
  Emotional: "bg-primary/20 text-primary",
  Fun: "bg-secondary text-secondary-foreground",
  Future: "bg-muted text-muted-foreground",
};

const QuestionCard = ({ question, category, children }: QuestionCardProps) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3 }}
        className="glass-card rounded-3xl p-8 shadow-card"
      >
        {category && (
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold mb-6 ${
              categoryColors[category] ||
              "bg-secondary text-secondary-foreground"
            }`}
          >
            {category}
          </motion.span>
        )}
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground leading-relaxed mb-6 text-balance">
          {question}
        </h2>
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default QuestionCard;
