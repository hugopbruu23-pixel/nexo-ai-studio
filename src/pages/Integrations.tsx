import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Search, Check, ExternalLink, Puzzle, Zap, Globe, Database, Mail, CreditCard, Bot, Cloud, MessageSquare, BarChart } from "lucide-react";
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
  { id: "supabase_int", name: "Supabase", description: "Banco de dados, auth e storage", icon: Database, category: "Backend", url: "https://supabase.com", connected: false },
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
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-2"
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
            Integrações
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-sm mb-6 ml-12"
          style={{ color: "rgba(255,255,255,0.55)" }}
        >
          Conecte serviços externos para turbinar o Nexo AI.{" "}
          {connectedCount > 0 && (
            <span className="font-medium" style={{ color: "rgba(255,255,255,0.9)" }}>
              {connectedCount} ativa{connectedCount > 1 ? "s" : ""}
            </span>
          )}
        </motion.p>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="relative mb-6"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgba(255,255,255,0.4)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar integrações... (ex: GitHub, Stripe, Notion)"
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-sm outline-none"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.9)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 10px 24px rgba(0,0,0,0.24)",
            }}
          />
        </motion.div>

        {/* Integration grid by category */}
        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category}>
              <h2 className="text-[10px] uppercase tracking-[0.16em] mb-3" style={{ color: "rgba(255,255,255,0.45)" }}>
                {category}
              </h2>
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
                        className="flex items-center gap-4 p-4 rounded-2xl transition-all"
                        style={{
                          background: integration.connected
                            ? "rgba(50,200,100,0.04)"
                            : "linear-gradient(180deg, rgba(255,255,255,0.022) 0%, rgba(255,255,255,0.014) 100%), rgba(255,255,255,0.02)",
                          border: integration.connected
                            ? "1px solid rgba(50,200,100,0.2)"
                            : "1px solid rgba(255,255,255,0.075)",
                          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 14px 30px rgba(0,0,0,0.35)",
                        }}
                      >
                        <div
                          className="w-10 h-10 rounded-xl grid place-items-center shrink-0"
                          style={{
                            background: integration.connected ? "rgba(50,200,100,0.12)" : "rgba(255,255,255,0.06)",
                            border: "1px solid " + (integration.connected ? "rgba(50,200,100,0.2)" : "rgba(255,255,255,0.08)"),
                          }}
                        >
                          <integration.icon
                            className="w-5 h-5"
                            style={{ color: integration.connected ? "rgba(50,200,100,0.9)" : "rgba(255,255,255,0.5)" }}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.9)" }}>
                              {integration.name}
                            </h3>
                            {integration.connected && (
                              <span
                                className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full"
                                style={{
                                  color: "rgba(50,200,100,0.9)",
                                  background: "rgba(50,200,100,0.1)",
                                  border: "1px solid rgba(50,200,100,0.15)",
                                }}
                              >
                                <Check className="w-2.5 h-2.5" /> Ativa
                              </span>
                            )}
                          </div>
                          <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.5)" }}>
                            {integration.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            className="grid h-8 w-8 place-items-center rounded-lg text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition"
                            onClick={() => window.open(integration.url, "_blank")}
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => toggleIntegration(integration.id)}
                            className="px-3 py-1.5 rounded-xl text-xs font-medium transition"
                            style={
                              integration.connected
                                ? {
                                    background: "transparent",
                                    border: "1px solid rgba(255,255,255,0.14)",
                                    color: "rgba(255,255,255,0.7)",
                                  }
                                : {
                                    background: "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.8))",
                                    color: "#000",
                                    border: "none",
                                    boxShadow: "0 0 10px rgba(255,255,255,0.15)",
                                  }
                            }
                          >
                            {integration.connected ? "Desconectar" : "Conectar"}
                          </button>
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
            <Puzzle className="w-12 h-12 mx-auto mb-3" style={{ color: "rgba(255,255,255,0.15)" }} />
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
              Nenhuma integração encontrada para "{search}"
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Integrations;
