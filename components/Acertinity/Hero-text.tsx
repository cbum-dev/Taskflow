"use client";
import { TypewriterEffectSmooth } from "./Typewriter";

export function TypewriterEffectSmoothDemo() {
  const words = [
    {
      text: "Get",
    },
    {
      text: "your work",
    },
    {
      text: "done",
    },
    {
      text: "with",
    },
    {
      text: "DoIt.",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];
  return (
    <div className="flex flex-col items-center justify-center ">
      <TypewriterEffectSmooth words={words} />
      <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mb-8">
          Organize your work efficiently with TaskFlow. Create, manage, and track your workspaces and projects seamlessly.
        </p>
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
        <button className="w-40 cursor-pointer h-10 rounded-xl bg-black border dark:border-white border-transparent text-white text-sm">
          Join now
        </button>
        <button className="w-40 h-10 rounded-xl bg-white text-black border border-black  text-sm">
          Signup
        </button>
      </div>
    </div>
  );
}
