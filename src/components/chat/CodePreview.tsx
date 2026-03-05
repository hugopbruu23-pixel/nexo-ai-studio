import { motion } from "framer-motion";
import { X, ExternalLink, RefreshCw, Monitor, Smartphone, Tablet } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    const fullHtml = language === "html" && !code.includes("<html")
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
      className="h-full flex flex-col bg-card border-l border-border"
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
        <div className="flex items-center gap-1">
          <div className="flex gap-1 mr-3">
            <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-nexo-success/60" />
          </div>
          <span className="text-xs font-mono text-muted-foreground">Preview</span>
        </div>

        <div className="flex items-center gap-1">
          {/* Viewport buttons */}
          {(Object.keys(viewportSizes) as ViewportSize[]).map((vp) => {
            const VpIcon = viewportSizes[vp].icon;
            return (
              <Button
                key={vp}
                variant="ghost"
                size="sm"
                className={`h-7 w-7 p-0 ${viewport === vp ? "text-foreground bg-accent" : "text-muted-foreground"}`}
                onClick={() => setViewport(vp)}
              >
                <VpIcon className="w-3.5 h-3.5" />
              </Button>
            );
          })}
          <div className="w-px h-4 bg-border mx-1" />
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
            onClick={() => setRefreshKey((k) => k + 1)}
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
            onClick={() => window.open(previewUrl, "_blank")}
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
            onClick={onClose}
          >
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* URL Bar */}
      <div className="px-3 py-1.5 border-b border-border bg-muted/20">
        <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-secondary/50 border border-border">
          <div className="w-3 h-3 rounded-full bg-nexo-success/50" />
          <span className="text-[11px] font-mono text-muted-foreground truncate">
            preview://nexo-ai/live-preview
          </span>
        </div>
      </div>

      {/* Preview iframe */}
      <div className="flex-1 overflow-auto flex justify-center bg-background/50 p-4">
        <motion.div
          animate={{ width: currentVp.width }}
          transition={{ duration: 0.3 }}
          className="h-full bg-background border border-border rounded-lg overflow-hidden shadow-2xl"
          style={{ maxWidth: currentVp.width }}
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
      <div className="flex items-center justify-between px-3 py-1 border-t border-border bg-muted/20 text-[10px] text-muted-foreground">
        <span>{currentVp.label} • {language.toUpperCase()}</span>
        <span className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-nexo-success animate-pulse" />
          Live Preview
        </span>
      </div>
    </motion.div>
  );
};
