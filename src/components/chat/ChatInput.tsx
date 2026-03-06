import { useState, useRef, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Image,
  FileCode,
  Paperclip,
  Sparkles,
  Video,
  Music,
  X,
  FileText,
} from "lucide-react";

interface AttachedFile {
  name: string;
  type: string;
  dataUrl: string;
}

interface ChatInputProps {
  onSend: (message: string, mode?: string, files?: AttachedFile[]) => void;
  disabled?: boolean;
}

const modes = [
  { id: "chat", icon: Sparkles, label: "Chat" },
  { id: "image", icon: Image, label: "Imagem" },
  { id: "code", icon: FileCode, label: "Código" },
  { id: "video", icon: Video, label: "Vídeo" },
  { id: "audio", icon: Music, label: "Áudio" },
];

export const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("chat");
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if ((!input.trim() && attachedFiles.length === 0) || disabled) return;
    onSend(input.trim(), mode, attachedFiles.length > 0 ? attachedFiles : undefined);
    setInput("");
    setAttachedFiles([]);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = Math.min(ta.scrollHeight, 200) + "px";
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      if (file.size > 20 * 1024 * 1024) return;
      const reader = new FileReader();
      reader.onload = () => {
        setAttachedFiles((prev) => [
          ...prev,
          { name: file.name, type: file.type, dataUrl: reader.result as string },
        ]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const activeMode = modes.find((m) => m.id === mode)!;

  return (
    <div className="px-4 pb-4 pt-2">
      {/* Mode selector */}
      <div className="flex gap-1.5 mb-3">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-medium uppercase tracking-wider transition-all duration-200 ${
              mode === m.id
                ? "bg-white/[0.15] text-white border border-white/[0.2] shadow-[0_8px_20px_rgba(0,0,0,0.3)]"
                : "bg-white/[0.035] text-white/60 border border-white/[0.06] hover:bg-white/[0.06] hover:text-white/80"
            }`}
          >
            <m.icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{m.label}</span>
          </button>
        ))}
      </div>

      {/* Attached files preview */}
      <AnimatePresence>
        {attachedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2 mb-2"
          >
            {attachedFiles.map((file, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex items-center gap-1.5 px-2 py-1 rounded-xl text-xs"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {file.type.startsWith("image/") ? (
                  <img src={file.dataUrl} alt="" className="w-6 h-6 rounded object-cover" />
                ) : (
                  <FileText className="w-3.5 h-3.5 text-white/50" />
                )}
                <span className="truncate max-w-[100px] text-white/70">{file.name}</span>
                <button onClick={() => removeFile(i)} className="text-white/40 hover:text-white/80">
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input area */}
      <div
        className="flex items-end gap-2 rounded-2xl p-2"
        style={{
          border: "1px solid rgba(255,255,255,0.1)",
          background: "linear-gradient(180deg, rgba(255,255,255,0.028) 0%, rgba(255,255,255,0.016) 100%), rgba(255,255,255,0.02)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 14px 30px rgba(0,0,0,0.35)",
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,audio/*,text/*,.pdf,.doc,.docx,.js,.ts,.tsx,.jsx,.py,.json,.csv,.html,.css,.md"
          onChange={handleFileSelect}
          className="hidden"
        />
        <button
          id="attachBtn"
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="grid h-9 w-9 min-w-[36px] min-h-[36px] place-items-center rounded-xl text-white/50 hover:text-white/80 hover:bg-white/[0.06] transition"
        >
          <Paperclip className="w-[18px] h-[18px]" />
        </button>

        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={`${activeMode.label}... Digite sua mensagem`}
          disabled={disabled}
          rows={1}
          className="flex-1 bg-transparent border-none outline-none resize-none text-[15px] text-white/92 placeholder:text-white/40 py-2 px-2 min-h-[40px] max-h-[200px] font-sans leading-relaxed"
        />
        <button
          onClick={handleSend}
          disabled={(!input.trim() && attachedFiles.length === 0) || disabled}
          className="grid h-9 w-9 min-w-[36px] min-h-[36px] place-items-center rounded-xl transition-all shrink-0 disabled:opacity-20"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.8))",
            color: "#000",
            boxShadow: "0 0 14px rgba(255,255,255,0.2)",
          }}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
