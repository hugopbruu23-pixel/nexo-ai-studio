import { motion } from "framer-motion";
import { X, ExternalLink, RefreshCw, Monitor, Smartphone, Tablet } from "lucide-react";
import { useState, useMemo } from "react";

interface CodePreviewProps {
  code: string;
  language: string;
  onClose: () => void;
}

type ViewportSize = "desktop" | "tablet" | "mobile";

const viewportSizes: Record<ViewportSize, { width: string; label: string; icon: any }> = {
  desktop: { width: "100%", label: "Desktop", icon: Monitor },
  tablet: { width: "768px", label: "Tablet", icon: Tablet },
  mobile: { width: "375px", label: "Mobile", icon: Smartphone },
};

export const CodePreview = ({ code, language, onClose }: CodePreviewProps) => {
  const [viewport, setViewport] = useState<ViewportSize>("desktop");
  const [refreshKey, setRefreshKey] = useState(0);

  const previewUrl = useMemo(() => {
    const fullHtml =
      language === "html" && !code.includes("<html")
        ? `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:system-ui,sans-serif;background:#0a0a0a;color:#f5f5f5}</style></head><body>${code}</body></html>`
        : code;
    const blob = new Blob([fullHtml], { type: "text/html" });
    return URL.createObjectURL(blob);
  }, [code, language, refreshKey]);

  const currentVp = viewportSizes[viewport];

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.3 }}
      className="h-full flex flex-col"
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.016) 0%, rgba(0,0,0,0.2) 100%)",
        borderLeft: "1px solid rgba(255,255,255,0.075)",
      }}
    >
      {/* Toolbar */}
      <div
        className="flex items-center justify-between px-3 py-2"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.075)", background: "rgba(255,255,255,0.02)" }}
      >
        <div className="flex items-center gap-1">
          <div className="flex gap-1.5 mr-3">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(255,100,100,0.6)" }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(255,200,50,0.6)" }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(50,200,100,0.6)" }} />
          </div>
          <span className="text-[11px] font-mono text-white/50 uppercase tracking-wider">Preview</span>
        </div>

        <div className="flex items-center gap-1">
          {(Object.keys(viewportSizes) as ViewportSize[]).map((vp) => {
            const VpIcon = viewportSizes[vp].icon;
            return (
              <button
                key={vp}
                className={`grid h-7 w-7 place-items-center rounded-lg transition ${
                  viewport === vp
                    ? "bg-white/[0.12] text-white/90"
                    : "text-white/40 hover:text-white/70 hover:bg-white/[0.06]"
                }`}
                onClick={() => setViewport(vp)}
              >
                <VpIcon className="w-3.5 h-3.5" />
              </button>
            );
          })}
          <div className="w-px h-4 mx-1" style={{ background: "rgba(255,255,255,0.1)" }} />
          <button
            className="grid h-7 w-7 place-items-center rounded-lg text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition"
            onClick={() => setRefreshKey((k) => k + 1)}
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            className="grid h-7 w-7 place-items-center rounded-lg text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition"
            onClick={() => window.open(previewUrl, "_blank")}
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
          <button
            className="grid h-7 w-7 place-items-center rounded-lg text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition"
            onClick={onClose}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* URL bar */}
      <div className="px-3 py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.01)" }}>
        <div
          className="flex items-center gap-2 px-3 py-1 rounded-xl"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(50,200,100,0.5)" }} />
          <span className="text-[11px] font-mono text-white/45 truncate">
            preview://nexo-ai/live-preview
          </span>
        </div>
      </div>

      {/* Preview iframe */}
      <div className="flex-1 overflow-auto flex justify-center p-4" style={{ background: "rgba(0,0,0,0.3)" }}>
        <motion.div
          animate={{ width: currentVp.width }}
          transition={{ duration: 0.3 }}
          className="h-full overflow-hidden rounded-xl"
          style={{
            maxWidth: currentVp.width,
            border: "1px solid rgba(255,255,255,0.075)",
            boxShadow: "0 30px 60px rgba(0,0,0,0.5)",
          }}
        >
          <iframe
            key={refreshKey}
            src={previewUrl}
            className="w-full h-full border-none"
            sandbox="allow-scripts allow-same-origin"
            title="Code Preview"
          />
        </motion.div>
      </div>

      {/* Status bar */}
      <div
        className="flex items-center justify-between px-3 py-1 text-[10px] text-white/45 uppercase tracking-wider"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.01)" }}
      >
        <span>
          {currentVp.label} • {language.toUpperCase()}
        </span>
        <span className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400/80 animate-pulse" />
          Live
        </span>
      </div>
    </motion.div>
  );
};
