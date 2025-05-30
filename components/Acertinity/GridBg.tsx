import { cn } from "@/lib/utils";
import React from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import { TypewriterEffectSmoothDemo } from "./Hero-text";

export function GridSmallBackgroundDemo({}) {
    const { data: session } = useSession();

const router = useRouter();

  return (
    <div className="relative flex h-[50rem] w-full items-center justify-center bg-white dark:bg-black">
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:20px_20px]",
          "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
        )}
      />
      {/* Radial gradient for the container to give a faded look */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>
      <div className="relative z-10 flex flex-col items-center text-center px-4 py-16 w-full">
        <TypewriterEffectSmoothDemo/>
        <h1 className="text-6xl md:text-7xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-orange-500 dark:to-yellow-500">
          TaskFlow
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mb-8">
          Organize your work efficiently with TaskFlow. Create, manage, and track your workspaces and projects seamlessly.
        </p>
        <Image className=' invert-0' src="/dot1.svg" alt="Background Dots" width={100} height={100} />
        <Button 
          className="mt-2 px-8 py-3 text-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 dark:from-orange-500 dark:to-orange-600 dark:hover:from-orange-600 dark:hover:to-orange-700 text-white shadow-lg transition-all duration-300 transform hover:scale-105"
          onClick={() => router.push(session ? '/dashboard' : '/login')}
        >
          {session ? 'Go to Dashboard' : 'Get Started'}
        </Button>
      </div>
      
    </div>
  );
}
