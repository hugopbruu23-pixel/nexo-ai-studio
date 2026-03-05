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
  ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  { id: "image", icon: Image, label: "Gerar Imagem" },
  { id: "code", icon: FileCode, label: "Gerar Código" },
  { id: "video", icon: Video, label: "Gerar Vídeo" },
  { id: "audio", icon: Music, label: "Gerar Áudio" },
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
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
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
      if (file.size > 20 * 1024 * 1024) return; // 20MB limit
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 border-t border-border bg-background"
    >
      {/* Mode selector */}
      <div className="flex gap-1 mb-3">
        {modes.map((m) => (
          <Tooltip key={m.id}>
            <TooltipTrigger asChild>
              <button
                onClick={() => setMode(m.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  mode === m.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                <m.icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{m.label}</span>
              </button>
            </TooltipTrigger>
            <TooltipContent>{m.label}</TooltipContent>
          </Tooltip>
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
                className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-secondary border border-border text-xs"
              >
                {file.type.startsWith("image/") ? (
                  <img src={file.dataUrl} alt="" className="w-6 h-6 rounded object-cover" />
                ) : (
                  <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                )}
                <span className="truncate max-w-[100px] text-muted-foreground">{file.name}</span>
                <button onClick={() => removeFile(i)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input area */}
      <div className="flex items-end gap-2 nexo-glass rounded-xl p-2">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,text/*,.pdf,.doc,.docx,.js,.ts,.tsx,.jsx,.py,.json,.csv,.html,.css,.md"
          onChange={handleFileSelect}
          className="hidden"
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 text-muted-foreground hover:text-foreground shrink-0"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Anexar arquivo</TooltipContent>
        </Tooltip>

        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={`${activeMode.label}... Digite sua mensagem`}
          disabled={disabled}
          rows={1}
          className="flex-1 bg-transparent border-none outline-none resize-none text-sm text-foreground placeholder:text-muted-foreground py-2 px-2 min-h-[40px] max-h-[200px] font-sans"
        />
        <Button
          onClick={handleSend}
          disabled={(!input.trim() && attachedFiles.length === 0) || disabled}
          size="sm"
          className="rounded-lg h-9 w-9 p-0 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-30 transition-all shrink-0"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};
