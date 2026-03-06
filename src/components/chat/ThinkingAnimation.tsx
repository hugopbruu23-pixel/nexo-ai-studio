import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const PHASES = [
  "Analisando contexto",
  "Planejando resposta",
  "Refinando resposta",
];

export const ThinkingAnimation = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((p) => (p + 1) % PHASES.length);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-3 py-4 px-1">
      <div className="relative w-10 h-10">
        {/* Center dot */}
        <motion.div
          className="absolute inset-0 m-auto w-3 h-3 rounded-full bg-white/80"
          animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Orbiting dots */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-white/60"
            animate={{
              rotate: 360,
              x: [0, Math.cos((i * 2 * Math.PI) / 3) * 14, 0],
              y: [0, Math.sin((i * 2 * Math.PI) / 3) * 14, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
          />
        ))}
        {/* Ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ border: "1px solid rgba(255,255,255,0.2)" }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col gap-1"
      >
        <motion.span
          key={phase}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-white/60 font-medium"
        >
          {PHASES[phase]}
        </motion.span>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1 h-1 rounded-full bg-white/50"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};
