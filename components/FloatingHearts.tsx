import { motion } from "framer-motion";

const FloatingHearts = () => {
  const hearts = [
    { delay: 0, x: "10%", size: "text-2xl" },
    { delay: 1, x: "80%", size: "text-xl" },
    { delay: 2, x: "30%", size: "text-lg" },
    { delay: 0.5, x: "70%", size: "text-2xl" },
    { delay: 1.5, x: "50%", size: "text-xl" },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart, i) => (
        <motion.span
          key={i}
          className={`absolute ${heart.size} opacity-20`}
          style={{ left: heart.x }}
          initial={{ y: "100vh", opacity: 0.1 }}
          animate={{
            y: "-10vh",
            opacity: [0.1, 0.3, 0.1],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 8,
            delay: heart.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          💕
        </motion.span>
      ))}
    </div>
  );
};

export default FloatingHearts;
