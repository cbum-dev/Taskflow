
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/services/api";

interface Member {
  id: string;
  name: string;
  email: string;
}

interface AddMemberFormProps {
  workspaceId: string;
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
}

export default function AddMemberForm({ workspaceId, setMembers }: AddMemberFormProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    
    try {
      const { data } = await api.put(`/workspace/${workspaceId}/add-member`, { email });
      setMembers(prev => [...prev, data.member]);
      setEmail("");
    } catch (error) {
      console.error("Error adding member:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-2 mb-4">
      <Input
        type="email"
        placeholder="member@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Adding..." : "Add"}
      </Button>
    </form>
  );
}
