"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteNewChat(chatId: string) {
  await db.newChat.delete({
    where: {
      id: chatId,
    },
  });

  revalidatePath("/");
  redirect("/");
}
