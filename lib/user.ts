import { auth } from "@clerk/nextjs/server";
import { db } from "./db";

export async function getUser() {
  try {
    const { userId } = auth();

    if (!userId) return null;

    const user = await db.user.findUnique({
      where: {
        externalUserId: userId,
      },
    });

    return user;
  } catch (error: any) {
    throw new Error("Error getting user " + error.message);
  }
}
