"use server";

import { db } from "@/lib/db";
import { getUser } from "@/lib/user";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createNewChat(messages: any) {
  const user = await getUser();

  const userContent = messages[messages.length - 2];
  const aiContent = messages[messages.length - 1];

  const data = await db.newChat.create({
    data: {
      userId: user?.id as string,
      title: userContent.content,
      chats: {
        createMany: {
          data: [
            {
              id: userContent.id,
              userId: user?.id as string,
              role: userContent.role,
              content: userContent.content,
              createdAt: userContent.createdAt,
            },
            {
              id: aiContent.id,
              userId: user?.id as string,
              role: aiContent.role,
              content: aiContent.content,
              createdAt: aiContent.createdAt,
            },
          ],
        },
      },
    },
  });

  revalidatePath("/");
  redirect(`/c/${data.id}`);
}
