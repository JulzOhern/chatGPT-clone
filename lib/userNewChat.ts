import { db } from "./db";
import { getUser } from "./user";

export async function getUserNewChat() {
  const user = await getUser();

  if (!user) {
    return null;
  }

  const data = await db.newChat.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return data;
}
