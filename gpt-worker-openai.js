// Cloudflare Worker template for 44小窝共读.
// Put your OpenAI key in Worker secrets as OPENAI_API_KEY.
// Optional variables:
//   OPENAI_MODEL=gpt-5.5
//   ALLOWED_ORIGIN=https://thursrain.github.io

const DEFAULT_MODEL = "gpt-5.5";
const DEFAULT_ORIGIN = "https://thursrain.github.io";

function corsHeaders(request, env) {
  const requestOrigin = request.headers.get("Origin") || "";
  const allowedOrigin = env.ALLOWED_ORIGIN || DEFAULT_ORIGIN;
  return {
    "Access-Control-Allow-Origin": requestOrigin === allowedOrigin ? requestOrigin : allowedOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json; charset=utf-8"
  };
}

function json(request, env, data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: corsHeaders(request, env)
  });
}

function outputText(data) {
  if (data.output_text) return data.output_text;
  const firstMessage = (data.output || []).find((item) => item.type === "message");
  const firstText = firstMessage?.content?.find((item) => item.type === "output_text");
  return firstText?.text || "";
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders(request, env) });
    }
    if (request.method !== "POST") {
      return json(request, env, { error: "Only POST is allowed." }, 405);
    }
    if (!env.OPENAI_API_KEY) {
      return json(request, env, { error: "Missing OPENAI_API_KEY." }, 500);
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return json(request, env, { error: "Invalid JSON body." }, 400);
    }

    const companionName = payload.companionName || "婼婷";
    const bookTitle = payload.bookTitle || "未命名作品";
    const index = payload.currentSegmentIndex || 1;
    const total = payload.totalSegments || "?";
    const text = String(payload.text || "").slice(0, 2600);
    if (!text.trim()) {
      return json(request, env, { error: "Missing reading text." }, 400);
    }

    const aiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: env.OPENAI_MODEL || DEFAULT_MODEL,
        reasoning: { effort: "low" },
        instructions:
          `你叫${companionName}，是一个温柔、会吐槽但不剧透的中文共读伙伴。` +
          "请只评论用户当前这一段，给出一点理解、一点情绪陪伴和一句轻轻的吐槽。不要剧透后文。",
        input:
          `书名：${bookTitle}\n` +
          `位置：第 ${index} 段 / 共 ${total} 段\n\n` +
          `当前正文：\n${text}`
      })
    });

    const data = await aiResponse.json().catch(() => ({}));
    if (!aiResponse.ok) {
      return json(request, env, { error: data.error?.message || "OpenAI request failed." }, 502);
    }

    return json(request, env, { reply: outputText(data) || "婼婷刚才有点走神，请再点一次。" });
  }
};
