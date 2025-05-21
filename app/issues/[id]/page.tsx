"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: { name: string };
}

interface Issue {
  id: string;
  title: string;
  description: string;
  status: string;
  comments: Comment[];
}

export default function IssueDetailPage() {
  const { id } = useParams(); // Get issue ID from URL
  const { user,access_token } = useAuthStore();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIssue = async () => {
      const response = await fetch(`http://localhost:3001/api/issues/${id}`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setIssue(data.data);
      }
      setLoading(false);
    };

    if (user) fetchIssue();
  }, [id, user, access_token]);

  const addComment = async () => {
    if (!newComment.trim()) return;
    const response = await fetch(`http://localhost:3001/api/issues/${id}/comments`, {
      method: "POST",
      body: JSON.stringify({ content: newComment }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (response.ok) {
      const newCommentData = await response.json();
      setIssue((prev) => prev ? { ...prev, comments: [newCommentData.data, ...prev.comments] } : prev);
      setNewComment("");
    }
  };

  if (loading) return <p>Loading issue details...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>{issue?.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{issue?.description}</p>

          <h3 className="mt-4 text-lg font-semibold">Status</h3>
          <p>{issue?.status}</p>

          <h3 className="mt-4 text-lg font-semibold">Comments</h3>
          <ul className="space-y-2">
            {issue?.comments.map((comment) => (
              <li key={comment.id} className="p-2 border rounded">
                <p className="font-semibold">{comment.user.name}</p>
                <p className="text-sm">{comment.content}</p>
                <p className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</p>
              </li>
            ))}
          </ul>

          <h3 className="mt-4 text-lg font-semibold">Add Comment</h3>
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button onClick={addComment}>Add</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
