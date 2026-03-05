import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Search, Check, ExternalLink, Puzzle, Zap, Globe, Database, Mail, CreditCard, Bot, Cloud, MessageSquare, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: string;
  url: string;
  connected: boolean;
}

const allIntegrations: Integration[] = [
  { id: "google", name: "Google Search", description: "Pesquisa web em tempo real para respostas atualizadas", icon: Globe, category: "Busca", url: "https://google.com", connected: false },
  { id: "github", name: "GitHub", description: "Acesso a repositórios, código e documentação", icon: Database, category: "Desenvolvimento", url: "https://github.com", connected: false },
  { id: "slack", name: "Slack", description: "Envie mensagens e interaja com workspaces", icon: MessageSquare, category: "Comunicação", url: "https://slack.com", connected: false },
  { id: "stripe", name: "Stripe", description: "Processamento de pagamentos e assinaturas", icon: CreditCard, category: "Pagamentos", url: "https://stripe.com", connected: false },
  { id: "openai", name: "OpenAI API", description: "Modelos GPT adicionais e embeddings", icon: Bot, category: "IA", url: "https://openai.com", connected: false },
  { id: "aws", name: "AWS S3", description: "Armazenamento de arquivos na nuvem", icon: Cloud, category: "Cloud", url: "https://aws.amazon.com", connected: false },
  { id: "sendgrid", name: "SendGrid", description: "Envio de emails transacionais e marketing", icon: Mail, category: "Email", url: "https://sendgrid.com", connected: false },
  { id: "analytics", name: "Google Analytics", description: "Análise de uso e métricas detalhadas", icon: BarChart, category: "Analytics", url: "https://analytics.google.com", connected: false },
  { id: "notion", name: "Notion", description: "Acesse páginas e bancos de dados do Notion", icon: Database, category: "Produtividade", url: "https://notion.so", connected: false },
  { id: "vercel", name: "Vercel", description: "Deploy automático de projetos web", icon: Zap, category: "Deploy", url: "https://vercel.com", connected: false },
  { id: "figma", name: "Figma", description: "Acesse designs e protótipos", icon: Puzzle, category: "Design", url: "https://figma.com", connected: false },
  { id: "supabase", name: "Supabase", description: "Banco de dados, auth e storage", icon: Database, category: "Backend", url: "https://supabase.com", connected: false },
];

const Integrations = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [integrations, setIntegrations] = useState(allIntegrations);

  const filtered = integrations.filter(
    (i) =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.description.toLowerCase().includes(search.toLowerCase()) ||
      i.category.toLowerCase().includes(search.toLowerCase())
  );

  const categories = [...new Set(filtered.map((i) => i.category))];

  const toggleIntegration = (id: string) => {
    setIntegrations((prev) =>
      prev.map((i) => {
        if (i.id === id) {
          const newState = !i.connected;
          if (newState) {
            toast.success(`${i.name} integrado com sucesso! A IA agora pode usar esta integração.`);
          } else {
            toast.info(`${i.name} desconectado.`);
          }
          return { ...i, connected: newState };
        }
        return i;
      })
    );
  };

  const connectedCount = integrations.filter((i) => i.connected).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-2"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-bold text-foreground tracking-tight">Integrações</h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-sm text-muted-foreground mb-6 ml-11"
        >
          Conecte serviços externos para turbinar o Nexo AI. {connectedCount > 0 && (
            <span className="text-foreground font-medium">{connectedCount} ativa{connectedCount > 1 ? "s" : ""}</span>
          )}
        </motion.p>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="relative mb-6"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar integrações... (ex: GitHub, Stripe, Notion)"
            className="pl-10 bg-secondary border-border"
          />
        </motion.div>

        {/* Integration grid by category */}
        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category}>
              <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">{category}</h2>
              <div className="grid gap-3">
                <AnimatePresence>
                  {filtered
                    .filter((i) => i.category === category)
                    .map((integration, idx) => (
                      <motion.div
                        key={integration.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: idx * 0.03 }}
                        className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${
                          integration.connected
                            ? "border-nexo-success/30 bg-nexo-success/5"
                            : "border-border bg-card hover:bg-accent/50"
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                          integration.connected ? "bg-nexo-success/20" : "bg-secondary"
                        }`}>
                          <integration.icon className={`w-5 h-5 ${
                            integration.connected ? "text-nexo-success" : "text-muted-foreground"
                          }`} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-medium text-foreground">{integration.name}</h3>
                            {integration.connected && (
                              <span className="flex items-center gap-1 text-[10px] text-nexo-success bg-nexo-success/10 px-1.5 py-0.5 rounded-full">
                                <Check className="w-2.5 h-2.5" /> Ativa
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{integration.description}</p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                            onClick={() => window.open(integration.url, "_blank")}
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant={integration.connected ? "outline" : "default"}
                            size="sm"
                            className="text-xs h-8"
                            onClick={() => toggleIntegration(integration.id)}
                          >
                            {integration.connected ? "Desconectar" : "Conectar"}
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Puzzle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Nenhuma integração encontrada para "{search}"</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Integrations;
