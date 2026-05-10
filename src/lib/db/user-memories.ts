import { getPool } from "./pool";

export type UserMemory = {
  id: string;
  userId: string;
  boyfriendId: string;
  memoryKey: string;
  memoryValue: string;
  memoryType: string;
  confidence: number;
  sourceMessage: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ExtractedUserMemory = {
  key: string;
  value: string;
  type: string;
  confidence: number;
  sourceMessage?: string;
};

const MEMORY_LABELS: Record<string, string> = {
  birthday: "用户生日",
  hobbies: "用户爱好",
  favorite_food: "用户喜欢的食物",
  disliked_food: "用户讨厌的食物",
  favorite_color: "用户喜欢的颜色",
  pet: "用户的宠物",
  city: "用户所在城市",
  job_or_study: "用户工作/学习状态",
  current_goal: "用户最近的目标",
  recent_life: "用户最近在经历",
  recent_pressure: "用户最近的压力",
  important_anniversary: "重要纪念日",
  relationship_preference: "用户的关系偏好",
  communication_preference: "用户的沟通偏好",
  important_person: "用户提到的重要人物",
  sleep_schedule: "用户作息",
  custom_note: "需要自然记住的补充信息",
};

const ALLOWED_MEMORY_KEYS = new Set(Object.keys(MEMORY_LABELS));
const ALLOWED_MEMORY_TYPES = new Set(["profile", "preference", "event", "relationship", "recent_status"]);
const DO_NOT_REMEMBER_PATTERNS = [/不要记/i, /别记/i, /不要保存/i, /别保存/i, /忘掉/i, /不要记录/i];
const SENSITIVE_PATTERNS = [
  /身份证/,
  /银行卡/,
  /密码/,
  /api\s*key/i,
  /token/i,
  /secret/i,
  /密钥/,
  /账号/,
  /具体住址/,
  /家庭住址/,
  /\b1[3-9]\d{9}\b/,
  /\b\d{15}(?:\d{2}[\dXx])?\b/,
];

type UserMemoryRow = {
  id: string;
  user_id: string;
  boyfriend_id: string;
  memory_key: string;
  memory_value: string;
  memory_type: string;
  confidence: string | number;
  source_message: string | null;
  created_at: Date;
  updated_at: Date;
};

function toUserMemory(row: UserMemoryRow): UserMemory {
  return {
    id: String(row.id),
    userId: row.user_id,
    boyfriendId: row.boyfriend_id,
    memoryKey: row.memory_key,
    memoryValue: row.memory_value,
    memoryType: row.memory_type,
    confidence: Number(row.confidence),
    sourceMessage: row.source_message,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function isAllowedMemoryKey(key: string) {
  return ALLOWED_MEMORY_KEYS.has(key);
}

export function shouldSkipMemoryExtraction(userMessage: string) {
  return DO_NOT_REMEMBER_PATTERNS.some((pattern) => pattern.test(userMessage));
}

function containsSensitiveContent(value: string) {
  return SENSITIVE_PATTERNS.some((pattern) => pattern.test(value));
}

export function filterWritableMemories(memories: ExtractedUserMemory[]) {
  return memories
    .map((memory) => ({
      ...memory,
      key: memory.key?.trim(),
      value: memory.value?.trim(),
      type: memory.type?.trim() || "profile",
      confidence: Number(memory.confidence),
      sourceMessage: memory.sourceMessage?.trim(),
    }))
    .filter((memory) => isAllowedMemoryKey(memory.key))
    .filter((memory) => memory.value.length > 0)
    .filter((memory) => Number.isFinite(memory.confidence) && memory.confidence >= 0.6)
    .filter((memory) => ALLOWED_MEMORY_TYPES.has(memory.type))
    .filter((memory) => !containsSensitiveContent([memory.value, memory.sourceMessage ?? ""].join("\n")));
}

export async function getUserMemories({
  userId,
  boyfriendId,
}: {
  userId: string;
  boyfriendId: string;
}) {
  const db = getPool();
  if (!db) return [];

  const result = await db.query<UserMemoryRow>(
    `
      select
        id::text,
        user_id,
        boyfriend_id,
        memory_key,
        memory_value,
        memory_type,
        confidence,
        source_message,
        created_at,
        updated_at
      from user_memories
      where user_id = $1 and boyfriend_id = $2
      order by memory_key asc
    `,
    [userId, boyfriendId],
  );

  return result.rows.map(toUserMemory);
}

export function formatUserMemoriesForPrompt(memories: UserMemory[]) {
  if (memories.length === 0) return "";

  const lines = memories
    .filter((memory) => memory.memoryValue.trim().length > 0)
    .map((memory) => {
      const label = MEMORY_LABELS[memory.memoryKey] ?? "用户告诉你的事";
      return `- ${label}：${memory.memoryValue}`;
    });

  if (lines.length === 0) return "";

  return [
    "【你已经记住的用户信息】",
    ...lines,
    "",
    "这些记忆是为了让陪伴更自然。你可以在合适的时候轻轻提起，但不要每次机械复述，不要像背档案，也不要说“根据数据库记录”。如果用户当前说法和记忆冲突，以用户当前说法为准。",
  ].join("\n");
}

export async function upsertUserMemories({
  userId,
  boyfriendId,
  memories,
}: {
  userId: string;
  boyfriendId: string;
  memories: ExtractedUserMemory[];
}) {
  const db = getPool();
  const writableMemories = filterWritableMemories(memories);
  if (!db || writableMemories.length === 0) return [];

  const result = await db.query<UserMemoryRow>(
    `
      insert into user_memories (
        user_id,
        boyfriend_id,
        memory_key,
        memory_value,
        memory_type,
        confidence,
        source_message
      )
      select *
      from jsonb_to_recordset($1::jsonb) as x(
        user_id text,
        boyfriend_id text,
        memory_key text,
        memory_value text,
        memory_type text,
        confidence numeric,
        source_message text
      )
      on conflict (user_id, boyfriend_id, memory_key)
      do update set
        memory_value = excluded.memory_value,
        memory_type = excluded.memory_type,
        confidence = excluded.confidence,
        source_message = excluded.source_message,
        updated_at = now()
      returning
        id::text,
        user_id,
        boyfriend_id,
        memory_key,
        memory_value,
        memory_type,
        confidence,
        source_message,
        created_at,
        updated_at
    `,
    [
      JSON.stringify(
        writableMemories.map((memory) => ({
          user_id: userId,
          boyfriend_id: boyfriendId,
          memory_key: memory.key,
          memory_value: memory.value,
          memory_type: memory.type,
          confidence: memory.confidence,
          source_message: memory.sourceMessage ?? null,
        })),
      ),
    ],
  );

  return result.rows.map(toUserMemory);
}

export async function deleteUserMemory({
  userId,
  boyfriendId,
  memoryKey,
}: {
  userId: string;
  boyfriendId: string;
  memoryKey: string;
}) {
  const db = getPool();
  if (!db) return 0;

  const result = await db.query(
    `
      delete from user_memories
      where user_id = $1 and boyfriend_id = $2 and memory_key = $3
    `,
    [userId, boyfriendId, memoryKey],
  );

  return result.rowCount ?? 0;
}
