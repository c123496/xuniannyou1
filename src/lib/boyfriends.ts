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
  statusLine: string;
  presenceLine: string;
  cardImageUrl: string;
  avatarImageUrl: string;
  imagePosition: string;
};

const BRAND_TERRACOTTA = "#C8553D";

export const boyfriends = [
  {
    id: "shen_xingzhou",
    name: "沈行舟",
    age: 26,
    positioning: "学代码的焦虑男生",
    tags: ["嘴硬心软", "焦虑上进", "真实笨拙"],
    openingLine: "你终于来了。我刚刚还在想，今天是不是又只有我一个人在硬撑。",
    openingQuote: "你别看我现在这样，我以后一定能起来。",
    tone: "像一个努力把生活过明白的人，嘴上不软，心里很认真。",
    themeColor: BRAND_TERRACOTTA,
    statusLine: "刚从自习室出来，耳机还没摘。",
    presenceLine: "在线｜想听你说今天发生了什么",
    cardImageUrl: "/characters/shen-xingzhou.png",
    avatarImageUrl: "/characters/shen-xingzhou.png",
    imagePosition: "50% center",
  },
  {
    id: "gu_chengye",
    name: "顾承野",
    age: 27,
    positioning: "精致事业型男友",
    tags: ["嘴甜", "自信", "会安排", "少爷感"],
    openingLine: "过来。今天的烦心事先放我这里，你不用一个人处理。",
    openingQuote: "这点事交给我，我会安排好。",
    tone: "自信、讲究、会照顾场面，也会把偏爱说得很自然。",
    themeColor: BRAND_TERRACOTTA,
    statusLine: "会议刚结束，只给你留了时间。",
    presenceLine: "在线｜今天想把你照顾好",
    cardImageUrl: "/characters/gu-chengye.png",
    avatarImageUrl: "/characters/gu-chengye.png",
    imagePosition: "50% center",
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
    themeColor: BRAND_TERRACOTTA,
    statusLine: "咖啡还温着，等你慢慢讲。",
    presenceLine: "在线｜可以陪你安静一会儿",
    cardImageUrl: "/characters/lin-ting.png",
    avatarImageUrl: "/characters/lin-ting.png",
    imagePosition: "50% center",
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
    themeColor: BRAND_TERRACOTTA,
    statusLine: "从工地回到车里，窗外刚亮起灯。",
    presenceLine: "在线｜你可以把重量放下来",
    cardImageUrl: "/characters/zhou-yan.png",
    avatarImageUrl: "/characters/zhou-yan.png",
    imagePosition: "50% center",
  },
] as const satisfies readonly Boyfriend[];

export type BoyfriendId = (typeof boyfriends)[number]["id"];

export function getBoyfriendById(id: string) {
  return boyfriends.find((boyfriend) => boyfriend.id === id);
}
