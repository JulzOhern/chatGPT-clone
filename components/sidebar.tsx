import React from "react";
import SidebarGPTlogo from "./gptIcons/sidebarGPTlogo";
import NewChatPencilIcon from "./gptIcons/newChatPencilIcon";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { getUser } from "@/lib/user";
import { getUserNewChat } from "@/lib/userNewChat";
import UserNewChatsRow from "./userNewChatsRow";

export default async function Sidebar() {
  const user = await getUser();
  const userNewChat = await getUserNewChat();

  return (
    <div className="sidebarContainer flex flex-col fixed inset-y-0 bg-[#171717] w-[16rem] pb-3 z-[101]">
      <div className="sidebar flex-1 pt-[.9rem] pl-3 pr-2 mr-1 overflow-y-scroll overflow-x-clip">
        <Link
          href="/"
          className="sticky top-0 z-[50] flex items-center justify-between p-1 hover:bg-[#212121] bg-[#171717] rounded-lg py-[6px] px-2"
        >
          <h1 className="flex items-center gap-2">
            <SidebarGPTlogo />
            <span className="font-medium text-sm">New chat</span>
          </h1>

          <button>
            <NewChatPencilIcon />
          </button>
        </Link>

        <div className="mt-6">
          <UserNewChatsRow userNewChat={userNewChat} />
        </div>
      </div>

      <div className="pt-4 px-3">
        <div className="flex items-center gap-2 cursor-pointer hover:bg-[#212121] p-2 rounded-lg">
          <UserButton />
          <p className="text-sm">{user?.username}</p>
        </div>
      </div>
    </div>
  );
}
