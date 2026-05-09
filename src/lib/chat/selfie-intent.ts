import type { SelfieToolCall } from "../ai/deepseek";

const directSelfiePatterns = [
  /发.*照/,
  /照片/,
  /自拍/,
  /拍一张/,
  /拍张/,
  /想看你/,
  /看看你/,
  /看一下你/,
];

const fallbackScenes: Record<string, string> = {
  shen_xingzhou: "书桌前学代码到有点累，电脑屏幕亮着，头发有点乱，但看向镜头时很温柔",
  gu_chengye: "办公室里穿干净衬衫，光线清爽，刚结束会议，对镜头自然微笑",
  lin_ting: "咖啡馆窗边的柔光里，手边放着书和咖啡，温柔地看向镜头",
  zhou_yan: "简约建筑工作室里，桌上有图纸和模型，穿深色上衣，神情沉稳",
};

export function isDirectSelfieRequest(message: string) {
  return directSelfiePatterns.some((pattern) => pattern.test(message));
}

export function buildFallbackSelfieCall(boyfriendId: string): SelfieToolCall {
  return {
    scene: fallbackScenes[boyfriendId] ?? "自然光下的日常自拍，真实、温柔、像刚刚发给恋人的照片",
    caption: "刚拍的，给你看。",
  };
}

export function ensureSelfieForDirectRequest({
  boyfriendId,
  userMessage,
  selfieCalls,
}: {
  boyfriendId: string;
  userMessage: string;
  selfieCalls: SelfieToolCall[];
}) {
  if (!isDirectSelfieRequest(userMessage) || selfieCalls.length > 0) {
    return selfieCalls;
  }

  return [buildFallbackSelfieCall(boyfriendId)];
}
