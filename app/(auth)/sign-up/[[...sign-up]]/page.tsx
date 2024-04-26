import React from "react";
import { SignUp } from "@clerk/nextjs";

export default function SingUpPage() {
  return <SignUp path="/sign-up" />;
}
