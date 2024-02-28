"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, {
  Fragment,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import MorePencilIcon from "./gptIcons/morePencilIcon";
import DeleteMoreIcon from "./gptIcons/deleteMoreIcon";
import { renameChatTitle } from "@/actions/renameChatTitle";
import { toast } from "sonner";
import { deleteNewChat } from "@/actions/deleteNewChat";

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
  const [isOpenmore, setIsOpenmore] = useState("");
  const [rename, setRename] = useState("");
  const [deleteChat, setDeleteChat] = useState("");
  const [pending, setTransition] = useTransition();

  const getFormattedDate = (date: any) => {
    const now = new Date() as any;
    const dateObj = new Date(date) as any;

    dateObj.setHours(0, 0, 0, 0);

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
    const daysDifference = Math.floor((now - dateObj) / (1000 * 60 * 60 * 24));
    // Check if the date is within the same year
    if (now.getFullYear() === dateObj.getFullYear()) {
      return `Previous ${daysDifference} days`;
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
  }, [userNewChat]);

  useEffect(() => {
    function handleClick() {
      setIsOpenmore("");
      setDeleteChat("");
      setRename("");
    }

    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <>
      {createdChatDate.map((d, index) => (
        <Fragment key={index}>
          <p className="text-xs p-2 text-zinc-500">{d}</p>
          {userNewChat
            ?.filter((item) => getFormattedDate(new Date(item.createdAt)) === d)
            ?.map((item) => (
              <div key={item.id} className="relative group/show">
                {rename !== item.id ? (
                  <Link href={`/c/${item.id}`}>
                    <p
                      className={cn(
                        "whitespace-nowrap rounded-lg p-2 text-sm overflow-hidden",
                        item.id === id
                          ? "bg-[#2f2f2f] before:absolute before:right-0 before:inset-y-0 before:w-[4rem] before:bg-gradient-to-r before:from-transparent before:via-[#2f2f2f] before:to-[#2f2f2f] before:rounded-r-lg"
                          : "group-hover/show:bg-[#212121] before:absolute before:right-0 before:inset-y-0 before:w-[1.5rem] before:group-hover/show:w-[4rem] before:bg-gradient-to-r before:from-transparent before:to-[#171717] before:via-[#171717] group-hover/show:before:bg-gradient-to-r group-hover/show:from-transparent group-hover/show:before:via-[#212121] group-hover/show:before:to-[#212121] group-hover/show:before:rounded-r-lg before:z-[1]",
                        isOpenmore === item.id &&
                          item.id !== id &&
                          "bg-[#212121] before:absolute before:right-0 before:inset-y-0 before:w-[4rem] before:group-hover/show:w-[4rem] before:bg-gradient-to-r before:from-transparent before:to-[#212121] before:via-[#212121] before:rounded-lg"
                      )}
                    >
                      {item.title}
                    </p>
                  </Link>
                ) : (
                  <form
                    onClick={(e) => e.stopPropagation()}
                    action={async (formData: FormData) => {
                      const title = formData.get("title") as string;
                      if (!title)
                        return toast.error("Required", {
                          description: "Title is required",
                        });
                      renameChatTitle(item.id, title).then(() => setRename(""));
                    }}
                    className="flex px-2 rounded-lg bg-[#2f2f2f]"
                  >
                    <div className="flex items-center py-[.5rem] bg-[#212121] flex-1">
                      <input
                        autoFocus
                        name="title"
                        className="w-full text-sm bg-[#212121] ring-2 ring-blue-600 outline-none"
                        defaultValue={item.title}
                      />
                    </div>
                  </form>
                )}

                {rename !== item.id && (
                  <div
                    className={cn(
                      "absolute right-0 inset-y-0 flex items-center z-[10] pr-2 invisible group-hover/show:visible group/show hover:text-zinc-400",
                      item.id === id || isOpenmore === item.id
                        ? "visible"
                        : null
                    )}
                  >
                    <Popover open={isOpenmore === item.id}>
                      <PopoverTrigger
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsOpenmore(isOpenmore === item.id ? "" : item.id);
                        }}
                      >
                        <HiDotsHorizontal cursor="pointer" />
                      </PopoverTrigger>

                      <PopoverContent className="flex flex-col absolute left-[-3rem] sm:left-[-.8rem] w-[11.5rem] bg-[#2f2f2f] border border-zinc-700 text-white text-sm">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsOpenmore("");
                            setRename(rename === item.id ? "" : item.id);
                          }}
                          className="flex items-center gap-2 text-start p-3 hover:bg-[#424242] rounded"
                        >
                          <MorePencilIcon /> Rename
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsOpenmore("");
                            setDeleteChat(
                              deleteChat === item.id ? "" : item.id
                            );
                          }}
                          className="flex items-center gap-2 text-start p-3 hover:bg-[#424242] rounded text-red-500"
                        >
                          <DeleteMoreIcon /> Delete chat
                        </button>
                      </PopoverContent>
                    </Popover>
                  </div>
                )}

                {deleteChat === item.id && (
                  <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[103]">
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 max-w-[28rem] bg-[#2f2f2f] rounded-xl"
                    >
                      <h1 className="font-semibold text-lg p-6 border-b border-[#424242]">
                        Delete chat?
                      </h1>

                      <div className="p-6">
                        <div>
                          <p className="line-clamp-2">
                            This will delete{" "}
                            <span className="font-semibold">{item.title}.</span>
                          </p>
                        </div>
                        <div className="flex items-center justify-end gap-3 mt-3 text-sm font-medium">
                          <button
                            disabled={pending}
                            onClick={() => setDeleteChat("")}
                            className="hover:bg-[#67676747] hover:border border px-3 py-2 border-[#676767] rounded-lg"
                          >
                            Cancel
                          </button>
                          <button
                            disabled={pending}
                            onClick={() =>
                              setTransition(async () => {
                                await deleteNewChat(item.id).then(() => {
                                  setDeleteChat("");
                                  toast.success("Success", {
                                    description: "Deleted successfully",
                                  });
                                });
                              })
                            }
                            className="disabled:bg-red-900 px-3 py-2 rounded-lg bg-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
        </Fragment>
      ))}
    </>
  );
}
