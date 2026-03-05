import { motion } from "framer-motion";
import { ArrowLeft, User, Bell, Palette, Shield, Globe, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

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

  const sections = [
    {
      icon: User,
      title: "Perfil",
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-secondary border border-border flex items-center justify-center">
              <User className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <Button variant="outline" size="sm" className="text-xs">
                Alterar foto
              </Button>
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Nome</label>
            <Input
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="bg-secondary border-border"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Email</label>
            <Input
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="bg-secondary border-border"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Bio</label>
            <Input
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="bg-secondary border-border"
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
            <p className="text-sm text-foreground">Ativar notificações</p>
            <p className="text-xs text-muted-foreground">Receba alertas sobre atualizações</p>
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
            <p className="text-sm text-foreground">Modo escuro</p>
            <p className="text-xs text-muted-foreground">Sempre ativo por padrão</p>
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
          <label className="text-xs text-muted-foreground mb-1 block">Idioma da interface</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm text-foreground"
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
              <p className="text-sm text-foreground">Histórico de conversas</p>
              <p className="text-xs text-muted-foreground">Salvar conversas localmente</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground">Compartilhar dados de uso</p>
              <p className="text-xs text-muted-foreground">Ajude a melhorar o Nexo AI</p>
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
          <p className="text-sm text-foreground">Nexo AI v2.0</p>
          <p className="text-xs text-muted-foreground">
            Plataforma de IA avançada com capacidades de chat, geração de imagens, código, vídeo e áudio.
            Suporte a upload de arquivos e integrações externas.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-8"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-bold text-foreground tracking-tight">Configurações</h1>
        </motion.div>

        {/* Sections */}
        <div className="space-y-4">
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-border bg-card p-5"
            >
              <div className="flex items-center gap-2 mb-4">
                <section.icon className="w-4 h-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold text-foreground">{section.title}</h2>
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
          <Button onClick={handleSave} className="w-full">
            Salvar Configurações
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
