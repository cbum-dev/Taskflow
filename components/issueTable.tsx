"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { socketInstance as socket } from "@/lib/socket";
import { useAuthStore } from "@/store/authStore";
import { filterAndSortIssues, normalizeIssue, upsertIssue } from "./utils";
import IssueSidebar from "./IssueSidebar";
import IssueTableControls from "./IssueTableControls";
import { Checkbox } from "@/components/ui/checkbox";
import api from "@/services/api";
import { Issue } from "@/types/types";
import { toast } from "sonner";

interface IssueTableProps {
  issues: Issue[];
  setIssues: React.Dispatch<React.SetStateAction<Issue[]>>;
}

export default function IssueTable({ issues, setIssues }: IssueTableProps) {
  const { projectId, workspaceId } = useParams();
  const { access_token } = useAuthStore();
  const [workspaceMembers, setWorkspaceMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState("");
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sidebarIssue, setSidebarIssue] = useState(null);

  useEffect(() => {
    if (!access_token || !projectId || !workspaceId) return;

    api
      .get(`/workspace/${workspaceId}/members`)
      .then((res) => setWorkspaceMembers(res.data.data || []))
      .catch(console.error);

    socket.on("issueCreated", (newIssue: Issue) =>
      setIssues((prev) => upsertIssue(prev, normalizeIssue(newIssue)))
    );
    socket.on("issueUpdated", (updatedIssue) =>
      setIssues((prev) => prev.map((i) => (i.id === updatedIssue.id ? updatedIssue : i)))
    );
    socket.on("issueDeleted", (deleted) => {
      const id = typeof deleted === "object" ? deleted.id : deleted;
      setIssues((prev) => prev.filter((i) => i.id !== id));
    });



    return () => {
      socket.off("issueCreated");
      socket.off("issueUpdated");
      socket.off("issueDeleted");
    };
  }, [access_token, projectId, workspaceId, setIssues]);

  const displayedIssues = useMemo(
    () =>
      filterAndSortIssues(
        issues,
        search,
        statusFilter,
        assigneeFilter,
        // @ts-ignore
        sortBy,
        sortOrder
      ),
    [issues, search, statusFilter, assigneeFilter, sortBy, sortOrder]
  );

  const onCheckboxToggle = async (issue: Issue) => {
    const newStatus = issue.status === "DONE" ? "IN_PROGRESS" : "DONE";
    try {
      await api.put(`/issues/${issue.id}`, { status: newStatus });
      socket.emit("issueUpdated", { ...issue, status: newStatus });
      toast("Issue status updated", {
        description: "You can click to start working on your updated issue.",
        action: {
          label: "Close",
          onClick: () => console.log("Close"),
        },
      });
    } catch (e) {
      toast("Failed to update issue", {
        description: "Please try again later.",
        action: {
          label: "Close",
          onClick: () => console.log("Close"),
        },
      });
      console.error(e);
    }
  };


  return (
    <div className="h-full flex">
      <div
        className={`transition-all duration-300 flex flex-col h-full ${sidebarIssue ? "w-[calc(100%-400px)]" : "w-full"
          }`}
      >
        <IssueTableControls
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          assigneeFilter={assigneeFilter}
          setAssigneeFilter={setAssigneeFilter}
          members={workspaceMembers}
          sortBy={sortBy}
          sortOrder={sortOrder}
          setSortBy={setSortBy}
          setSortOrder={setSortOrder}
        />
        <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-250px)] rounded border border-gray-200 dark:border-gray-700 mt-4" style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#CBD5E0 #F7FAFC'
        }}>
          <table className="min-w-full text-left">
            <thead className="sticky top-0 bg-gray-50 dark:bg-gray-800 z-10">
              <tr>
                <th className="p-2 w-10"> </th>
                <th className="p-2">Title</th>
                <th className="p-2">Status</th>
                <th className="p-2">Priority</th>
                <th className="p-2">Assignee</th>
                <th className="p-2">Due Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {displayedIssues.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-6 text-gray-500">
                    No issues found.
                  </td>
                </tr>
              ) : (
                displayedIssues.map((issue: Issue) => (
                  <tr
                    key={issue.id}
                    onClick={() => setSidebarIssue(issue as any)}
                    className="hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
                  >
                    <td
                      className="p-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCheckboxToggle(issue);
                      }}
                    >
                      <Checkbox checked={issue.status === "DONE"} />
                    </td>
                    <td className="p-2 font-medium">{issue.title}</td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${issue.status === "DONE"
                          ? "bg-green-100 text-green-700"
                          : issue.status === "IN_PROGRESS"
                            ? "bg-blue-100 text-blue-700"
                            : issue.status === "IN_REVIEW"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                      >
                        {issue.status}
                      </span>
                    </td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${issue.priority === "URGENT"
                          ? "bg-red-100 text-red-700"
                          : issue.priority === "HIGH"
                            ? "bg-orange-100 text-orange-700"
                            : issue.priority === "MEDIUM"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                          }`}
                      >
                        {issue.priority}
                      </span>
                    </td>
                    <td className="p-2">
                      {typeof issue.assignee === "object" && issue.assignee !== null && "name" in issue.assignee ? (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs">
                            {(issue.assignee as { name: string }).name[0]}
                          </div>
                          {(issue.assignee as { name: string }).name}
                        </div>
                      ) : typeof issue.assignee === "string" && issue.assignee ? (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs">
                            {issue.assignee[0]}
                          </div>
                          {issue.assignee}
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="p-2 text-sm text-gray-600">
                      {issue.dueDate
                        ? new Date(issue.dueDate).toLocaleDateString()
                        : "N/A"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {sidebarIssue && (
          <IssueSidebar
            issue={sidebarIssue}
            onClose={() => setSidebarIssue(null)}
            members={workspaceMembers}
            socket={socket}
          />
      )}

    </div>
  );
}
