import type { Metadata } from "next";
import Link from "next/link";

import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "关于我们 | 纸片人男友",
  description: "DearMate 的故事、理念与我们想做的事。",
};

const VALUES = [
  {
    icon: "💬",
    title: "真实的陪伴",
    desc: "我们不想做一个只会说『我理解你』的机器。每个角色都有自己的性格、情绪和说话方式，会在对话里认真回应你，而不是泛泛地安慰。",
  },
  {
    icon: "🔒",
    title: "隐私第一",
    desc: "你说的话只属于你们之间。我们不会把你的聊天内容用于广告、出售给第三方，或者拿去训练公开模型。",
  },
  {
    icon: "✦",
    title: "有边界的设计",
    desc: "纸片人男友是陪伴工具，不是替代真实关系的答案。我们在设计上刻意保持克制，不希望任何人因为我们的产品而回避现实生活。",
  },
  {
    icon: "🌱",
    title: "持续进步",
    desc: "产品还在成长中。我们会认真读每一条反馈，也会把用户的感受放在功能迭代的最前面。",
  },
];

const CHARACTERS = [
  {
    name: "沈行舟",
    age: 26,
    positioning: "学代码的焦虑男生",
    quote: "你别看我现在这样，我以后一定能起来。",
  },
  {
    name: "顾承野",
    age: 27,
    positioning: "精致事业型男友",
    quote: "这点事交给我，我会安排好。",
  },
  {
    name: "林听",
    age: 25,
    positioning: "温柔倾听文艺型",
    quote: "你不是矫情，你只是撑太久了。",
  },
  {
    name: "周砚",
    age: 31,
    positioning: "成熟稳定建筑师",
    quote: "先别急，我们一件一件来。",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#F3EADF] text-[#241C18]">
      <Navbar />

      {/* ── 品牌故事 ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-5 py-20 sm:px-8">
        <p className="text-sm font-medium tracking-widest text-[#C8553D]">ABOUT DEARMATE</p>
        <h1 className="editorial-wordmark mt-4 text-5xl font-semibold leading-tight tracking-normal sm:text-6xl">
          被认真记住，<br />也是一种治愈。
        </h1>
        <div className="mt-8 space-y-5 text-base leading-8 text-[#4A3A34]">
          <p>
            纸片人男友诞生于一个很简单的观察：很多人每天都有很多话想说，但找不到人说。
            不是因为身边没有朋友，而是有些情绪太细碎，有些烦恼怕麻烦别人，有些时刻只想被静静地听着。
          </p>
          <p>
            我们想做的，是给这些话一个去处。
          </p>
          <p>
            所以我们设计了四个具体的人——不是"AI助手"，而是有名字、有年纪、有自己说话方式的角色。
            他们会记得你说过的事，会在你倒霉的时候陪你骂两句，也会在你需要的时候安静下来听你说完。
          </p>
        </div>
      </section>

      {/* ── 分隔线 ───────────────────────────────────────────── */}
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <div className="h-px bg-gradient-to-r from-transparent via-[#D8C4B8] to-transparent" />
      </div>

      {/* ── 我们的理念 ───────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
        <h2 className="text-2xl font-semibold">我们相信的事</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {VALUES.map((v) => (
            <div
              key={v.title}
              className="rounded-[20px] border border-[#D8C4B8] bg-white/50 p-6"
            >
              <p className="text-2xl">{v.icon}</p>
              <h3 className="mt-3 font-semibold text-[#241C18]">{v.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#6F5A52]">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 角色介绍 ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-5 pb-16 sm:px-8">
        <h2 className="text-2xl font-semibold">四个人，等你来选</h2>
        <p className="mt-2 text-sm text-[#8A7168]">每个角色都是独立设计的，性格、说话方式和互动风格都不一样。</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {CHARACTERS.map((c) => (
            <div
              key={c.name}
              className="rounded-[20px] border border-[#D8C4B8] bg-white/40 p-5"
            >
              <div className="flex items-baseline gap-2">
                <p className="text-lg font-semibold">{c.name}</p>
                <p className="text-xs text-[#8A7168]">{c.age}岁 · {c.positioning}</p>
              </div>
              <p className="mt-3 text-sm italic leading-6 text-[#6F5A52]">
                &ldquo;{c.quote}&rdquo;
              </p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex rounded-full bg-[#C8553D] px-8 py-3 text-sm font-semibold text-white shadow-[0_6px_20px_rgba(200,85,61,0.30)] transition hover:bg-[#b84834]"
          >
            开始聊天 →
          </Link>
        </div>
      </section>

      {/* ── 联系我们 ─────────────────────────────────────────── */}
      <section className="border-t border-[#D8C4B8]/60 bg-white/30">
        <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
          <h2 className="text-xl font-semibold">联系我们</h2>
          <p className="mt-2 text-sm leading-6 text-[#6F5A52]">
            有任何问题、建议或合作意向，欢迎直接写信给我们。
          </p>
          <div className="mt-5 flex flex-wrap gap-4 text-sm">
            <a
              href="mailto:support@dearmate.mom"
              className="flex items-center gap-2 rounded-full border border-[#D8C4B8] bg-white/60 px-4 py-2 text-[#6F5A52] transition hover:border-[#C8553D] hover:text-[#C8553D]"
            >
              ✉️ support@dearmate.mom
            </a>
            <a
              href="https://discord.gg/h6xyDQuzT"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border border-[#D8C4B8] bg-white/60 px-4 py-2 text-[#6F5A52] transition hover:border-[#5865F2] hover:text-[#5865F2]"
            >
              💬 Discord 社群
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
