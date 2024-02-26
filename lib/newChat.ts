import { db } from "./db";

export async function getNewChat(chatId: string) {
  const data = db.newChat.findUnique({
    where: {
      id: chatId,
    },
    include: {
      chats: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  return data;
}
