import { motion } from "framer-motion";
import { ArrowLeft, User, Bell, Palette, Shield, Globe, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

const Settings = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: "Usuário Nexo",
    email: "usuario@nexo.ai",
    bio: "Usando Nexo AI para criar coisas incríveis.",
  });
  const [notifications, setNotifications] = useState(true);
  const [darkMode] = useState(true);
  const [language, setLanguage] = useState("pt-BR");

  const handleSave = () => {
    toast.success("Configurações salvas com sucesso!");
  };

  const inputStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: "8px 12px",
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    outline: "none",
    width: "100%",
    transition: "border-color 160ms ease",
  };

  const sections = [
    {
      icon: User,
      title: "Perfil",
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl grid place-items-center"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <User className="w-8 h-8 text-white/50" />
            </div>
            <button
              className="px-3 py-1.5 rounded-xl text-xs font-medium text-white/70 transition hover:text-white/90 hover:bg-white/[0.06]"
              style={{ border: "1px solid rgba(255,255,255,0.1)" }}
            >
              Alterar foto
            </button>
          </div>
          <div>
            <label className="text-[11px] text-white/45 uppercase tracking-wider mb-1 block">Nome</label>
            <input
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              style={inputStyle}
            />
          </div>
          <div>
            <label className="text-[11px] text-white/45 uppercase tracking-wider mb-1 block">Email</label>
            <input
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              style={inputStyle}
            />
          </div>
          <div>
            <label className="text-[11px] text-white/45 uppercase tracking-wider mb-1 block">Bio</label>
            <input
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              style={inputStyle}
            />
          </div>
        </div>
      ),
    },
    {
      icon: Bell,
      title: "Notificações",
      content: (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/90">Ativar notificações</p>
            <p className="text-xs text-white/50">Receba alertas sobre atualizações</p>
          </div>
          <Switch checked={notifications} onCheckedChange={setNotifications} />
        </div>
      ),
    },
    {
      icon: Palette,
      title: "Aparência",
      content: (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/90">Modo escuro</p>
            <p className="text-xs text-white/50">Sempre ativo por padrão</p>
          </div>
          <Switch checked={darkMode} disabled />
        </div>
      ),
    },
    {
      icon: Globe,
      title: "Idioma",
      content: (
        <div>
          <label className="text-[11px] text-white/45 uppercase tracking-wider mb-1 block">Idioma da interface</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{ ...inputStyle, cursor: "pointer" }}
          >
            <option value="pt-BR">Português (Brasil)</option>
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </div>
      ),
    },
    {
      icon: Shield,
      title: "Privacidade & Segurança",
      content: (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/90">Histórico de conversas</p>
              <p className="text-xs text-white/50">Salvar conversas localmente</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/90">Compartilhar dados de uso</p>
              <p className="text-xs text-white/50">Ajude a melhorar o Nexo AI</p>
            </div>
            <Switch />
          </div>
        </div>
      ),
    },
    {
      icon: Sparkles,
      title: "Sobre o Nexo AI",
      content: (
        <div className="space-y-2">
          <p className="text-sm text-white/90">Nexo AI v2.0</p>
          <p className="text-xs text-white/50">
            Plataforma de IA avançada com capacidades de chat, geração de imagens, código, vídeo e áudio.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-8"
        >
          <button
            onClick={() => navigate("/")}
            className="grid h-9 w-9 place-items-center rounded-xl text-white/50 hover:text-white/80 hover:bg-white/[0.06] transition"
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1
            className="text-xl font-bold tracking-[0.08em] uppercase"
            style={{ color: "rgba(255,255,255,0.95)" }}
          >
            Configurações
          </h1>
        </motion.div>

        {/* Sections */}
        <div className="space-y-4">
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl p-5 nexo-panel"
            >
              <div className="flex items-center gap-2 mb-4">
                <section.icon className="w-4 h-4 text-white/50" />
                <h2 className="text-sm font-semibold text-white/86">{section.title}</h2>
              </div>
              {section.content}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <button
            onClick={handleSave}
            className="w-full py-2.5 rounded-2xl text-sm font-semibold transition"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.8))",
              color: "#000",
              boxShadow: "0 0 14px rgba(255,255,255,0.2)",
            }}
          >
            Salvar Configurações
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
