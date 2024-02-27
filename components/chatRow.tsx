"use client";

import React, { ElementRef, useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import InputButton from "./gptIcons/inputButton";
import { useChat } from "ai/react";
import Image from "next/image";
import AssistantIcon from "./gptIcons/assistantIcon";
import { usePathname } from "next/navigation";
import GptHomeIcon from "./gptIcons/gptHomeIcon";
import { createNewChat } from "@/actions/newChat";
import { createChats } from "@/actions/createChat";
import StopChatIcon from "./gptIcons/stopChatIcon";
import NewChatsRow from "./newChatsRow";
import MessagesRow from "./messagesRow";

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
  const [scrollToBottom, setScrollToBottom] = useState(0);
  const { messages, input, handleInputChange, handleSubmit, isLoading, stop } =
    useChat();
  const pathname = usePathname();

  useEffect(() => {
    (async () => {
      if (pathname === "/" && isLoading === false && messages.length !== 0) {
        console.log(isLoading);

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
  }, [pathname, isLoading, messages]);

  useEffect(() => {
    function handleScroll() {
      const isBottom =
        scrollRef.current!.scrollHeight -
        (scrollRef.current!.clientHeight + scrollRef.current!.scrollTop);

      setScrollToBottom(isBottom);
    }

    scrollRef.current?.addEventListener("scroll", handleScroll);

    return () => {
      scrollRef.current?.removeEventListener("scroll", handleScroll);
    };
  }, [messages]);

  useEffect(() => {
    if (scrollToBottom === 0) {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
      });
    }
  }, [messages, scrollToBottom]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {pathname === "/" && messages.length === 0 ? (
        <div className="relative flex-1 overflow-auto">
          <div className="absolute inset-0 mx-auto max-w-[48rem] pt-16">
            <div className="flex items-center justify-center flex-col gap-2 pb-14 px-10 h-full">
              <GptHomeIcon />
            </div>
          </div>
        </div>
      ) : (
        <div ref={scrollRef} className="relative flex-1 overflow-auto">
          <div className="absolute inset-0 mx-auto max-w-[48rem] pt-16">
            <div className="flex flex-col gap-12 pb-14 px-10">
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

      <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-2 px-4">
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
