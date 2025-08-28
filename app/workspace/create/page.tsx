"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";
import api from "@/services/api";

export default function CreateWorkspacePage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuthStore();
  const router = useRouter();

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!user) {
      setError("You must be logged in to create a workspace.");
      setLoading(false);
      return;
    }

    const { data } = await api.post("/workspace", { name, description });

    setLoading(false);

    if (data) {
      router.push(`/workspace/${data.data.id}`);
    } else {
      setError("Error creating workspace. Try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-[400px] shadow-md">
        <CardHeader>
          <CardTitle className="text-center text-xl">Create Workspace</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateWorkspace} className="space-y-4">
            <Input
              type="text"
              placeholder="Workspace Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
            <Input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading || !name}>
              {loading ? "Creating..." : "Create Workspace"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
