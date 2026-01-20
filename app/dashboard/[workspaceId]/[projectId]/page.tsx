"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import IssueTable from "@/components/issueTable";
import KanbanBoard from "@/components/KanbanBoard";
import CreateIssue from "@/components/CreateIssuesForm";
import { Issue } from "@/types/types";
import api from "@/services/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LayoutGrid,
  Table,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
} from "lucide-react";
import { socketInstance as socket } from "@/lib/socket";
import { normalizeIssue, upsertIssue } from "@/components/utils";

export default function IssuesPage() {
  const { access_token } = useAuthStore();
  const { projectId } = useParams();
  const [issues, setIssuesState] = useState<Issue[]>([]);
  const [view, setView] = useState<"table" | "kanban">("table");

  const setIssues = useCallback((action: React.SetStateAction<Issue[]>) => {
    setIssuesState(action);
  }, []);

  const fetchIssues = useCallback(async () => {
    try {
      const { data } = await api.get(`/issues/project/${projectId}`);
      const normalizedIssues = (data.data || []).map((issue: Issue) => normalizeIssue(issue));
      setIssues(normalizedIssues);
    } catch (error) {
      console.error("Error fetching issues:", error);
    }
  }, [projectId, setIssues]);

  useEffect(() => {
    if (access_token && projectId) {
      fetchIssues();
    }

    socket.on("issueCreated", (newIssue: Issue) => {
      setIssues((prev) => upsertIssue(prev, newIssue));
    });

    socket.on("issueUpdated", (updatedIssue: Issue) => {
      setIssues((prev) =>
        prev.map((issue) =>
          issue.id === updatedIssue.id ? normalizeIssue(updatedIssue) : issue
        )
      );
    });

    socket.on("issueDeleted", (deletedId: string | Issue) => {
      const id = typeof deletedId === "object" ? deletedId.id : deletedId;
      setIssues((prev) => prev.filter((issue) => issue.id !== id));
    });

    return () => {
      socket.off("issueCreated");
      socket.off("issueUpdated");
      socket.off("issueDeleted");
    };
  }, [access_token, projectId, fetchIssues, setIssues]);

  // Statistics
  const stats = {
    total: issues.length,
    todo: issues.filter((i) => i.status === "TODO").length,
    inProgress: issues.filter((i) => i.status === "IN_PROGRESS").length,
    inReview: issues.filter((i) => i.status === "IN_REVIEW").length,
    done: issues.filter((i) => i.status === "DONE").length,
    highPriority: issues.filter((i) => i.priority === "HIGH").length,
    assigned: issues.filter((i) => i.assignee).length,
  };

  const completionRate =
    stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

  return (
    <div className="min-h-screen w-full ">
      <div className="px-6 space-y-4">
        {/* Header Section */}
        <div className="p-2">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-neutral-100 dark:to-neutral-400 bg-clip-text text-transparent">
                Project Issues
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400">
                Manage and track your project tasks efficiently
              </p>
            </div>

            <div className="flex items-center gap-3">
              <CreateIssue setIssues={setIssues} />
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                    {stats.total}
                  </p>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">
                    Total Issues
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-neutral-100 dark:bg-neutral-700 rounded-lg">
                  <Clock className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                    {stats.todo}
                  </p>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">
                    To Do
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                    {stats.inProgress}
                  </p>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">
                    In Progress
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                    {stats.done}
                  </p>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">
                    Completed
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                    {stats.highPriority}
                  </p>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">
                    High Priority
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                      {completionRate}%
                    </p>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">
                      Complete
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-700 overflow-hidden w-full">
          <Tabs
            value={view}
            onValueChange={(value) => setView(value as "table" | "kanban")}
            className="w-full"
          >
            <div className="border-b border-neutral-200 dark:border-neutral-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <TabsList className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-600 p-1">
                  <TabsTrigger
                    value="table"
                    className="gap-2 data-[state=active]:bg-neutral-900 data-[state=active]:text-white dark:data-[state=active]:bg-neutral-100 dark:data-[state=active]:text-neutral-900"
                  >
                    <Table className="w-4 h-4" />
                    Table View
                  </TabsTrigger>
                  <TabsTrigger
                    value="kanban"
                    className="gap-2 data-[state=active]:bg-neutral-900 data-[state=active]:text-white dark:data-[state=active]:bg-neutral-100 dark:data-[state=active]:text-neutral-900"
                  >
                    <LayoutGrid className="w-4 h-4" />
                    Kanban Board
                  </TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-3">
                  <Badge
                    variant="secondary"
                    className="bg-neutral-200 dark:bg-neutral-600 text-neutral-700 dark:text-neutral-300"
                  >
                    {issues.length} issues
                  </Badge>
                  <Badge
                    variant="secondary"
                    className={`
                      ${
                        completionRate >= 75
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : ""
                      }
                      ${
                        completionRate >= 50 && completionRate < 75
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                          : ""
                      }
                      ${
                        completionRate < 50
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          : ""
                      }
                    `}
                  >
                    {completionRate}% Complete
                  </Badge>
                </div>
              </div>
            </div>

            <TabsContent value="table" className="m-0">
              <div className="p-4 h-[calc(100vh-350px)] min-h-[500px]">
                <IssueTable
                  issues={issues}
                  setIssues={setIssues}
                />
              </div>
            </TabsContent>
            <TabsContent value="kanban" className="m-0 h-[calc(100vh-350px)] min-h-[500px]">
              <div className="p-4 h-full">
                <KanbanBoard 
                  issues={issues} 
                  onUpdateIssues={setIssues} 
                  // className="h-full"
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
