"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";
import { PlusIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import api from "@/services/api";
interface Workspace {
  id: string;
  name: string;
  description: string;
}

export default function WorkspacesList() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, access_token } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const { data } = await api.get("/workspace/user");
        setWorkspaces(data.data);
      } catch (error) {
        console.error("Failed to fetch workspaces:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchWorkspaces();
  }, [user, access_token]);

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mt-14 mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-4 w-2/3 mb-6" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mt-14">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Your Workspaces
        </h1>
        <Link href="/workspace/create">        <Button
          onClick={() => router.push("/workspace/new")}
          className="gap-2"
        >
          <PlusIcon className="w-4 h-4" />
          New Workspace
        </Button>
          </Link>

      </div>

      {workspaces.length === 0 ? (
        <Card className="text-center py-12 border-dashed border-2">
          <CardContent>
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <PlusIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                No workspaces found
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
                Create your first workspace to start collaborating with your team
              </p>
              <Button
                onClick={() => router.push("/workspace/create")}
                className="mt-4"
              >
                Create Workspace
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workspaces.map((workspace) => (
            <Card
              key={workspace.id}
              className="hover:shadow-lg transition-shadow duration-200 border-gray-200 dark:border-gray-700"
            >
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 dark:text-white">
                  {workspace.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {workspace.description || "No description provided"}
                </p>
                <div className="flex gap-2">
                <Link href={`/dashboard/${workspace.id}`}>                <Button
                  onClick={() => router.push(`/workspace/${workspace.id}`)}
                  className="w-full dark:text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                >
                  Manage Workspace
                </Button></Link>
                <Button
                  onClick={() => router.push(`/workspace/${workspace.id}`)}
                  className="w-full"
                >
                  Add Members
                </Button>
                </div>


              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}