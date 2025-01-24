"use client";
import React from "react";
import LoginButton from "@/components/authComponents/signIn";
import LogoutButton from "@/components/authComponents/signOut";
import { useAuthStore } from "@/store/authStore";

function Page() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (!isAuthenticated)
    return (
      <>
        Please log in.
        <LoginButton />
      </>
    );
  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <p>Email: {user.email}</p>
      <LogoutButton />
    </div>
  );
}

export default Page;
