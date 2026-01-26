import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/30"
    >
      <div className="container max-w-lg mx-auto px-4 h-16 flex items-center justify-between">
        {!isHome ? (
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        ) : (
          <div className="w-10" />
        )}

        <div className="flex items-center gap-2">
          <span className="text-xl animate-pulse-heart">❤️</span>
          <span className="font-display text-xl font-semibold gradient-text">
            CouplePlay
          </span>
        </div>

        <div className="w-10" />
      </div>
    </motion.header>
  );
};

export default Header;
