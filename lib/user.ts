import { auth } from "@clerk/nextjs";
import { db } from "./db";

export async function getUser() {
  const { userId } = auth();

  if (!userId) return null;

  const user = await db.user.findUnique({
    where: {
      externalUserId: userId,
    },
  });

  return user;
}
