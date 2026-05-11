import type { Metadata } from "next";
import Link from "next/link";

import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "博客 | 纸片人男友",
  description: "关于陪伴、情绪与 AI 的思考。",
};

const POSTS = [
  {
    slug: "why-we-need-to-be-heard",
    tag: "情感",
    date: "2026年5月",
    title: "为什么我们需要被认真听见",
    excerpt:
      "不是所有的倾诉都在寻求答案。有时候，你只是需要一个人真的在听——不急着评判，不急着给建议，就只是在。这件事听起来很简单，但在现实生活里，其实很难找到。",
    readTime: "4 分钟",
  },
  {
    slug: "ai-companion-honest-talk",
    tag: "产品思考",
    date: "2026年4月",
    title: "AI 伴侣：我们想做什么，不想做什么",
    excerpt:
      "市面上有很多 AI 陪伴产品，但我们做纸片人男友的时候，给自己设了一条线：不欺骗、不依赖、不替代真实关系。这篇文章想聊聊，我们具体是怎么想的。",
    readTime: "6 分钟",
  },
  {
    slug: "loneliness-modern-life",
    tag: "心理健康",
    date: "2026年3月",
    title: "孤独是现代病，但你不必一个人扛",
    excerpt:
      "研究数据显示，全球有超过三分之一的成年人长期感到孤独。这不是性格问题，也不是你不够努力融入社会。孤独是一种信号，在提醒你有些需求还没被照顾到。",
    readTime: "5 分钟",
  },
  {
    slug: "how-to-have-a-good-conversation",
    tag: "使用技巧",
    date: "2026年2月",
    title: "怎么和他们聊，才会真的有感觉",
    excerpt:
      "很多用户问我们：为什么有些人和角色聊了几分钟就觉得特别真实，有些人却感觉像在和客服说话？我们整理了一些小技巧，帮你打开对话的质感。",
    readTime: "3 分钟",
  },
];

const TAG_COLORS: Record<string, string> = {
  情感: "bg-[#FDECEA] text-[#C8553D]",
  产品思考: "bg-[#EEF2FF] text-[#4F46E5]",
  心理健康: "bg-[#F0FDF4] text-[#16A34A]",
  使用技巧: "bg-[#FFF7ED] text-[#EA580C]",
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#F3EADF] text-[#241C18]">
      <Navbar />

      <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
        {/* 页头 */}
        <p className="text-sm font-medium tracking-widest text-[#C8553D]">BLOG</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          关于陪伴的思考
        </h1>
        <p className="mt-4 text-base leading-7 text-[#6F5A52]">
          情绪、关系、AI 与日常——我们想聊的，都在这里。
        </p>

        {/* 文章列表 */}
        <div className="mt-12 space-y-5">
          {POSTS.map((post, i) => (
            <article
              key={post.slug}
              className="group relative rounded-[24px] border border-[#D8C4B8] bg-white/50 p-7 transition duration-200 hover:border-[#C8553D]/40 hover:bg-white/70 hover:shadow-[0_8px_30px_rgba(200,85,61,0.08)]"
            >
              {/* 精选标记（第一篇） */}
              {i === 0 && (
                <span className="absolute right-5 top-5 rounded-full bg-[#C8553D] px-2.5 py-0.5 text-xs font-semibold text-white">
                  最新
                </span>
              )}

              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${TAG_COLORS[post.tag] ?? "bg-[#F3EADF] text-[#8A7168]"}`}
                >
                  {post.tag}
                </span>
                <span className="text-xs text-[#A08C84]">{post.date}</span>
                <span className="text-xs text-[#A08C84]">· {post.readTime}</span>
              </div>

              <h2 className="mt-3 text-xl font-semibold leading-snug text-[#241C18] group-hover:text-[#C8553D] transition-colors">
                {post.title}
              </h2>
              <p className="mt-2 text-sm leading-7 text-[#6F5A52]">{post.excerpt}</p>

              <div className="mt-4">
                {/* 文章页面暂未创建，链接作为占位 */}
                <span className="text-sm font-medium text-[#C8553D] opacity-70">
                  即将上线 →
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* 底部订阅引导 */}
        <div className="mt-14 rounded-[24px] border border-[#D8C4B8] bg-white/40 px-7 py-8 text-center">
          <p className="text-lg font-semibold">想第一时间看到新文章？</p>
          <p className="mt-2 text-sm text-[#6F5A52]">
            加入我们的 Discord 社群，新文章和产品动态都会在那里第一时间更新。
          </p>
          <a
            href="https://discord.gg/h6xyDQuzT"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex rounded-full bg-[#5865F2] px-7 py-2.5 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(88,101,242,0.30)] transition hover:bg-[#4752c4]"
          >
            加入 Discord 社群 💬
          </a>
        </div>
      </div>
    </main>
  );
}
