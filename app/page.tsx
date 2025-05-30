'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useAuthStore } from '@/store/authStore';
import Image from 'next/image';
import HeroSection from '@/components/Homepage/HeroSection';
import ConnectedWorkSection from '@/components/Homepage/ConnectedWorkSection';
import { GridSmallBackgroundDemo } from '@/components/Acertinity/GridBg';
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
        const { data } = await axios.get('http://localhost:3001/api/workspace/user', {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
        setWorkspaces(data.data || []);
      } catch (error) {
        console.error('Error fetching workspaces:', error);
      }
    };
    if (access_token) {
      fetchWorkspaces();
    }
  }, [access_token]);

  return (
    <div className="relative h-[100vh-56px] flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white transition-colors duration-300 overflow-scroll">
      <GridSmallBackgroundDemo  />


      
      {session && (
        <div className="relative z-10 w-full max-w-5xl p-6 mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 dark:from-orange-400 dark:to-yellow-400">
            Your Workspaces
          </h2>
          {workspaces.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workspaces.map((workspace) => (
                <div 
                  key={workspace.id} 
                  className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-orange-400"
                >
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{workspace.name}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                    {workspace.description || 'No description available.'}
                  </p>
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 dark:from-orange-500 dark:to-orange-600 dark:hover:from-orange-600 dark:hover:to-orange-700 text-white"
                    onClick={() => router.push(`/dashboard/${workspace.id}`)}
                  >
                    Open Workspace
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                You don&apos;t have any workspaces yet. Create your first workspace to get started!
              </p>
              <Button 
                className="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 dark:from-orange-500 dark:to-orange-600 dark:hover:from-orange-600 dark:hover:to-orange-700"
                onClick={() => router.push('/dashboard')}
              >
                Create Workspace
              </Button>
            </div>
          )}
        </div>
      )}
      <HeroSection/>
      <ConnectedWorkSection/>
    </div>
  );
}