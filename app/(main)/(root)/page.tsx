import ChatRow from "@/components/chatRow";
import { getUser } from "@/lib/user";
import React from "react";

export default async function HomePage() {
  const user = await getUser();

  return <ChatRow user={user} />;
}
