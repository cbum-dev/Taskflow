"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";

export default function AddMemberForm({ workspaceId, setMembers }) {
  const [email, setEmail] = useState("");
  const { user,access_token } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addMember = async () => {
    setLoading(true);
    setError("");

    const response = await fetch(`http://localhost:3001/api/workspace/${workspaceId}/add-member`, {
      method: "PUT",
      body: JSON.stringify({ email }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });

    setLoading(false);

    if (response.ok) {
      const newMember = await response.json();
      setMembers((prev) => [...prev, newMember.data]);
      setEmail(""); // Clear input
    } else {
      setError("Error adding member. Try again.");
    }
  };

  return (
    <div className="flex space-x-2">
      <Input type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Button onClick={addMember} disabled={loading}>
        {loading ? "Adding..." : "Add"}
      </Button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
