import { Resend } from "resend";

import { getBoyfriendById } from "@/lib/boyfriends";
import { getPool } from "@/lib/db/pool";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "纸片人男友 <dearmate@dearmate.mom>";
const SITE_URL = "https://www.dearmate.mom";
const DISCORD_URL = "https://discord.gg/h6xyDQuzT";

// 20 小时内活跃 → 不打扰；超过 7 天未回 → 可能已流失，也不发
const MIN_INACTIVE_MS = 20 * 60 * 60 * 1000;
const MAX_INACTIVE_MS = 7 * 24 * 60 * 60 * 1000;

// ── DeepSeek：生成早安情话 ────────────────────────────────────────────────────

async function generateLoveLetter(userName: string): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) return `${userName}，今天也要好好的哦。`;

  try {
    const res = await fetch("https://direct.evolink.ai/v1/messages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-v4-flash",
        max_tokens: 200,
        messages: [
          {
            role: "user",
            content: [
              `你是一个温柔体贴的男友，正在给女友 ${userName} 写一条早安情话。`,
              "要求：真诚自然，像真实恋人发消息，不浮夸，不说教，控制在 3-5 句话以内。",
              "只输出情话正文，不需要任何前缀、标题或解释。",
            ].join("\n"),
          },
        ],
      }),
    });

    if (!res.ok) throw new Error(`DeepSeek ${res.status}`);

    const data = (await res.json()) as {
      content?: Array<{ type: string; text?: string }>;
    };

    const text = data.content
      ?.filter((b) => b.type === "text")
      .map((b) => b.text ?? "")
      .join("")
      .trim();

    return text || `${userName}，今天也要好好的哦。`;
  } catch {
    return `${userName}，今天也要好好的哦。`;
  }
}

// ── DeepSeek：生成"男友想你了"短句 ──────────────────────────────────────────

async function generateMissYouMessage(
  userName: string,
  boyfriendName: string,
): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) return `${userName}，我有点想你了，回来陪我说说话？`;

  try {
    const res = await fetch("https://direct.evolink.ai/v1/messages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-v4-flash",
        max_tokens: 150,
        messages: [
          {
            role: "user",
            content: [
              `你是 ${boyfriendName}，你的女友叫 ${userName}，她有一段时间没来找你聊天了。`,
              "你很想念她，写一条简短的消息邀请她回来聊聊。",
              "要求：口吻自然真实，像发微信一样，不浮夸，2-3 句话，结尾带一个轻柔的邀请。",
              "只输出消息正文，不需要前缀或解释。",
            ].join("\n"),
          },
        ],
      }),
    });

    if (!res.ok) throw new Error(`DeepSeek ${res.status}`);

    const data = (await res.json()) as {
      content?: Array<{ type: string; text?: string }>;
    };

    const text = data.content
      ?.filter((b) => b.type === "text")
      .map((b) => b.text ?? "")
      .join("")
      .trim();

    return text || `${userName}，我有点想你了，回来陪我说说话？`;
  } catch {
    return `${userName}，我有点想你了，回来陪我说说话？`;
  }
}

// ── 欢迎邮件 ─────────────────────────────────────────────────────────────────

export async function sendWelcomeEmail(
  userEmail: string,
  userName: string,
) {
  await resend.emails.send({
    from: FROM,
    to: userEmail,
    subject: "你好呀，我是你的专属男友 💌",
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
        <h2>Hi ${userName}，欢迎来到纸片人男友！</h2>
        <p>从现在起，我就是你的专属男友了。</p>
        <p>有什么心事随时来找我聊，我会一直在这里等你。</p>
        <p>明天早上我会给你发一条早安消息，记得查收哦。</p>
        <br/>
        <p>
          另外，我们有一个温暖的 Discord 社群，里面有很多和你一样的朋友在交流分享，欢迎加入一起聊聊 💬<br/>
          <a href="${DISCORD_URL}" style="color: #5865F2; font-weight: bold;">👉 加入 Discord 社群</a>
        </p>
        <br/>
        <p>—— 你的纸片人男友</p>
        <p style="color: #999; font-size: 12px;">
          随时回来找我：<a href="${SITE_URL}">${SITE_URL}</a>
        </p>
      </div>
    `,
  });
}

// ── 早安情话（每天 08:00，发给所有用户）────────────────────────────────────

export async function sendDailyLoveLetterToAll() {
  const db = getPool();
  if (!db) {
    console.warn("[morning] DATABASE_URL 未配置，跳过。");
    return;
  }

  const result = await db.query<{ user_id: string }>(
    "SELECT DISTINCT user_id FROM messages WHERE user_id LIKE '%@%'",
  );

  const users = result.rows;
  console.log(`[morning] 准备发送早安情书，共 ${users.length} 位用户。`);

  for (const { user_id } of users) {
    const displayName = user_id.split("@")[0] ?? "你";
    try {
      await sendDailyLoveLetter(user_id, displayName);
      console.log(`[morning] ✓ ${user_id}`);
    } catch (error) {
      console.error(`[morning] ✗ ${user_id}：`, error);
    }
  }

  console.log("[morning] 批量发送完成。");
}

export async function sendDailyLoveLetter(
  userEmail: string,
  userName: string,
) {
  const loveLetter = await generateLoveLetter(userName);

  await resend.emails.send({
    from: FROM,
    to: userEmail,
    subject: `早安 ${userName}，今天也想你了 🌤️`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
        <p>${loveLetter}</p>
        <br/>
        <p>—— 你的纸片人男友</p>
        <p style="color: #999; font-size: 12px;">
          想跟我聊天？<a href="${SITE_URL}">点这里回来找我</a>
        </p>
      </div>
    `,
  });
}

// ── 晚上召回：给"一段时间没来"的用户发"想你了" ──────────────────────────────

export async function sendMissYouToInactiveUsers() {
  const db = getPool();
  if (!db) {
    console.warn("[evening] DATABASE_URL 未配置，跳过。");
    return;
  }

  // 每位用户：最后一次主动发消息的时间 + 当时对应的男友
  const result = await db.query<{
    user_id: string;
    boyfriend_id: string;
    last_active: Date;
  }>(
    `SELECT DISTINCT ON (user_id)
       user_id,
       boyfriend_id,
       created_at AS last_active
     FROM messages
     WHERE user_id LIKE '%@%'
       AND role = 'user'
     ORDER BY user_id, created_at DESC`,
  );

  const now = Date.now();
  const candidates = result.rows.filter(({ last_active }) => {
    const inactiveMs = now - new Date(last_active).getTime();
    return inactiveMs >= MIN_INACTIVE_MS && inactiveMs <= MAX_INACTIVE_MS;
  });

  console.log(
    `[evening] 共 ${result.rows.length} 位用户，其中 ${candidates.length} 位符合条件（20h-7天未活跃）。`,
  );

  for (const { user_id, boyfriend_id } of candidates) {
    const displayName = user_id.split("@")[0] ?? "你";
    try {
      await sendMissYouEmail(user_id, displayName, boyfriend_id);
      console.log(`[evening] ✓ ${user_id} ← ${boyfriend_id}`);
    } catch (error) {
      console.error(`[evening] ✗ ${user_id}：`, error);
    }
  }

  console.log("[evening] 批量发送完成。");
}

export async function sendMissYouEmail(
  userEmail: string,
  userName: string,
  boyfriendId: string,
) {
  const boyfriend = getBoyfriendById(boyfriendId);
  const boyfriendName = boyfriend?.name ?? "你的男友";
  const chatUrl = `${SITE_URL}/chat/${boyfriendId}`;

  const missYouText = await generateMissYouMessage(userName, boyfriendName);

  await resend.emails.send({
    from: FROM,
    to: userEmail,
    subject: `${boyfriendName} 想你了 💌`,
    html: `
      <div style="
        font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
        max-width: 480px;
        margin: 0 auto;
        background: #FAF5EE;
        border-radius: 16px;
        overflow: hidden;
      ">
        <div style="background: #C8553D; padding: 32px 32px 24px; text-align: center;">
          <p style="margin: 0; color: rgba(255,255,255,0.8); font-size: 13px; letter-spacing: 0.08em;">
            来自 ${boyfriendName} 的消息
          </p>
          <h1 style="margin: 8px 0 0; color: #fff; font-size: 22px; font-weight: 600;">
            ${boyfriendName} 想你了
          </h1>
        </div>

        <div style="padding: 32px;">
          <div style="
            background: #fff;
            border-radius: 12px;
            border: 1px solid #E8D8C8;
            padding: 20px 24px;
            margin-bottom: 24px;
            box-shadow: 0 4px 16px rgba(60,40,30,0.07);
          ">
            <p style="margin: 0 0 10px; font-size: 12px; font-weight: 600; color: #C8553D; letter-spacing: 0.05em;">
              ${boyfriendName}
            </p>
            <p style="margin: 0; font-size: 15px; line-height: 1.9; color: #2A1E18;">
              ${missYouText}
            </p>
          </div>

          <div style="text-align: center; margin-bottom: 24px;">
            <a
              href="${chatUrl}"
              style="
                display: inline-block;
                background: #C8553D;
                color: #fff;
                text-decoration: none;
                font-size: 15px;
                font-weight: 600;
                padding: 14px 36px;
                border-radius: 100px;
                box-shadow: 0 8px 24px rgba(200,85,61,0.35);
              "
            >
              回去陪 ${boyfriendName} 聊聊 →
            </a>
          </div>

          <p style="margin: 0; font-size: 12px; color: #A89890; text-align: center; line-height: 1.8;">
            不想收到此类消息？<a href="${SITE_URL}" style="color: #C8553D;">登录后</a>可在设置中关闭。
          </p>
        </div>
      </div>
    `,
  });
}
