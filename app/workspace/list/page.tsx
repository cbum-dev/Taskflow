"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";

export default function WorkspacesList() {
  const [workspaces, setWorkspaces] = useState([]);
  const { user,access_token } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const fetchWorkspaces = async () => {
      const response = await fetch("http://localhost:3001/api/workspace/user", {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setWorkspaces(data.data);
      }
    };

    if (user) fetchWorkspaces();
  }, [user]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Workspaces</h1>
      {workspaces.length === 0 ? (
        <p>No workspaces found. Create one to get started.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {workspaces.map((workspace) => (
            <Card key={workspace.id} className="shadow-md">
              <CardHeader>
                <CardTitle>{workspace.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{workspace.description}</p>
                <Button onClick={() => router.push(`/workspace/${workspace.id}`)} className="mt-2 w-full">
                  Manage Workspace
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
