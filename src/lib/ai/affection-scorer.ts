const DEEPSEEK_MESSAGES_URL = "https://direct.evolink.ai/v1/messages";
const DEEPSEEK_MODEL = "deepseek-v4-flash";

type DeepSeekResponse = {
  content?: Array<{ type: string; text?: string; [key: string]: unknown }>;
};

function extractText(response: DeepSeekResponse): string {
  return (
    response.content
      ?.filter((b) => b.type === "text" && typeof b.text === "string")
      .map((b) => b.text as string)
      .join("")
      .trim() ?? ""
  );
}

function parseDelta(text: string): number {
  try {
    const json = JSON.parse(text.trim()) as unknown;
    if (typeof json === "object" && json !== null && "delta" in json) {
      const raw = (json as { delta: unknown }).delta;
      const n = typeof raw === "number" ? raw : Number(raw);
      if (Number.isFinite(n)) return Math.max(-10, Math.min(10, Math.round(n)));
    }
  } catch {
    // 解析失败时不更新
  }
  return 0;
}

function buildScorerPrompt({
  userMessage,
  assistantText,
}: {
  userMessage: string;
  assistantText: string;
}): string {
  return [
    "你是一个情感分析器。任务：判断本轮用户消息对男友好感度的影响程度。",
    "只输出严格 JSON，格式：{\"delta\": N}，N 为 -10 到 +10 的整数。不要输出任何其他内容。",
    "",
    "评分标准：",
    "+8 到 +10：用户表达了强烈的依赖、爱意、信任，或分享了非常私密的事情",
    "+4 到 +7：用户态度温柔、感谢、撒娇、主动关心男友",
    "+1 到 +3：普通友好聊天，中性积极",
    "0：非常短的闲聊或纯粹信息性的对话",
    "-1 到 -3：用户有些冷淡或心不在焉",
    "-4 到 -7：用户态度明显不耐烦、忽视、敷衍",
    "-8 到 -10：用户明确表达拒绝、批评或非常冷漠",
    "",
    `用户消息：${userMessage}`,
    "",
    `男友回复（仅供上下文）：${assistantText || "无"}`,
  ].join("\n");
}

export async function scoreAffectionDelta({
  userMessage,
  assistantText,
}: {
  userMessage: string;
  assistantText: string;
}): Promise<number> {
  if (!userMessage.trim()) return 0;

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) return 1; // 无 key 时每次聊天小幅正向积累

  try {
    const response = await fetch(DEEPSEEK_MESSAGES_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: DEEPSEEK_MODEL,
        max_tokens: 32,
        messages: [
          {
            role: "user",
            content: buildScorerPrompt({ userMessage, assistantText }),
          },
        ],
      }),
    });

    if (!response.ok) return 1;

    const data = (await response.json()) as DeepSeekResponse;
    return parseDelta(extractText(data));
  } catch {
    return 1;
  }
}
