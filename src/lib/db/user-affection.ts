import { getPool } from "@/lib/db/pool";

export type AffectionLevel =
  | "distant"     // 0-30   疏离期
  | "tentative"   // 31-55  试探期
  | "warm"        // 56-75  温暖期（初始值）
  | "intimate"    // 76-90  亲密期
  | "infatuated"; // 91-100 热恋期

export interface AffectionState {
  score: number;
  level: AffectionLevel;
}

export function getAffectionLevel(score: number): AffectionLevel {
  if (score <= 30) return "distant";
  if (score <= 55) return "tentative";
  if (score <= 75) return "warm";
  if (score <= 90) return "intimate";
  return "infatuated";
}

export async function getAffectionScore({
  userId,
  boyfriendId,
}: {
  userId: string;
  boyfriendId: string;
}): Promise<AffectionState> {
  const db = getPool();
  if (!db) return { score: 60, level: "warm" };

  try {
    const result = await db.query<{ score: number }>(
      `SELECT score FROM user_affection WHERE user_id = $1 AND boyfriend_id = $2`,
      [userId, boyfriendId],
    );
    const score = result.rows[0]?.score ?? 60;
    return { score, level: getAffectionLevel(score) };
  } catch {
    return { score: 60, level: "warm" };
  }
}

export async function updateAffectionScore({
  userId,
  boyfriendId,
  delta,
}: {
  userId: string;
  boyfriendId: string;
  delta: number;
}): Promise<AffectionState> {
  const db = getPool();
  if (!db) return { score: 60, level: "warm" };

  try {
    // 新用户从 60 开始，叠加本次 delta；老用户直接叠加
    const result = await db.query<{ score: number }>(
      `INSERT INTO user_affection (user_id, boyfriend_id, score)
       VALUES ($1, $2, GREATEST(0, LEAST(100, 60 + $3)))
       ON CONFLICT (user_id, boyfriend_id)
       DO UPDATE SET
         score = GREATEST(0, LEAST(100, user_affection.score + $3)),
         updated_at = NOW()
       RETURNING score`,
      [userId, boyfriendId, delta],
    );
    const score = result.rows[0]?.score ?? 60;
    return { score, level: getAffectionLevel(score) };
  } catch {
    return { score: 60, level: "warm" };
  }
}
