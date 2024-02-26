import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import React from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />
      <Sidebar />
      <div className="ml-[16rem]">{children}</div>
    </div>
  );
}
