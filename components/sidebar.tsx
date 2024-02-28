import React from "react";
import { getUser } from "@/lib/user";
import { getUserNewChat } from "@/lib/userNewChat";
import SidebarRow from "./sidebarRow";

export default async function Sidebar() {
  const user = await getUser();
  const userNewChat = await getUserNewChat();

  return <SidebarRow user={user} userNewChat={userNewChat} />;
}
