"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { Fragment, useMemo, useState } from "react";
import { HiDotsHorizontal } from "react-icons/hi";

type UserNewChatsRowProp = {
  userNewChat:
    | {
        id: string;
        title: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
      }[]
    | null;
};

export default function UserNewChatsRow({ userNewChat }: UserNewChatsRowProp) {
  const { id } = useParams();
  const [more, setMore] = useState(false);

  const getFormattedDate = (date: any) => {
    const now = new Date() as any;
    const dateObj = new Date(date) as any;

    // Check if the date is today
    if (now.toDateString() === dateObj.toDateString()) {
      return "Today";
    }

    // Check if the date is yesterday
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (yesterday.toDateString() === dateObj.toDateString()) {
      return "Yesterday";
    }

    // Check if the date is within the same year
    if (now.getFullYear() === dateObj.getFullYear()) {
      return `Previous ${Math.floor(
        (now - dateObj) / (1000 * 60 * 60 * 24)
      )} days`;
    }

    // If none of the above conditions are met, return the full year
    return dateObj.getFullYear();
  };

  const createdChatDate = useMemo(() => {
    const createdChatDate = [] as string[];
    if (userNewChat) {
      for (const userNewChats of userNewChat) {
        const date = getFormattedDate(new Date(userNewChats.createdAt));

        !createdChatDate.some((item) => item === date)
          ? createdChatDate.push(date)
          : null;
      }
    }
    return createdChatDate;
  }, [userNewChat, getFormattedDate]);

  return (
    <>
      {createdChatDate.map((d, index) => (
        <Fragment key={index}>
          <p className="text-xs p-2 text-zinc-500">{d}</p>
          {userNewChat
            ?.filter((item) => getFormattedDate(new Date(item.createdAt)) === d)
            ?.map((item) => (
              <div key={item.id} className="relative group/show">
                <Link href={`/c/${item.id}`}>
                  <p
                    className={cn(
                      "whitespace-nowrap rounded-lg p-2 text-sm overflow-hidden",
                      item.id === id
                        ? "bg-[#2f2f2f] before:absolute before:right-0 before:inset-y-0 before:w-[4rem] before:bg-gradient-to-r before:from-transparent before:via-[#2f2f2f] before:to-[#2f2f2f] before:rounded-r-lg"
                        : "group-hover/show:bg-[#212121] before:absolute before:right-0 before:inset-y-0 before:w-[1.5rem] before:group-hover/show:w-[4rem] before:bg-gradient-to-r before:from-transparent before:to-[#171717] before:via-[#171717] group-hover/show:before:bg-gradient-to-r group-hover/show:from-transparent group-hover/show:before:via-[#212121] group-hover/show:before:to-[#212121] group-hover/show:before:rounded-r-lg before:z-[1]"
                    )}
                  >
                    {item.title}
                  </p>
                </Link>

                <div
                  className={cn(
                    "absolute right-0 inset-y-0 flex items-center z-[100] pr-2 invisible group-hover/show:visible group/show hover:text-zinc-400",
                    item.id === id && "visible"
                  )}
                >
                  <HiDotsHorizontal
                    onClick={() => setMore(!more)}
                    cursor="pointer"
                  />
                </div>

                <div className="fixed -right-[9rem]  p-3 border z-[110] bg-red-500">
                  dd
                </div>
              </div>
            ))}
        </Fragment>
      ))}
    </>
  );
}
