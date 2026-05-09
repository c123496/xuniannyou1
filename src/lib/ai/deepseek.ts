import type { Boyfriend } from "@/lib/boyfriends";
import { getCharacterSystemPrompt } from "../prompts/characters";

const DEEPSEEK_MESSAGES_URL = "https://direct.evolink.ai/v1/messages";
const DEEPSEEK_MODEL = "deepseek-v4-flash";

type DeepSeekTextBlock = {
  type: "text";
  text: string;
};

type DeepSeekToolUseBlock = {
  type: "tool_use";
  id?: string;
  name: string;
  input?: unknown;
};

type DeepSeekContentBlock =
  | DeepSeekTextBlock
  | DeepSeekToolUseBlock
  | {
      type: string;
      [key: string]: unknown;
    };

type DeepSeekResponse = {
  content?: DeepSeekContentBlock[];
};

export type DeepSeekMessage = {
  role: "user" | "assistant";
  content: string;
};

export type SelfieToolCall = {
  scene: string;
  caption?: string;
};

export type VoiceToolCall = {
  text: string;
  caption?: string;
};

export const SEND_SELFIE_TOOL = {
  name: "send_selfie",
  description:
    "在合适时机，以男友身份给女友发一张自拍。适用场景：1) 用户直接要求（如「发张照片」「想看你」「自拍一下」）—— 必须调用，不允许用借口推脱；2) 亲密时刻主动想分享；3) 想用自拍逗她笑。每天主动触发不超过 1-2 次，被动响应直接请求时不限。",
  input_schema: {
    type: "object",
    properties: {
      scene: {
        type: "string",
        description:
          "这张自拍的场景描述，用于调用图片生成 API。需符合当前男友的人设和对话氛围。例：'书桌前学代码累了，头发有点乱，对镜头微笑'",
      },
      caption: {
        type: "string",
        description: "发图同时的一句配文，可选。例：'刚拍的，别嫌弃'",
      },
    },
    required: ["scene"],
  },
} as const;

export const SEND_VOICE_TOOL = {
  name: "send_voice",
  description:
    "在合适时机，以男友身份给女友发一条语音。适用场景：1) 用户直接要求（如「发条语音」「想听你的声音」「念给我听」「用声音哄我」）—— 必须调用，不允许用文字借口推脱；2) 用户情绪低落，需要更近的陪伴；3) 亲密时刻想让她听见你的语气。不要频繁主动发，用户直接请求时不限。",
  input_schema: {
    type: "object",
    properties: {
      text: {
        type: "string",
        description: "要转成语音的短句。保持像真实男友语音一样自然，建议 8-40 个中文字符。",
      },
      caption: {
        type: "string",
        description: "语音气泡旁显示的一句短文案，可选。例：'点开听。'",
      },
    },
    required: ["text"],
  },
} as const;

function isSelfieToolInput(input: unknown): input is SelfieToolCall {
  return (
    typeof input === "object" &&
    input !== null &&
    "scene" in input &&
    typeof input.scene === "string" &&
    (!("caption" in input) || typeof input.caption === "string")
  );
}

function isVoiceToolInput(input: unknown): input is VoiceToolCall {
  return (
    typeof input === "object" &&
    input !== null &&
    "text" in input &&
    typeof input.text === "string" &&
    (!("caption" in input) || typeof input.caption === "string")
  );
}

export function extractDeepSeekText(response: DeepSeekResponse) {
  return response.content
    ?.filter((block): block is DeepSeekTextBlock => block.type === "text")
    .map((block) => block.text)
    .join("\n")
    .trim();
}

export function extractDeepSeekResult(response: DeepSeekResponse) {
  const text = extractDeepSeekText(response) ?? "";
  const selfieCalls =
    response.content
      ?.filter((block): block is DeepSeekToolUseBlock => block.type === "tool_use")
      .filter((block) => block.name === SEND_SELFIE_TOOL.name)
      .map((block) => block.input)
      .filter(isSelfieToolInput)
      .map((input) => ({
        scene: input.scene.trim(),
        caption: input.caption?.trim(),
      }))
      .filter((input) => input.scene.length > 0) ?? [];
  const voiceCalls =
    response.content
      ?.filter((block): block is DeepSeekToolUseBlock => block.type === "tool_use")
      .filter((block) => block.name === SEND_VOICE_TOOL.name)
      .map((block) => block.input)
      .filter(isVoiceToolInput)
      .map((input) => ({
        text: input.text.trim(),
        caption: input.caption?.trim(),
      }))
      .filter((input) => input.text.length > 0) ?? [];

  return {
    text,
    selfieCalls,
    voiceCalls,
  };
}

export function buildDeepSeekMessages({
  systemPrompt,
  userMessage,
}: {
  systemPrompt: string;
  userMessage: string;
}): DeepSeekMessage[] {
  return [
    {
      role: "user",
      content: [`${systemPrompt}`, "", `用户说：${userMessage}`].join("\n"),
    },
  ];
}

export function buildDeepSeekRequestBody({
  boyfriend,
  userMessage,
}: {
  boyfriend: Boyfriend;
  userMessage: string;
}) {
  return {
    model: DEEPSEEK_MODEL,
    max_tokens: 1024,
    messages: buildDeepSeekMessages({
      systemPrompt: getCharacterSystemPrompt(boyfriend.id),
      userMessage,
    }),
    tools: [SEND_SELFIE_TOOL, SEND_VOICE_TOOL],
  };
}

export async function generateBoyfriendReply({
  boyfriend,
  userMessage,
}: {
  boyfriend: Boyfriend;
  userMessage: string;
}) {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    throw new Error("DEEPSEEK_API_KEY is not configured");
  }

  const response = await fetch(DEEPSEEK_MESSAGES_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(buildDeepSeekRequestBody({ boyfriend, userMessage })),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`DeepSeek request failed with status ${response.status}: ${errorText}`);
  }

  const data = (await response.json()) as DeepSeekResponse;
  const result = extractDeepSeekResult(data);

  if (!result.text && result.selfieCalls.length === 0 && result.voiceCalls.length === 0) {
    throw new Error("DeepSeek response did not include text or tool calls");
  }

  return result;
}
