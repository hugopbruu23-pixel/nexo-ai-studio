import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Plus,
  Trash2,
  Settings,
  Image,
  FileCode,
  Music,
  Video,
  Sparkles,
  Puzzle,
  Search,
  Menu,
  Pin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

export interface Conversation {
  id: string;
  title: string;
  lastMessage?: string;
  createdAt: Date;
}

interface ChatSidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  collapsed: boolean;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onToggle: () => void;
}

interface RailButtonProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  expanded: boolean;
  onClick: () => void;
}

const RailButton = ({ icon: Icon, label, active, expanded, onClick }: RailButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    title={label}
    className={`flex w-full items-center overflow-hidden rounded-2xl transition-all duration-300 ${
      expanded ? "gap-2.5 px-3 py-2.5" : "justify-center px-0 py-2.5"
    } ${
      active
        ? "bg-white/[0.09] shadow-[0_12px_30px_rgba(0,0,0,0.40)] text-white/90"
        : "bg-white/[0.035] hover:bg-white/[0.06] hover:shadow-[0_10px_26px_rgba(0,0,0,0.28)] text-white/70 hover:text-white/90"
    }`}
    style={{
      border: active ? "1px solid rgba(255,255,255,0.14)" : "1px solid rgba(255,255,255,0.06)",
    }}
  >
    <Icon className="w-4 h-4 shrink-0" />
    <span
      className={`text-sm font-medium truncate transition-all duration-300 ${
        expanded ? "max-w-[180px] opacity-100" : "max-w-0 opacity-0 pointer-events-none"
      }`}
    >
      {label}
    </span>
  </button>
);

export const ChatSidebar = ({
  conversations,
  activeId,
  collapsed,
  onSelect,
  onNew,
  onDelete,
  onToggle,
}: ChatSidebarProps) => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const expanded = !collapsed;

  const filteredChats = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchValue.toLowerCase())
  );

  const topItems = [
    { key: "menu", icon: Menu, label: "Menu" },
    { key: "new", icon: Plus, label: "Novo Chat" },
    { key: "search", icon: Search, label: "Pesquisar" },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex h-[100dvh] flex-col overflow-hidden
        shadow-[12px_0_48px_rgba(0,0,0,0.55)] will-change-[width]
        transition-[width] duration-300 ease-out
        ${expanded ? "py-4 md:py-6" : "pt-3 pb-6"}`}
      style={{
        width: expanded ? 280 : 72,
        background: "rgba(0,0,0,0.30)",
        backdropFilter: "blur(24px) saturate(120%)",
        WebkitBackdropFilter: "blur(24px) saturate(120%)",
      }}
    >
      {/* Sidebar gradient overlay */}
      <div className="pointer-events-none absolute inset-0 nexo-sidebar-gradient" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-r from-transparent to-black/35" />

      <div className="relative flex h-full min-h-0 flex-1 flex-col gap-3 md:gap-4 px-3 sm:px-4">
        {/* Brand header */}
        <div
          className={`flex w-full items-center overflow-hidden rounded-2xl transition-all duration-300 ${
            expanded ? "justify-start gap-2.5 px-2 py-2" : "justify-center px-0 py-1.5"
          }`}
          style={{
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.035)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 10px 24px rgba(0,0,0,0.24)",
          }}
        >
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-sm font-semibold text-white/88"
            style={{ background: "rgba(255,255,255,0.08)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.14)" }}
          >
            <Sparkles className="w-4 h-4" />
          </div>
          <div className={`min-w-0 transition-all duration-300 ${
            expanded ? "max-w-[180px] translate-x-0 opacity-100" : "pointer-events-none max-w-0 -translate-x-1 opacity-0"
          }`}>
            <div className="truncate text-sm font-semibold text-white/86 tracking-[0.08em] uppercase">Nexo</div>
          </div>
        </div>

        {/* Nav buttons */}
        <div className={`flex w-full flex-col items-center ${expanded ? "gap-2 pt-0.5" : "gap-3 pt-0.5"}`}>
          {topItems.map((item) => (
            <RailButton
              key={item.key}
              icon={item.icon}
              label={item.label}
              expanded={expanded}
              onClick={() => {
                if (item.key === "menu") {
                  onToggle();
                } else if (item.key === "new") {
                  onNew();
                } else if (item.key === "search") {
                  if (!expanded) onToggle();
                  setTimeout(() => searchInputRef.current?.focus(), 300);
                }
              }}
            />
          ))}
        </div>

        {/* Search */}
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="flex flex-col gap-2"
          >
            <div
              className="flex h-11 w-full items-center gap-2 rounded-2xl px-3"
              style={{
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.05)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 10px 24px rgba(0,0,0,0.24)",
              }}
            >
              <Search className="h-4 w-4 shrink-0 text-white/62" />
              <input
                ref={searchInputRef}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Pesquisar chats..."
                className="h-full min-w-0 flex-1 bg-transparent text-sm text-white/88 outline-none placeholder:text-white/45"
              />
            </div>
          </motion.div>
        )}

        {/* Chats list */}
        {expanded && (
          <div className="flex min-h-0 flex-1 flex-col px-0.5">
            <div className="shrink-0 px-1">
              <div className="text-[10px] uppercase tracking-wider text-white/45">
                Chats salvos
              </div>
            </div>
            <div className="mt-2 min-h-0 flex-1 overflow-y-auto space-y-1.5 pr-1 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.24)_rgba(0,0,0,0.45)]">
              {filteredChats.length === 0 ? (
                <div
                  className="h-11 rounded-2xl px-3 text-xs text-white/55 flex items-center"
                  style={{ background: "rgba(255,255,255,0.035)", boxShadow: "0 8px 20px rgba(0,0,0,0.24)" }}
                >
                  {conversations.length === 0 ? "Nenhum chat ainda" : "Nenhum chat encontrado"}
                </div>
              ) : (
                filteredChats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => onSelect(chat.id)}
                    className={`group relative flex h-11 items-center overflow-hidden rounded-2xl cursor-pointer
                      transition-all duration-300 ease-out
                      ${activeId === chat.id
                        ? "bg-white/[0.09] shadow-[0_12px_30px_rgba(0,0,0,0.40)]"
                        : "bg-white/[0.035] hover:bg-white/[0.06] hover:shadow-[0_10px_26px_rgba(0,0,0,0.28)]"
                      }`}
                  >
                    <span className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.04] to-transparent" />
                    <div className="flex items-center gap-2.5 px-3 min-w-0 flex-1">
                      <MessageSquare className="w-3.5 h-3.5 shrink-0 text-white/50" />
                      <span className="text-[13px] truncate text-white/80">{chat.title}</span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDelete(chat.id); }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity pr-3"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-white/40 hover:text-white/80" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Bottom nav */}
        <div className={`mt-auto flex flex-col ${expanded ? "gap-1.5" : "gap-2 items-center"}`}>
          <RailButton
            icon={Puzzle}
            label="Integrações"
            expanded={expanded}
            onClick={() => navigate("/integrations")}
          />
          <RailButton
            icon={Settings}
            label="Configurações"
            expanded={expanded}
            onClick={() => navigate("/settings")}
          />
        </div>
      </div>
    </aside>
  );
};
