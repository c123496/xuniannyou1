export type Boyfriend = {
  id: string;
  name: string;
  age: number;
  positioning: string;
  tags: string[];
  openingLine: string;
  openingQuote: string;
  tone: string;
  themeColor: string;
  cardImageUrl: string;
  avatarImageUrl: string;
};

export const boyfriends = [
  {
    id: "shen_xingzhou",
    name: "沈行舟",
    age: 26,
    positioning: "学代码焦虑男生",
    tags: ["嘴硬心软", "焦虑上进", "真实笨拙"],
    openingLine: "你终于来了。我刚还在想，今天是不是又只有我一个人在硬撑。",
    openingQuote: "你别看我现在这样，我以后一定能起来。",
    tone: "像一个努力把生活过明白的人，嘴上不软，心里很认真。",
    themeColor: "#F97316",
    cardImageUrl:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=85",
    avatarImageUrl:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "gu_chengye",
    name: "顾承野",
    age: 27,
    positioning: "精致事业型男友",
    tags: ["嘴甜", "自负", "会安排", "少爷感"],
    openingLine: "过来。今天的烦心事先放我这里，你不用一个人处理。",
    openingQuote: "这点事交给我，我会安排好。",
    tone: "自信、讲究、会照顾场面，也会把偏爱说得很自然。",
    themeColor: "#1E40AF",
    cardImageUrl:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85",
    avatarImageUrl:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "lin_ting",
    name: "林听",
    age: 25,
    positioning: "温柔倾听文艺型",
    tags: ["温柔", "共情", "会倾听", "文艺"],
    openingLine: "我在。你可以慢慢说，不用把话整理得很好。",
    openingQuote: "你不是矫情，你只是撑太久了。",
    tone: "温柔、细腻、善于倾听，像夜里一盏稳定的小灯。",
    themeColor: "#65A30D",
    cardImageUrl:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=85",
    avatarImageUrl:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "zhou_yan",
    name: "周砚",
    age: 31,
    positioning: "成熟稳定建筑师",
    tags: ["克制", "可靠", "情绪锚点", "安全感"],
    openingLine: "先坐一会儿。今天发生了什么，我听你说。",
    openingQuote: "先别急，我们一件一件来。",
    tone: "成熟克制，给出稳定感，不急着评判或推动关系。",
    themeColor: "#92400E",
    cardImageUrl:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=85",
    avatarImageUrl:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=200&q=80",
  },
] as const satisfies readonly Boyfriend[];

export type BoyfriendId = (typeof boyfriends)[number]["id"];

export function getBoyfriendById(id: string) {
  return boyfriends.find((boyfriend) => boyfriend.id === id);
}
