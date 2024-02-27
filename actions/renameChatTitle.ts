"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function renameChatTitle(chatId: string, title: string) {
  try {
    await db.newChat.update({
      where: {
        id: chatId,
      },
      data: {
        title,
      },
    });

    revalidatePath("/");
  } catch (error) {
    console.log(error);
  }
}
