import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GameCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  onClick: () => void;
  index: number;
}

const GameCard = ({
  title,
  description,
  icon,
  onClick,
  index,
}: GameCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="card-gradient rounded-3xl p-6 shadow-card cursor-pointer border border-border/50 hover:shadow-glow transition-shadow duration-300"
    >
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl romantic-gradient flex items-center justify-center text-2xl shadow-soft shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-xl font-semibold text-foreground mb-1">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {description}
          </p>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <span className="text-primary text-sm font-medium flex items-center gap-1">
          Play now
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </span>
      </div>
    </motion.div>
  );
};

export default GameCard;
