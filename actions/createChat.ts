"use server";

import { db } from "@/lib/db";
import { getUser } from "@/lib/user";

export async function createChats(messages: any, chatId: string | undefined) {
  const user = await getUser();

  const userContent = messages[messages.length - 2];
  const aiContent = messages[messages.length - 1];

  await db.chats.createMany({
    data: [
      {
        id: userContent.id,
        userId: user?.id as string,
        newChatId: chatId as string,
        role: userContent.role,
        content: userContent.content,
        createdAt: userContent.createdAt,
      },
      {
        id: aiContent.id,
        userId: user?.id as string,
        newChatId: chatId as string,
        role: aiContent.role,
        content: aiContent.content,
        createdAt: aiContent.createdAt,
      },
    ],
  });
}
