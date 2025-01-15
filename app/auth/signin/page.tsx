"use client";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function SignIn() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-xs space-y-6">
        <h1 className="text-2xl font-bold text-center">Sign In</h1>
        <Button 
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full"
        >
          Sign in with Google
        </Button>
      </div>
    </div>
  );
} 