"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AddMemberFormProps {
  onAddMember: (email: string) => Promise<boolean>; // callback
}

export default function AddMemberForm({ onAddMember }: AddMemberFormProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    const success = await onAddMember(email);
    if (success) {
      setEmail(""); // clear input after success
    }

    setIsLoading(false);
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
