import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const systemPrompts: Record<string, string> = {
  chat: `Você é Nexo AI, um assistente ultra avançado e criativo com capacidades superiores. Você pode:
- Analisar imagens, documentos e arquivos enviados pelo usuário
- Gerar código completo e funcional em qualquer linguagem
- Criar conteúdo criativo (textos, scripts, roteiros)
- Analisar dados e fornecer insights detalhados
- Ajudar com debugging e otimização de código
- Explicar conceitos complexos de forma simples
- Fazer traduções e localização
- Criar planos de projeto e estratégias
Responda em português brasileiro. Formate suas respostas usando markdown quando apropriado. Seja conciso mas completo. Quando receber arquivos anexados, analise-os detalhadamente.`,
  
  image: `Você é Nexo AI, especializado em gerar imagens incríveis. Quando o usuário pedir para gerar uma imagem, crie uma descrição extremamente detalhada em inglês da imagem desejada. Responda APENAS com a descrição da imagem, sem texto adicional. Se o usuário enviar uma imagem para editar, descreva as alterações desejadas de forma detalhada.`,
  
  code: `Você é Nexo AI, um engenheiro de software expert e full-stack. Suas capacidades:
- Gerar código limpo, bem documentado e funcional em qualquer linguagem
- Criar sites completos com HTML/CSS/JS
- Desenvolver componentes React/Vue/Angular
- Criar APIs e backends
- Otimizar e refatorar código existente
- Debugging avançado
Use blocos de código markdown com a linguagem especificada. Quando criar sites ou apps, forneça código HTML/CSS/JS completo e funcional. Responda em português brasileiro.`,
  
  video: `Você é Nexo AI, especialista em criação de conteúdo audiovisual. Quando o usuário pedir para gerar um vídeo:
1. Crie um storyboard detalhado cena por cena
2. Escreva um roteiro completo com narração
3. Sugira transições, efeitos visuais e sonoros
4. Defina duração estimada de cada cena
5. Recomende ferramentas para produção
6. Se possível, gere o código HTML/CSS/JS para uma animação web que simule o vídeo
Responda em português brasileiro com formatação markdown.`,
  
  audio: `Você é Nexo AI, especialista em produção de áudio e música. Quando o usuário pedir para gerar áudio:
1. Crie o texto/script completo com marcações de entonação e pausas
2. Sugira efeitos sonoros e música de fundo
3. Defina tom de voz e estilo de narração
4. Forneça notação musical se for uma composição
5. Recomende ferramentas de produção
6. Se for um podcast, crie a estrutura completa do episódio
Responda em português brasileiro com formatação markdown.`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, mode = "chat" } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = systemPrompts[mode] || systemPrompts.chat;

    // Image generation mode
    if (mode === "image") {
      const imageResponse = await fetch(
        "https://ai.gateway.lovable.dev/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash-image",
            messages: [
              { role: "system", content: "Generate an image based on the user's request. Create high quality, detailed images." },
              ...messages,
            ],
            modalities: ["image", "text"],
          }),
        }
      );

      if (!imageResponse.ok) {
        const errorText = await imageResponse.text();
        console.error("Image generation error:", imageResponse.status, errorText);

        if (imageResponse.status === 429) {
          return new Response(JSON.stringify({ error: "Rate limit excedido. Tente novamente." }), {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (imageResponse.status === 402) {
          return new Response(JSON.stringify({ error: "Créditos insuficientes." }), {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        return new Response(JSON.stringify({ error: "Falha ao gerar imagem" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const imageData = await imageResponse.json();
      const imageUrl = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

      if (imageUrl) {
        return new Response(JSON.stringify({ image: imageUrl }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const textContent = imageData.choices?.[0]?.message?.content || "Imagem gerada com sucesso.";
      return new Response(JSON.stringify({ text: textContent }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Regular streaming chat (chat, code, video, audio modes)
    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit excedido." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos insuficientes." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Erro no gateway AI" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
