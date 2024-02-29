import Image from "next/image";
import React, { useEffect, useState } from "react";
import AssistantIcon from "./gptIcons/assistantIcon";
import { PrismAsync as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";
import ClipboardIcon from "./gptIcons/clipboardIcon";

type NewChatsRowProp = {
  m: {
    id: string;
    userId: string;
    newChatId: string;
    role: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
  };
  user: {
    id: string;
    externalUserId: string;
    username: string;
    profile: string;
    createdAt: Date;
    updatedAt: Date;
  } | null;
};

export default function NewChatsRow({ m, user }: NewChatsRowProp) {
  const codeBlockRegex = /```(\w+)\n([\s\S]*?)\n```/;
  const segments = m.content.split(codeBlockRegex) || "";
  const [copied, setCopied] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (copied === m.id) {
        setCopied("");
      }
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, [copied, m.id]);

  return (
    <div key={m.id} className="whitespace-pre-wrap">
      {m.role === "user" ? (
        <div className="flex gap-3">
          <div className="shrink-0">
            <Image
              src={user?.profile || ""}
              alt="profile"
              width={100}
              height={100}
              priority
              className="w-6 h-6 rounded-full"
            />
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-medium">You</p>
            <p>{m.content}</p>
          </div>
        </div>
      ) : (
        <div className="flex gap-3">
          <div className="shrink-0">
            <AssistantIcon />
          </div>
          <div className="flex flex-col flex-1 leading-7">
            <p className="font-medium">ChatGPT</p>
            <ReactMarkdown
              components={{
                code: ({
                  node,
                  inline,
                  className,
                  children,
                  ...props
                }: any) => {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <div className="relative mt-10 mb-2 ">
                      <div className="absolute inset-x-0 top-[-1.4rem] flex items-center justify-between bg-[#2f2f2f] rounded-t py-2 px-4">
                        <p className="text-xs text-zinc-400">{match[1]}</p>

                        <button
                          onClick={() => {
                            setCopied(m.id === copied ? "" : m.id);
                            navigator.clipboard.writeText(segments[2]);
                          }}
                          className="text-xs text-zinc-400"
                        >
                          {copied ? (
                            <span className="flex items-center gap-1">
                              Copied!
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <ClipboardIcon />
                              Copy code
                            </span>
                          )}
                        </button>
                      </div>
                      <div className="flex">
                        <SyntaxHighlighter
                          style={atomDark}
                          customStyle={{ width: 0, flex: 1 }}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      </div>
                    </div>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {m.content}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
