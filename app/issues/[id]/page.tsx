"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";
import { FaSpinner } from "react-icons/fa";

interface Issue {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function IssueDetailPage() {
  const { id } = useParams();
  const { user, access_token } = useAuthStore();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/issues/${id}`, {
          headers: { Authorization: `Bearer ${access_token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setIssue(data.data);
        }
      } catch (error) {
        console.error("Error fetching issue:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchIssue();
  }, [id, user, access_token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!issue) {
    return <p className="text-center py-8">Issue not found</p>;
  }

  const statusVariant = () => {
    switch (issue.status.toLowerCase()) {
      case 'open': return 'default';
      case 'in progress': return 'secondary';
      case 'closed': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card className="shadow-sm">
        <CardHeader className="border-b">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{issue.title}</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={statusVariant()}>{issue.status}</Badge>
                <CardDescription className="text-sm text-muted-foreground">
                  Created: {new Date(issue.createdAt).toLocaleDateString()}
                </CardDescription>
                {issue.updatedAt !== issue.createdAt && (
                  <CardDescription className="text-sm text-muted-foreground">
                    | Updated: {new Date(issue.updatedAt).toLocaleDateString()}
                  </CardDescription>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="prose dark:prose-invert max-w-none">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="whitespace-pre-line">{issue.description}</p>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Created</CardDescription>
                <CardTitle className="text-lg">
                  {new Date(issue.createdAt).toLocaleString()}
                </CardTitle>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Last Updated</CardDescription>
                <CardTitle className="text-lg">
                  {new Date(issue.updatedAt).toLocaleString()}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}