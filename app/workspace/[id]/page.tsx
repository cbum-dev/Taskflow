"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";
import AddMemberForm from "@/components/AddMemberForm";
import InviteLink from "@/components/InviteLink";

export default function WorkspaceDetails() {
  const { id } = useParams(); // Get workspace ID from URL
  const { user,access_token } = useAuthStore();
  const [workspace, setWorkspace] = useState(null);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchWorkspace = async () => {
      const response = await fetch(`http://localhost:3001/api/workspace/${id}`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setWorkspace(data.data);
        setMembers(data.data.members);
      }
    };

    if (user) fetchWorkspace();
  }, [id, user]);

  if (!workspace) return <p>Loading workspace...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>{workspace.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{workspace.description}</p>

          <h3 className="mt-4 text-lg font-semibold">Invite Members</h3>
          <InviteLink workspaceId={id} />

          <h3 className="mt-4 text-lg font-semibold">Add Member</h3>
          <AddMemberForm workspaceId={id} setMembers={setMembers} />

          <h3 className="mt-4 text-lg font-semibold">Members</h3>
          <ul className="list-disc pl-5">
            {members.map((member) => (
              <li key={member.id}>{member.name} ({member.email})</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
