import React from "react";

export default function Navbar() {
  return (
    <div className="fixed inset-x-0 flex items-center justify-between ml-[16rem] h-14 bg-[#212121] px-4 z-[100]">
      <div>
        <h1 className="font-medium text-lg">
          ChatGPT <span className="text-zinc-400">3.5</span>
        </h1>
      </div>
    </div>
  );
}
