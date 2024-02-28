import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import React from "react";
import { Toaster } from "sonner";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />
      <Sidebar />
      <Toaster position="top-center" />
      <div>{children}</div>
    </div>
  );
}
