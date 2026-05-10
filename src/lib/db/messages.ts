import type { ChatMessageDraft } from "../chat/messages";
import { getPool } from "./pool";

export async function saveChatMessages({
  userId,
  boyfriendId,
  messages,
}: {
  userId: string;
  boyfriendId: string;
  messages: ChatMessageDraft[];
}) {
  const db = getPool();
  if (!db || messages.length === 0) return;

  await db.query(
    `
      insert into messages (
        user_id,
        boyfriend_id,
        role,
        type,
        content,
        image_url,
        audio_url,
        caption,
        metadata
      )
      select *
      from jsonb_to_recordset($1::jsonb) as x(
        user_id text,
        boyfriend_id text,
        role text,
        type text,
        content text,
        image_url text,
        audio_url text,
        caption text,
        metadata jsonb
      )
    `,
    [
      JSON.stringify(
        messages.map((message) => ({
          user_id: userId,
          boyfriend_id: boyfriendId,
          role: message.role,
          type: message.type,
          content: message.content,
          image_url: message.type === "image" ? message.imageUrl : null,
          audio_url: message.type === "audio" ? message.audioUrl : null,
          caption: message.type === "image" || message.type === "audio" ? message.caption ?? null : null,
          metadata: {},
        })),
      ),
    ],
  );
}
