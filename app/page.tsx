'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { useAuthStore } from '@/store/authStore';
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              One app to replace them all
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              All your tasks, docs, and projects. Together in one place.
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                className="px-8 py-6 text-lg bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => router.push(session ? '/dashboard' : '/api/auth/login')}
              >
                Get Started Free →
              </Button>
              <Button
                variant="outline"
                className="px-8 py-6 text-lg"
                onClick={() => router.push('/demo')}
              >
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-gray-900 to-transparent z-10 h-40 bottom-0"></div>
            <Image
              src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg"
              alt="Platform Preview"
              width={1200}
              height={675}
              className="rounded-lg shadow-2xl"
              priority
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything you need in one place</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Streamline your workflow with our all-in-one solution
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Task Management",
                description: "Organize and track all your tasks in one place",
                image: "https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg"
              },
              {
                title: "Team Collaboration",
                description: "Work together seamlessly with your team",
                image: "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg"
              },
              {
                title: "Project Tracking",
                description: "Monitor progress and stay on schedule",
                image: "https://images.pexels.com/photos/3183190/pexels-photo-3183190.jpeg"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  width={400}
                  height={300}
                  className="rounded-lg mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">TaskFlow</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Making team collaboration seamless and efficient.
              </p>
            </div>
            {[
              {
                title: "Product",
                links: ["Features", "Pricing", "Enterprise", "Security"]
              },
              {
                title: "Company",
                links: ["About", "Careers", "Blog", "Press"]
              },
              {
                title: "Resources",
                links: ["Documentation", "Help Center", "API", "Status"]
              }
            ].map((section, index) => (
              <div key={index}>
                <h4 className="font-semibold mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center text-gray-600 dark:text-gray-400">
            <p>© 2024 TaskFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}