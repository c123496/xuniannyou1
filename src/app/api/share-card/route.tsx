import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

import { getBoyfriendById } from "@/lib/boyfriends";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const SITE_URL = "https://www.dearmate.mom";
const MAX_TEXT_LENGTH = 120;

/**
 * 通过 Google Fonts CSS2 text 参数加载最小字体子集。
 * 每张卡片只会包含几十个汉字，子集体积 < 30KB，比全量 WOFF2 快得多。
 * 若失败返回 undefined，ImageResponse 回退到内建字体（汉字显示方块，但卡片不空白）。
 */
async function loadSubsetFont(chars: string): Promise<ArrayBuffer | undefined> {
  try {
    const unique = [...new Set(chars)].filter((c) => c.trim()).join("");
    const cssUrl = `https://fonts.googleapis.com/css2?family=Noto+Sans+SC&text=${encodeURIComponent(unique)}`;

    const css = await fetch(cssUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    }).then((r) => r.text());

    const fontUrl = css.match(/src: url\((.+?\.woff2)\)/)?.[1];
    if (!fontUrl) return undefined;

    const res = await fetch(fontUrl);
    if (!res.ok) return undefined;
    return res.arrayBuffer();
  } catch {
    return undefined;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const boyfriendId = searchParams.get("bid") ?? "lin_ting";
  const rawContent = searchParams.get("c") ?? "";
  const imageUrl = searchParams.get("img") ?? "";
  const type = searchParams.get("t") === "image" ? "image" : "text";

  const boyfriend = getBoyfriendById(boyfriendId);
  if (!boyfriend) {
    return new Response("Unknown boyfriend", { status: 404 });
  }

  const content =
    rawContent.length > MAX_TEXT_LENGTH
      ? rawContent.slice(0, MAX_TEXT_LENGTH) + "…"
      : rawContent;

  const avatarUrl = `${SITE_URL}${boyfriend.avatarImageUrl}`;

  // 加载卡片所有文字的最小字体子集
  const allChars = `纸片人男友${boyfriend.name}${boyfriend.age}岁${boyfriend.positioning}${content}说他也可以陪你让闺蜜也试试`;
  const fontData = await loadSubsetFont(allChars);

  // 只有字体加载成功时才设置 fontFamily；否则不传 fonts 选项，
  // satori 用内建字体渲染（汉字变方块但卡片结构完整）。
  const rootFontStyle = fontData ? { fontFamily: "NotoSansSC" } : {};
  const ogFonts = fontData
    ? [{ name: "NotoSansSC", data: fontData, weight: 400 as const, style: "normal" as const }]
    : undefined;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundImage:
            "linear-gradient(160deg, #FAF5EE 0%, #F2E8D8 55%, #EBE0CC 100%)",
          padding: "64px",
          position: "relative",
          ...rootFontStyle,
        }}
      >
        {/* 纹理装饰点 —— 右上角 */}
        <div
          style={{
            position: "absolute",
            top: "48px",
            right: "64px",
            display: "flex",
            flexWrap: "wrap",
            width: "28px",
            gap: "5px",
          }}
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                width: "9px",
                height: "9px",
                borderRadius: "50%",
                backgroundColor: "#C8553D",
                opacity: 0.6,
              }}
            />
          ))}
        </div>

        {/* 顶部品牌 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "52px",
          }}
        >
          <div
            style={{
              fontSize: "30px",
              color: "#C8553D",
              fontStyle: "italic",
              letterSpacing: "0.01em",
            }}
          >
            纸片人男友
          </div>
        </div>

        {/* 角色信息 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          <img
            src={avatarUrl}
            width={72}
            height={72}
            style={{
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid #E8D8C8",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div
              style={{
                fontSize: "34px",
                fontWeight: "600",
                color: "#1A1210",
              }}
            >
              {boyfriend.name}
            </div>
            <div style={{ fontSize: "20px", color: "#7C6860" }}>
              {boyfriend.age}岁 · {boyfriend.positioning}
            </div>
          </div>
        </div>

        {/* 内容区 */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {type === "image" && imageUrl ? (
            // 图片卡片
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                borderRadius: "28px",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <img
                src={imageUrl}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "28px",
                }}
              />
              {/* 底部渐变遮罩 */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "40%",
                  backgroundImage:
                    "linear-gradient(to top, rgba(26,19,16,0.75), transparent)",
                  borderRadius: "0 0 28px 28px",
                  display: "flex",
                  alignItems: "flex-end",
                  padding: "32px",
                }}
              >
                {content ? (
                  <div
                    style={{
                      fontSize: "24px",
                      color: "rgba(255,255,255,0.9)",
                      lineHeight: 1.6,
                    }}
                  >
                    {content}
                  </div>
                ) : null}
              </div>
            </div>
          ) : (
            // 文字卡片
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "rgba(255,255,255,0.92)",
                borderRadius: "28px",
                border: "1.5px solid #E8D8C8",
                padding: "48px 56px",
                boxShadow: "0 20px 60px rgba(60,40,30,0.10)",
                flex: 1,
              }}
            >
              {/* 角色名标签 */}
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#C8553D",
                  letterSpacing: "0.08em",
                  marginBottom: "24px",
                  textTransform: "uppercase",
                }}
              >
                {boyfriend.name} 说
              </div>

              {/* 引号装饰 */}
              <div
                style={{
                  fontSize: "96px",
                  color: "#C8553D",
                  opacity: 0.15,
                  lineHeight: 0.8,
                  marginBottom: "8px",
                }}
              >
                "
              </div>

              {/* 消息文字 */}
              <div
                style={{
                  fontSize: content.length > 60 ? "28px" : "36px",
                  lineHeight: 1.85,
                  color: "#1A1210",
                  flex: 1,
                }}
              >
                {content}
              </div>
            </div>
          )}
        </div>

        {/* 底部 CTA */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "40px",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "1.5px",
              backgroundColor: "#C8553D",
              opacity: 0.35,
            }}
          />
          <div style={{ fontSize: "20px", color: "#7C6860" }}>
            他也可以陪你 · 让闺蜜也试试
          </div>
          <div
            style={{
              fontSize: "18px",
              color: "#C8553D",
              letterSpacing: "0.03em",
            }}
          >
            www.dearmate.mom
          </div>
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1080,
      ...(ogFonts ? { fonts: ogFonts } : {}),
    },
  );
}
