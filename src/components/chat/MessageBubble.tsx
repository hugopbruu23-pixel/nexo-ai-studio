import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check, Download, Eye, FileText, ImageIcon } from "lucide-react";
import { useState, Children, isValidElement } from "react";
import { StreamingCursor } from "./StreamingCursor";

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
  images?: string[];
  files?: { name: string; type: string; dataUrl: string }[];
  onPreviewCode?: (code: string, lang: string) => void;
  onDownloadFile?: (content: string, filename: string) => void;
}

export const MessageBubble = ({
  role,
  content,
  isStreaming,
  images,
  files,
  onPreviewCode,
  onDownloadFile,
}: MessageBubbleProps) => {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 ${
          isUser
            ? ""
            : ""
        }`}
        style={
          isUser
            ? {
                background: "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.06))",
                border: "1px solid rgba(255,255,255,0.16)",
                boxShadow: "0 14px 30px rgba(0,0,0,0.35)",
              }
            : {
                background: "linear-gradient(180deg, rgba(255,255,255,0.022) 0%, rgba(255,255,255,0.014) 100%), rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.075)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 14px 30px rgba(0,0,0,0.35)",
              }
        }
      >
        {/* Attached files */}
        {files && files.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {files.map((file, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {file.type.startsWith("image/") ? (
                  <ImageIcon className="w-3 h-3 text-white/50" />
                ) : (
                  <FileText className="w-3 h-3 text-white/50" />
                )}
                <span className="truncate max-w-[120px] text-white/70">{file.name}</span>
              </div>
            ))}
          </div>
        )}

        {/* Generated images */}
        {images && images.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {images.map((img, i) => (
              <motion.img
                key={i}
                src={img}
                alt="Generated"
                className="rounded-xl max-w-[300px] max-h-[300px] object-cover"
                style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
              />
            ))}
          </div>
        )}

        <div className="break-words text-[15px] leading-7 text-white/92">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              pre({ children }) {
                return <>{children}</>;
              },
              code({ className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                const codeStr = String(children).replace(/\n$/, "");

                if (match) {
                  return (
                    <CodeBlock
                      code={codeStr}
                      language={match[1]}
                      onPreview={onPreviewCode}
                      onDownload={onDownloadFile}
                    />
                  );
                }
                return (
                  <code
                    className="rounded-md px-1.5 py-0.5 font-mono text-[13px] text-white/95"
                    style={{ background: "rgba(255,255,255,0.08)" }}
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
              p({ children }) {
                return <p className="mb-3 last:mb-0">{children}</p>;
              },
              ul({ children }) {
                return <ul className="mb-3 list-disc pl-5 marker:text-white/60">{children}</ul>;
              },
              ol({ children }) {
                return <ol className="mb-3 list-decimal pl-5 marker:text-white/60">{children}</ol>;
              },
              li({ children }) {
                return <li className="mb-1">{children}</li>;
              },
              h1({ children }) {
                return <h1 className="mb-3 mt-2 text-xl font-semibold text-white">{children}</h1>;
              },
              h2({ children }) {
                return <h2 className="mb-3 mt-2 text-lg font-semibold text-white">{children}</h2>;
              },
              h3({ children }) {
                return <h3 className="mb-2 mt-2 text-base font-semibold text-white">{children}</h3>;
              },
              blockquote({ children }) {
                return (
                  <blockquote className="mb-3 border-l-2 pl-3" style={{ borderColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.8)" }}>
                    {children}
                  </blockquote>
                );
              },
              hr() {
                return <hr className="my-3" style={{ borderColor: "rgba(255,255,255,0.12)" }} />;
              },
            }}
          >
            {content}
          </ReactMarkdown>
          {isStreaming && <StreamingCursor />}
        </div>
      </div>
    </motion.div>
  );
};

function CodeBlock({
  code,
  language,
  onPreview,
  onDownload,
}: {
  code: string;
  language: string;
  onPreview?: (code: string, lang: string) => void;
  onDownload?: (content: string, filename: string) => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const area = document.createElement("textarea");
      area.value = code;
      area.style.position = "fixed";
      area.style.left = "-9999px";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      document.body.removeChild(area);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const isPreviewable = ["html", "jsx", "tsx"].includes(language);
  const ext = language === "tsx" || language === "jsx" ? "tsx" : language;

  return (
    <div
      className="my-3 overflow-hidden rounded-2xl"
      style={{
        border: "1px solid rgba(255,255,255,0.075)",
        background: "rgba(255,255,255,0.02)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 14px 30px rgba(0,0,0,0.35)",
      }}
    >
      <div
        className="flex items-center justify-between gap-2 px-3 py-2"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.075)", background: "rgba(0,0,0,0.2)" }}
      >
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">
          {language}
        </span>
        <div className="flex gap-1">
          {isPreviewable && onPreview && (
            <button
              type="button"
              onClick={() => onPreview(code, language)}
              className="inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-[11px] font-medium transition
                text-white/70 hover:text-white hover:bg-white/[0.1]"
              style={{ border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Preview</span>
            </button>
          )}
          {onDownload && (
            <button
              type="button"
              onClick={() => onDownload(code, `code.${ext}`)}
              className="inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-[11px] font-medium transition
                text-white/70 hover:text-white hover:bg-white/[0.1]"
              style={{ border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <Download className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={handleCopy}
            className={`inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-[11px] font-medium transition ${
              copied
                ? "bg-white/[0.18] text-white"
                : "text-white/70 hover:text-white hover:bg-white/[0.1]"
            }`}
            style={{ border: copied ? "1px solid rgba(255,255,255,0.24)" : "1px solid rgba(255,255,255,0.1)" }}
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? "Copiado" : "Copiar"}</span>
          </button>
        </div>
      </div>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          background: "transparent",
          padding: "12px 16px",
          fontSize: "13px",
          lineHeight: "1.6",
        }}
        codeTagProps={{
          style: {
            fontFamily: "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          },
        }}
        showLineNumbers={false}
        wrapLongLines
      >
        {code || " "}
      </SyntaxHighlighter>
    </div>
  );
}
