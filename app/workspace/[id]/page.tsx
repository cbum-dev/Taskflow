"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";
import AddMemberForm from "@/components/AddMemberForm";

interface Member {
  id: string;
  name: string;
  email: string;
}

interface Workspace {
  id: string;
  name: string;
  description?: string;
  members: Member[];
}

export default function WorkspaceDetails() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { user, access_token } = useAuthStore();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [members, setMembers] = useState<Member[]>([]);

  const addMember = async (email: string) => {
    if (!user) {
      console.log("You must be logged in to add a member.");
      return;
    }

    try {
      const response = await fetch(`https://json-schema-lint.vercel.app/api/workspace/${id}/add-member`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({ 
          workspaceId: id, 
          email: email 
        }),
      });

      if (response.ok) {
        const newMember = await response.json();
        setMembers([...members, newMember]);
        return true;
      } else {
        console.log("Error adding member. Try again.");
        return false;
      }
    } catch (error) {
      console.error("Error adding member:", error);
      return false;
    }
  };

  useEffect(() => {
    const fetchWorkspace = async () => {
      try {
        const response = await fetch(`https://json-schema-lint.vercel.app/api/workspace/${id}`, {
          headers: { Authorization: `Bearer ${access_token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setWorkspace(data.data);
          setMembers(data.data.members || []);
        }
      } catch (error) {
        console.error("Error fetching workspace:", error);
      }
    };

    if (user && access_token) fetchWorkspace();
  }, [id, user, access_token]);

  if (!workspace) return <p>Loading workspace...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>{workspace.name}</CardTitle>
        </CardHeader>
        <CardContent>
          {workspace.description && <p>{workspace.description}</p>}          
          <h3 className="mt-4 text-lg font-semibold">Add Member</h3>
          <AddMemberForm 
            workspaceId={id} 
            // @ts-ignore
            onAddMember={addMember} 
          />
          
          <h3 className="mt-4 text-lg font-semibold">Members</h3>
          <ul className="list-disc pl-5">
            {members.map((member) => (
              <li key={member.id}>
                {member.name} ({member.email})
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}