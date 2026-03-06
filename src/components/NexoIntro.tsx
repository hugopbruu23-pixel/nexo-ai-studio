import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

interface NexoIntroProps {
  onFinish?: () => void;
}

const PHASES = [
  "Inicializando núcleo",
  "Carregando modelos",
  "Calibrando IA",
  "Pronto",
];

export const NexoIntro = ({ onFinish }: NexoIntroProps) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0);
  const [hiding, setHiding] = useState(false);

  const finish = useCallback(() => {
    setHiding(true);
    setTimeout(() => onFinish?.(), 500);
  }, [onFinish]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(100, p + 1.2 + Math.random() * 2.5);
        const newPhase = Math.min(PHASES.length - 1, Math.floor((next / 100) * PHASES.length));
        setPhase(newPhase);
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(finish, 600);
        }
        return next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [finish]);

  const circumference = 2 * Math.PI * 50;
  const dashOffset = circumference - (progress / 100) * circumference;

  return (
    <AnimatePresence>
      {!hiding && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.42 }}
          className="fixed inset-0 z-[2147483647] grid place-items-center overflow-hidden p-[18px]"
          style={{
            background: `
              radial-gradient(circle at 50% 11%, rgba(255, 255, 255, 0.1), transparent 40%),
              radial-gradient(circle at 86% 86%, rgba(255, 255, 255, 0.035), transparent 35%),
              linear-gradient(180deg, #09090b 0%, #030305 100%)
            `,
          }}
        >
          {/* Grid backdrop */}
          <div
            className="absolute pointer-events-none opacity-[0.13]"
            style={{
              inset: "-25%",
              background: `
                linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px) 0 0 / 42px 42px,
                linear-gradient(90deg, rgba(255,255,255,0.038) 1px, transparent 1px) 0 0 / 42px 42px
              `,
              maskImage: "radial-gradient(circle at 50% 42%, black 22%, transparent 75%)",
              WebkitMaskImage: "radial-gradient(circle at 50% 42%, black 22%, transparent 75%)",
              animation: "nexo-boot-grid-drift 34s linear infinite",
            }}
          />

          {/* Ambient glow orbs */}
          <div
            className="absolute pointer-events-none rounded-full opacity-[0.16] mix-blend-screen"
            style={{
              top: "-20%", left: "-14%",
              width: "min(42vw, 620px)", height: "min(42vw, 620px)",
              background: "radial-gradient(circle, rgba(255,255,255,0.19), transparent 72%)",
              filter: "blur(42px)",
            }}
          />
          <div
            className="absolute pointer-events-none rounded-full opacity-[0.14] mix-blend-screen"
            style={{
              right: "-18%", bottom: "-30%",
              width: "min(46vw, 680px)", height: "min(46vw, 680px)",
              background: "radial-gradient(circle, rgba(255,255,255,0.14), transparent 74%)",
              filter: "blur(42px)",
            }}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.972, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.72, ease: [0.2, 0.85, 0.25, 1] }}
            className="relative z-[2] w-[min(560px,94vw)] flex flex-col gap-[10px] overflow-hidden"
            style={{
              borderRadius: 28,
              border: "1px solid rgba(255,255,255,0.16)",
              background: `
                radial-gradient(circle at 50% -36%, rgba(255,255,255,0.1), transparent 52%),
                linear-gradient(180deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.018) 100%),
                rgba(6,6,8,0.88)
              `,
              boxShadow: `
                inset 0 1px 0 rgba(255,255,255,0.12),
                inset 0 -1px 0 rgba(255,255,255,0.05),
                0 30px 60px rgba(0,0,0,0.54),
                0 0 ${8 + progress * 0.18}px rgba(255,255,255,0.08)
              `,
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              padding: "20px 24px 20px",
            }}
          >
            {/* Logo with orbits */}
            <div className="relative w-[126px] h-[126px] mx-auto grid place-items-center">
              {/* Outer orbit */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  border: "1px solid rgba(255,255,255,0.28)",
                  boxShadow: "0 0 0 9px rgba(255,255,255,0.024), 0 0 44px rgba(255,255,255,0.13)",
                  animation: "nexo-boot-orbit 4.8s linear infinite",
                }}
              />
              {/* Inner orbit */}
              <div
                className="absolute rounded-full pointer-events-none"
                style={{
                  inset: 17,
                  border: "1px dashed rgba(255,255,255,0.24)",
                  animation: "nexo-boot-orbit-reverse 4s linear infinite",
                }}
              />
              {/* Shine ring */}
              <div
                className="absolute rounded-full pointer-events-none"
                style={{
                  inset: "22px 22px 28px",
                  background: "conic-gradient(from 90deg, rgba(255,255,255,0.42), rgba(255,255,255,0.04), rgba(255,255,255,0.38))",
                  filter: "blur(1.4px)",
                  opacity: 0.46,
                  animation: "nexo-boot-shine 3.2s ease-in-out infinite",
                }}
              />
              {/* Progress meter */}
              <svg className="absolute" style={{ inset: 8, width: "calc(100% - 16px)", height: "calc(100% - 16px)", transform: "rotate(-90deg)" }}>
                <circle cx="50%" cy="50%" r="50" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="4.4" />
                <circle
                  cx="50%" cy="50%" r="50" fill="none"
                  stroke="#ffffff" strokeWidth="4.4" strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  style={{
                    filter: "drop-shadow(0 0 8px rgba(255,255,255,0.28))",
                    transition: "stroke-dashoffset 120ms linear",
                  }}
                />
              </svg>
              {/* Logo icon */}
              <div
                className="relative grid place-items-center rounded-[20px]"
                style={{
                  width: 74, height: 74,
                  boxShadow: "0 14px 30px rgba(0,0,0,0.5), 0 0 24px rgba(255,255,255,0.14)",
                  animation: "nexo-boot-float 2.3s ease-in-out infinite",
                  background: "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <Sparkles className="w-9 h-9 text-white/90" />
              </div>
            </div>

            {/* Brand */}
            <div
              className="text-center text-[30px] font-bold leading-none"
              style={{
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.95)",
                textShadow: "0 8px 22px rgba(255,255,255,0.14)",
              }}
            >
              NEXO
            </div>

            {/* Status */}
            <div
              className="text-center text-xs font-semibold uppercase"
              style={{ letterSpacing: "0.1em", color: "rgba(255,255,255,0.72)" }}
            >
              {PHASES[phase]}
            </div>

            {/* Progress bar */}
            <div
              className="relative mt-[7px] w-full overflow-hidden"
              style={{
                height: 14,
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.16)",
                background: "rgba(255,255,255,0.07)",
                boxShadow: "inset 0 1px 3px rgba(0,0,0,0.36), 0 7px 18px rgba(0,0,0,0.28)",
              }}
            >
              {/* Scan effect */}
              <div
                className="absolute pointer-events-none mix-blend-screen"
                style={{
                  top: "-55%", bottom: "-55%", left: "-36%", width: "28%",
                  borderRadius: 999,
                  background: "linear-gradient(100deg, rgba(255,255,255,0), rgba(255,255,255,0.22), rgba(255,255,255,0))",
                  transform: "skewX(-24deg)",
                  opacity: 0.66,
                  animation: "nexo-boot-progress-scan 1.65s ease-in-out infinite",
                }}
              />
              {/* Fill */}
              <div
                className="relative h-full"
                style={{
                  width: `${Math.min(100, progress)}%`,
                  minWidth: 0, maxWidth: "100%",
                  borderRadius: "inherit",
                  background: "linear-gradient(90deg, #fdfdff 0%, #e0e6ee 40%, #ffffff 60%, #d8dfe8 100%)",
                  backgroundSize: "220% 100%",
                  boxShadow: "0 0 14px rgba(255,255,255,0.34), inset 0 1px 0 rgba(255,255,255,0.34)",
                  transition: "width 140ms linear",
                  animation: "nexo-boot-progress-flow 1s linear infinite",
                }}
              >
                {/* Head glow */}
                <div
                  className="absolute"
                  style={{
                    top: "50%", right: -8, width: 15, height: 15,
                    borderRadius: 999,
                    transform: "translateY(-50%)",
                    background: "radial-gradient(circle, #ffffff 0%, rgba(255,255,255,0.4) 70%, transparent 100%)",
                    animation: "nexo-boot-head-pulse 1s ease-in-out infinite",
                  }}
                />
              </div>
              {/* Gloss */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.16), rgba(255,255,255,0))" }}
              />
            </div>

            {/* Footer */}
            <div className="mt-[6px] flex items-center justify-between gap-2" style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.58)" }}>
              <span>Nexo AI • v2.0</span>
              <span style={{ fontVariantNumeric: "tabular-nums", color: "rgba(255,255,255,0.92)", minWidth: 48, textAlign: "right" }}>
                {Math.round(progress)}%
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
