"use client";

import React, { ElementRef, useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import InputButton from "./gptIcons/inputButton";
import { useChat } from "ai/react";
import { usePathname } from "next/navigation";
import { createNewChat } from "@/actions/newChat";
import { createChats } from "@/actions/createChat";
import StopChatIcon from "./gptIcons/stopChatIcon";
import NewChatsRow from "./newChatsRow";
import MessagesRow from "./messagesRow";
import HomeForm from "./homeForm";
import { useOpenSideBar } from "@/utils/zustand";
import { cn } from "@/lib/utils";

type ChatRowProp = {
  user: {
    id: string;
    externalUserId: string;
    username: string;
    profile: string;
    createdAt: Date;
    updatedAt: Date;
  } | null;
  chatId?: string;
  newChat?: {
    id: string;
    title: string;
    userId: string;
    chats: {
      id: string;
      userId: string;
      newChatId: string;
      role: string;
      content: string;
      createdAt: Date;
      updatedAt: Date;
    }[];
    createdAt: Date;
    updatedAt: Date;
  } | null;
};

const ChatRow = ({ user, chatId, newChat }: ChatRowProp) => {
  const scrollRef = useRef<ElementRef<"div">>(null);
  const setOpensidebar = useOpenSideBar((state) => state.setOpenSidebar);
  const isOpenSidebar = useOpenSideBar((state) => state.isOpen);
  const setCloseSidebar = useOpenSideBar((state) => state.setCloseSidebar);
  const [scrollToBottom, setScrollToBottom] = useState(0);
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    append,
  } = useChat();
  const pathname = usePathname();

  useEffect(() => {
    (async () => {
      if (pathname === "/" && isLoading === false && messages.length !== 0) {
        await createNewChat(messages);
      }

      if (
        pathname === `/c/${chatId}` &&
        isLoading === false &&
        messages.length !== 0
      ) {
        await createChats(messages, chatId);
      }
    })();
  }, [pathname, isLoading, messages, chatId]);

  useEffect(() => {
    function handleScroll() {
      if (scrollRef.current) {
        const isBottom =
          scrollRef.current.scrollHeight -
          (scrollRef.current.clientHeight + scrollRef.current.scrollTop);

        setScrollToBottom(isBottom);
      }
    }

    const scrollReference = scrollRef.current;

    scrollReference?.addEventListener("scroll", handleScroll);

    return () => {
      scrollReference?.removeEventListener("scroll", handleScroll);
    };
  }, [messages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
    });
  }, [messages, scrollToBottom]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, []);

  return (
    <div
      className={cn(
        "mainSection flex flex-col min-h-[100dvh] duration-200",
        isOpenSidebar ? "md:ml-0 ml-[16rem]" : "md:ml-[16rem] ml-0"
      )}
    >
      <button
        type="button"
        onClick={() => setCloseSidebar()}
        className={cn(
          "fixed top-[.9rem] z-[200] group/skew group/bg duration-200 h-[2.2rem] w-[2.2rem] md:hidden flex flex-col items-center justify-center focus:ring-2 ring-white",
          isOpenSidebar ? "ml-[16rem] left-3" : "ml-0 left-[-4rem]"
        )}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="icon-md"
        >
          <path
            d="M6.34315 6.34338L17.6569 17.6571M17.6569 6.34338L6.34315 17.6571"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>
      </button>

      {!isOpenSidebar ? (
        <div
          onClick={() => setOpensidebar()}
          className="fixed left-0 inset-y-[46%] z-[200] group/skew group/bg duration-200 h-[3rem] w-[1.5rem] hidden md:flex flex-col items-center justify-center ml-[16rem]"
        >
          <div className="h-[.7rem] w-[.27rem] bg-zinc-400 rounded-t-lg flex items-center duration-100 group-hover/bg:bg-white mb-[-.1rem] group-hover/skew:-skew-x-[15deg]" />
          <div className="h-[.7rem] w-[.27rem] bg-zinc-400 rounded-b-lg flex items-center duration-100 group-hover/bg:bg-white mt-[-.1rem] group-hover/skew:skew-x-[15deg]" />
        </div>
      ) : (
        <div
          onClick={() => setCloseSidebar()}
          className="fixed left-0 inset-y-[46%] z-[200] group/skew group/bg duration-200 h-[3rem] w-[1.5rem] hidden md:flex flex-col items-center justify-center"
        >
          <div className="h-[.7rem] w-[.27rem] bg-zinc-400 rounded-t-lg flex items-center duration-100 group-hover/bg:bg-white mb-[-.1rem] -skew-x-[-15deg] ml-2" />
          <div className="h-[.7rem] w-[.27rem] bg-zinc-400 rounded-b-lg flex items-center duration-100 group-hover/bg:bg-white mt-[-.1rem] skew-x-[-15deg] ml-2" />
        </div>
      )}

      {pathname === "/" && messages.length === 0 ? (
        <HomeForm append={append} />
      ) : (
        <div ref={scrollRef} className="relative flex-1 overflow-auto">
          <div className="absolute inset-0 mx-auto max-w-[48rem] pt-16">
            <div className="flex flex-col gap-12 pb-14 px-5 md:px-10">
              {pathname === `/c/${chatId}` &&
                newChat?.chats.length !== 0 &&
                newChat?.chats.map((m) => (
                  <NewChatsRow key={m.id} m={m} user={user} />
                ))}

              {messages.map((m) => (
                <MessagesRow key={m.id} m={m} user={user} />
              ))}
            </div>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          if (e.keyCode === 13 && e.shiftKey) {
            return;
          }

          if (e.keyCode === 13) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
        className="relative flex flex-col justify-center items-center gap-2 mb-2 px-4"
      >
        {scrollToBottom > 0 && (
          <button
            onClick={() =>
              scrollRef.current?.scrollTo({
                top: scrollRef.current?.scrollHeight,
              })
            }
            className="absolute top-[-3rem] rounded-full bg-[#212121] border border-zinc-700 z-[10]"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="m-1 text-token-text-primary"
            >
              <path
                d="M17 13L12 18L7 13M12 6L12 17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </button>
        )}
        <div className="relative flex items-center w-full gap-2 max-w-[48rem] mx-auto">
          <TextareaAutosize
            placeholder="Message ChatGPT..."
            rows={1}
            value={input}
            onChange={handleInputChange}
            className="flex-1 rounded-2xl bg-transparent border border-[#424242] px-4 py-[14px] outline-none resize-none pr-14"
          />
          {isLoading ? (
            <StopChatIcon stop={stop} />
          ) : (
            <InputButton input={input} />
          )}
        </div>
        <p className="text-xs text-zinc-300 text-center">
          ChatGPT can make mistakes. Consider checking important information.
        </p>
      </form>
    </div>
  );
};

export default ChatRow;
