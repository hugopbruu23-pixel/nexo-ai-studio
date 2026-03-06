import { motion } from "framer-motion";

export const StreamingCursor = () => (
  <motion.span
    className="inline-block w-0.5 h-5 ml-0.5 align-middle rounded-full"
    style={{ background: "rgba(255,255,255,0.8)" }}
    animate={{ opacity: [1, 0, 1] }}
    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
  />
);
