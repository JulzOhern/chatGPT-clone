import Image from "next/image";
import React from "react";
import AssistantIcon from "./gptIcons/assistantIcon";

type MessagesRowProp = {
  m: any;
  user: {
    id: string;
    externalUserId: string;
    username: string;
    profile: string;
    createdAt: Date;
    updatedAt: Date;
  } | null;
};

export default function MessagesRow({ m, user }: MessagesRowProp) {
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
          <div className="flex flex-col gap-1">
            <p className="font-medium">ChatGPT</p>
            <p className="leading-7">{m.content}</p>
          </div>
        </div>
      )}
    </div>
  );
}
