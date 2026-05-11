import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "纸片人男友 <dearmate@dearmate.mom>";
const SITE_URL = "https://www.dearmate.mom";

// ── 用 DeepSeek 生成今日情话 ──────────────────────────────────────────────────

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
        <p>—— 你的纸片人男友</p>
        <p style="color: #999; font-size: 12px;">
          随时回来找我：<a href="${SITE_URL}">${SITE_URL}</a>
        </p>
      </div>
    `,
  });
}

// ── 每日早安情书 ──────────────────────────────────────────────────────────────

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
