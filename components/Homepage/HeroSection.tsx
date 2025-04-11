import React from "react";
import { Button } from "../ui/button";
import { useRouter } from 'next/navigation';

function HeroSection() {
  const router = useRouter();

  return (
    <section className="py-20 px-4 text-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 relative w-full">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-orange-400 dark:to-yellow-400">
          Magic happens when your work is connected
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto">
          All your work, finally connected. TaskFlow weaves together all your
          Tasks, Docs, and Chat for a truly seamless experience.
        </p>
        <div className="flex gap-4 justify-center">
          <Button
            className="px-8 py-4 text-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
            onClick={() => router.push("/signup")}
          >
            Get Started
          </Button>
          <Button
            variant="outline"
            className="px-8 py-4 text-lg border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700"
            onClick={() => router.push("/demo")}
          >
            See Demo
          </Button>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
