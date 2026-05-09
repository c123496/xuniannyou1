import { describe, expect, it } from "vitest";

import { getCharacterSystemPrompt } from "./characters";

describe("character system prompts", () => {
  it.each([
    ["shen_xingzhou", "沈行舟", "书桌/熬夜/疲惫但温柔"],
    ["gu_chengye", "顾承野", "办公室/衬衫/光线干净"],
    ["lin_ting", "林听", "咖啡馆/窗边/柔光"],
    ["zhou_yan", "周砚", "工作室/简约/沉稳"],
  ])("adds chat and selfie rules for %s", (id, name, selfieScene) => {
    const prompt = getCharacterSystemPrompt(id);

    expect(prompt).toContain(name);
    expect(prompt).toContain("绝对禁止");
    expect(prompt).toContain("用括号描写自己的动作或表情");
    expect(prompt).toContain("[NEW_MSG]");
    expect(prompt).toContain("必须立刻调用 send_selfie");
    expect(prompt).toContain("必须立刻调用 send_voice");
    expect(prompt).toContain(selfieScene);
  });
});
