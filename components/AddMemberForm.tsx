
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/authStore";

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
  const { access_token } = useAuthStore();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch(`https://json-schema-lint.vercel.app/api/workspace/${workspaceId}/add-member`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({ workspaceId, email }),
      });
      
      if (response.ok) {
        const data = await response.json();
        // Add the new member to the members list
        setMembers(prev => [...prev, data.member]);
        setEmail("");
      } else {
        const error = await response.json();
        console.error("Error adding member:", error);
      }
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
