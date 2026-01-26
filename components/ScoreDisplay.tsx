import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ScoreDisplayProps {
  score: number;
  label: string;
  message: string;
}

const ScoreDisplay = ({ score, label, message }: ScoreDisplayProps) => {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = score / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setDisplayScore(score);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.round(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score]);

  const getEmojis = (score: number) => {
    if (score >= 90) return ["💕", "🥰", "✨"];
    if (score >= 70) return ["❤️", "😊", "💫"];
    if (score >= 50) return ["💗", "🤗", "🌟"];
    return ["💖", "😄", "⭐"];
  };

  const emojis = getEmojis(score);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="relative inline-block"
      >
        <div className="w-48 h-48 md:w-56 md:h-56 rounded-full romantic-gradient flex items-center justify-center shadow-glow">
          <div className="w-40 h-40 md:w-48 md:h-48 rounded-full bg-card flex flex-col items-center justify-center">
            <motion.span
              className="text-5xl md:text-6xl font-display font-bold gradient-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {displayScore}%
            </motion.span>
            <span className="text-2xl mt-1">{emojis[0]}</span>
          </div>
        </div>

        {/* Floating emojis */}
        <motion.span
          className="absolute -top-2 -right-2 text-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {emojis[1]}
        </motion.span>
        <motion.span
          className="absolute -bottom-2 -left-2 text-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          {emojis[2]}
        </motion.span>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="font-display text-2xl md:text-3xl font-semibold text-foreground mt-8 mb-3"
      >
        {label}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="text-muted-foreground text-lg max-w-sm mx-auto leading-relaxed"
      >
        {message}
      </motion.p>
    </motion.div>
  );
};

export default ScoreDisplay;
