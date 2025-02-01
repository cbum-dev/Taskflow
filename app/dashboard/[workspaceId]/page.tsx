'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import { Card } from '@/components/ui/card';
import Image from 'next/image';

export default function HomePage() {
  const user = useAuthStore((state) => state.user);
  const access_token = useAuthStore((state) => state.access_token);
  const [workspaces, setWorkspaces] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const { data } = await axios.get('http://localhost:3001/api/workspace/user', {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
        setWorkspaces(data.data || []);

        if (data.data.length > 0) {
          fetchProjects(data.data[0].id); // Fetch projects of the first workspace by default
        }
      } catch (error) {
        console.error('Error fetching workspaces:', error);
      }
    };
    fetchWorkspaces();
  }, [access_token]);

  const fetchProjects = async (workspaceId) => {
    try {
      const { data } = await axios.get(`http://localhost:3001/api/projects/workspace/${workspaceId}`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      setProjects(data.data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  return (
    <div className="relative right-0 w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image 
          src="/dot1.svg" 
          alt="Background Dots"
          fill
          className="animate-pulse opacity-10 object-cover"
          priority
        />
      </div>
    </div>
  );
}
