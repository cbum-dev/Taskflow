import { cn } from "@/lib/utils";
import React from "react";
import { TypewriterEffectSmoothDemo } from "./Hero-text";

export function GridSmallBackgroundDemo({}) {

  return (
    <div className="relative min-h-screen flex w-full items-center justify-center bg-white dark:bg-black">
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:20px_20px]",
          "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
        )}
      />
      {/* Radial gradient for the container to give a faded look */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>
      <div className="relative z-10 flex flex-col items-center text-center px-4 py-16 w-full">
        <TypewriterEffectSmoothDemo />{" "}

        

        {/* <Button 
          className="mt-2 px-8 py-3 text-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 dark:from-orange-500 dark:to-orange-600 dark:hover:from-orange-600 dark:hover:to-orange-700 text-white shadow-lg transition-all duration-300 transform hover:scale-105"
          onClick={() => router.push(session ? '/dashboard' : '/login')}
        >
          {session ? 'Go to Dashboard' : 'Get Started'}
        </Button> */}
      </div>
    </div>
  );
}
