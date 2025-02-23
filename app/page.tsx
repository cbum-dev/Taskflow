'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useAuthStore } from '@/store/authStore';
import Image from 'next/image';

interface Workspace {
  id: string;
  name: string;
  description?: string;
}

export default function HomePage() {
  const { data: session } = useSession();
  const access_token = useAuthStore((state) => state.access_token);
  const router = useRouter();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const { data } = await axios.get('https://json-schema-lint-zzda.vercel.app/api/workspace/user', {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
        setWorkspaces(data.data || []);
      } catch (error) {
        console.error('Error fetching workspaces:', error);
      }
    };
    fetchWorkspaces();
  }, [access_token]);

  return (
    <div className="relative max-h-[calc(100vh-56px)] min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="absolute inset-0 z-0 overflow-hidden">
      <Image 
          src="/dot1.svg" 
          alt="Background Dots"
          fill
          className="animate-pulse opacity-10 object-cover"
          priority
        />
              </div>

      
      <div className="relative z-10 flex flex-col items-center text-center py-16">
        <h1 className="text-7xl font-extrabold mb-4 text-orange-500 ">TaskFlow</h1>
        <p className="text-lg text-gray-300 max-w-2xl">
          Organize your work efficiently with TaskFlow. Create, manage, and track your workspaces and projects seamlessly.
          {session?.user?.email}kjk
{session?.expires}
        </p>
        <Button className="mt-6 px-8 py-3 text-lg bg-blue-600 hover:bg-blue-700" onClick={() => router.push('/dashboard')}>Get Started</Button>
      </div>
      
      <div className="relative z-10 w-full max-w-5xl p-6">
        <h2 className="text-3xl font-bold mb-6 text-center">Select a Workspace</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workspaces.map((workspace) => (
            <div key={workspace.id} className="p-6 bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
              <h3 className="text-xl font-semibold mb-2">{workspace.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{workspace.description || 'No description available.'}</p>
              <Button className="w-full bg-blue-500 hover:bg-blue-600" onClick={() => router.push(`/dashboard/${workspace.id}`)}>
                Open Workspace
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
