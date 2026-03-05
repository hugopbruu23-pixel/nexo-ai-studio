import { motion } from "framer-motion";

export const ThinkingAnimation = () => {
  return (
    <div className="flex items-center gap-3 py-4 px-1">
      <div className="relative w-10 h-10">
        <motion.div
          className="absolute inset-0 m-auto w-3 h-3 rounded-full bg-foreground"
          animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-foreground/60"
            animate={{
              rotate: 360,
              x: [0, Math.cos((i * 2 * Math.PI) / 3) * 14, 0],
              y: [0, Math.sin((i * 2 * Math.PI) / 3) * 14, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
          />
        ))}
        <motion.div
          className="absolute inset-0 rounded-full border border-foreground/20"
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col gap-1"
      >
        <span className="text-xs text-muted-foreground">Nexo está pensando...</span>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1 h-1 rounded-full bg-muted-foreground"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};
