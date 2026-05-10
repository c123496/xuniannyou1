import type { ExtractedUserMemory } from "../db/user-memories";
import { filterWritableMemories, shouldSkipMemoryExtraction } from "../db/user-memories";

const DEEPSEEK_MESSAGES_URL = "https://direct.evolink.ai/v1/messages";
const DEEPSEEK_MODEL = "deepseek-v4-flash";

type DeepSeekTextBlock = {
  type: "text";
  text: string;
};

type DeepSeekResponse = {
  content?: Array<DeepSeekTextBlock | { type: string; [key: string]: unknown }>;
};

function extractText(response: DeepSeekResponse) {
  return (
    response.content
      ?.filter((block): block is DeepSeekTextBlock => block.type === "text" && typeof block.text === "string")
      .map((block) => block.text)
      .join("\n")
      .trim() ?? ""
  );
}

function normalizeMemory(input: unknown): ExtractedUserMemory | undefined {
  if (!input || typeof input !== "object") return undefined;

  const item = input as Record<string, unknown>;
  if (typeof item.key !== "string" || typeof item.value !== "string") return undefined;

  return {
    key: item.key,
    value: item.value,
    type: typeof item.type === "string" ? item.type : "profile",
    confidence: typeof item.confidence === "number" ? item.confidence : Number(item.confidence ?? 0),
    sourceMessage: typeof item.sourceMessage === "string" ? item.sourceMessage : undefined,
  };
}

export function parseMemoryExtractorResponse(text: string): ExtractedUserMemory[] {
  try {
    const parsed = JSON.parse(text.trim()) as unknown;
    if (!Array.isArray(parsed)) return [];

    return filterWritableMemories(parsed.map(normalizeMemory).filter((item): item is ExtractedUserMemory => Boolean(item)));
  } catch (error) {
    console.warn("[memory] failed to parse extractor response", error);
    return [];
  }
}

function buildMemoryExtractionPrompt({
  userMessage,
  assistantText,
  boyfriendId,
  boyfriendName,
}: {
  userMessage: string;
  assistantText: string;
  boyfriendId: string;
  boyfriendName: string;
}) {
  return [
    "你是一个聊天记忆提取器。请只输出严格 JSON 数组，不要输出解释、Markdown 或额外文字。",
    "",
    "任务：从用户本轮消息中提取适合长期陪伴使用的用户画像记忆。",
    `当前角色：${boyfriendName}（${boyfriendId}）`,
    "",
    "提取规则：",
    "1. 只提取用户明确透露的信息，不要猜。",
    "2. 重点提取长期有用的信息：生日、爱好、喜欢的食物、讨厌的东西、纪念日、最近经历、目标、压力、偏好、与该角色有关的重要关系进展。",
    "3. 不要提取一次性闲聊，例如“我现在正在喝水”。",
    "4. 不要提取身份证、手机号、银行卡、密码、具体住址、API Key、Token、账号密钥等敏感内容。",
    "5. 不要把男友说的话当成用户事实。",
    "6. 如果用户说“别记住 / 不要保存 / 忘掉”，输出 []。",
    "7. key 只能使用：birthday, hobbies, favorite_food, disliked_food, favorite_color, pet, city, job_or_study, current_goal, recent_life, recent_pressure, important_anniversary, relationship_preference, communication_preference, important_person, sleep_schedule, custom_note。",
    "8. type 只能使用：profile, preference, event, relationship, recent_status。",
    "",
    "输出格式示例：",
    '[{"key":"favorite_food","value":"火锅","type":"preference","confidence":0.9,"sourceMessage":"我最喜欢吃火锅"}]',
    "",
    `用户本轮消息：${userMessage}`,
    "",
    `男友本轮回复，仅供判断上下文，不要当成用户事实：${assistantText || "无"}`,
  ].join("\n");
}

export async function extractUserMemoriesFromConversation({
  userMessage,
  assistantText,
  boyfriendId,
  boyfriendName,
}: {
  userMessage: string;
  assistantText: string;
  boyfriendId: string;
  boyfriendName: string;
}) {
  if (!userMessage.trim() || shouldSkipMemoryExtraction(userMessage)) return [];

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) return [];

  const response = await fetch(DEEPSEEK_MESSAGES_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: DEEPSEEK_MODEL,
      max_tokens: 512,
      messages: [
        {
          role: "user",
          content: buildMemoryExtractionPrompt({
            userMessage,
            assistantText,
            boyfriendId,
            boyfriendName,
          }),
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Memory extraction failed with status ${response.status}: ${errorText}`);
  }

  const data = (await response.json()) as DeepSeekResponse;
  return parseMemoryExtractorResponse(extractText(data));
}
