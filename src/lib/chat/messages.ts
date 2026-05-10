export type ChatMessageRole = "user" | "assistant";
export type ChatMessageType = "text" | "image" | "audio";

export type ChatMessageDraft =
  | {
      role: ChatMessageRole;
      type: "text";
      content: string;
    }
  | {
      role: ChatMessageRole;
      type: "image";
      content: string;
      imageUrl: string;
      caption?: string;
    }
  | {
      role: ChatMessageRole;
      type: "audio";
      content: string;
      audioUrl: string;
      caption?: string;
    };

export type ChatMessage = ChatMessageDraft & {
  id: string;
};

export function splitAssistantTextMessages(text: string): ChatMessageDraft[] {
  return text
    .split("[NEW_MSG]")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((content) => ({
      role: "assistant" as const,
      type: "text" as const,
      content,
    }));
}

export function toSelfieImageMessage({
  imageUrl,
  caption,
}: {
  imageUrl: string;
  caption?: string;
}): ChatMessageDraft {
  const content = caption?.trim() || "刚拍的。";

  return {
    role: "assistant",
    type: "image",
    imageUrl,
    caption: content,
    content,
  };
}

export function toAudioMessage({
  audioUrl,
  caption,
}: {
  audioUrl: string;
  caption?: string;
}): ChatMessageDraft {
  const content = caption?.trim() || "点开听。";

  return {
    role: "assistant",
    type: "audio",
    audioUrl,
    caption: content,
    content,
  };
}

export function toUserImageMessage({
  imageUrl,
  caption,
}: {
  imageUrl: string;
  caption?: string;
}): ChatMessageDraft {
  const content = caption?.trim() || "图片消息";

  return {
    role: "user",
    type: "image",
    imageUrl,
    caption: content,
    content,
  };
}

export function toUserAudioMessage({
  audioUrl,
  caption,
}: {
  audioUrl: string;
  caption?: string;
}): ChatMessageDraft {
  const content = caption?.trim() || "语音消息";

  return {
    role: "user",
    type: "audio",
    audioUrl,
    caption: content,
    content,
  };
}

export function withClientIds(messages: ChatMessageDraft[]): ChatMessage[] {
  return messages.map((message) => ({
    ...message,
    id: crypto.randomUUID(),
  }));
}
