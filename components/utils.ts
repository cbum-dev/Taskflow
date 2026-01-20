// @ts-nocheck
import { Issue } from "@/types/types";

export interface Assignee {
  id: string;
  name: string;
}

export interface IssueFilterSortOptions {
  search?: string;
  statusFilter?: string;
  assigneeFilter?: string;
  sortBy?: "title" | "status" | "priority" | "assignee" | "dueDate";
  sortOrder?: "asc" | "desc";
}

export function filterAndSortIssues(
  issues: Issue[],
  search?: string,
  statusFilter?: string,
  assigneeFilter?: string,
  sortBy?: "title" | "status" | "priority" | "assignee" | "dueDate",
  sortOrder?: "asc" | "desc"
): Issue[] {
  let data = issues;

  if (search?.trim()) {
    data = data.filter((i) =>
      i.title.toLowerCase().includes(search.trim().toLowerCase())
    );
  }
  if (statusFilter) {
    data = data.filter((i) => i.status === statusFilter);
  }
  if (assigneeFilter) {
    data = data.filter((i) => i.assignee?.id === assigneeFilter);
  }

  if (sortBy) {
    data = [...data].sort((a, b) => {
      let v1: any, v2: any;
      switch (sortBy) {
        case "title":
          v1 = a.title.toLowerCase();
          v2 = b.title.toLowerCase();
          return sortOrder === "asc"
            ? v1.localeCompare(v2)
            : v2.localeCompare(v1);
        case "status":
          v1 = a.status;
          v2 = b.status;
          return sortOrder === "asc"
            ? v1.localeCompare(v2)
            : v2.localeCompare(v1);
        case "priority":
          const priorities = ["LOW", "MEDIUM", "HIGH", "URGENT"];
          v1 = priorities.indexOf(a.priority);
          v2 = priorities.indexOf(b.priority);
          return sortOrder === "asc" ? v1 - v2 : v2 - v1;
        case "assignee":
          v1 = a.assignee?.name?.toLowerCase() || "";
          v2 = b.assignee?.name?.toLowerCase() || "";
          return sortOrder === "asc"
            ? v1.localeCompare(v2)
            : v2.localeCompare(v1);
        case "dueDate":
          v1 = a.dueDate ? new Date(a.dueDate).getTime() : 0;
          v2 = b.dueDate ? new Date(b.dueDate).getTime() : 0;
          return sortOrder === "asc" ? v1 - v2 : v2 - v1;
        default:
          return 0;
      }
    });
  }

  return data;
}

export interface IsOverdueParams {
  dueDate: string | Date | null | undefined;
  status: string;
}

export function isOverdue(
  dueDate: IsOverdueParams["dueDate"],
  status: IsOverdueParams["status"]
): boolean {
  if (!dueDate || status === "DONE") return false;
  return new Date(dueDate) < new Date();
}

export const getIssueId = (issue: any): string | null => {
  if (!issue) return null;
  const id = issue.id ?? issue._id ?? issue.issueId ?? issue.ID ?? null;
  return id != null ? String(id) : null;
};

export const normalizeIssue = (issue: any): Issue => {
  const id = getIssueId(issue);
  return {
    ...issue,
    id: id ?? issue.id,
  };
};

export const upsertIssue = (existingIssues: Issue[], incomingIssue: Issue): Issue[] => {
  const normalizedIncoming = normalizeIssue(incomingIssue);
  const incomingId = getIssueId(normalizedIncoming);
  if (!incomingId) {
    return [normalizedIncoming, ...existingIssues];
  }

  const nextIssues = existingIssues.map((issue) => normalizeIssue(issue));
  const existingIndex = nextIssues.findIndex((issue) => getIssueId(issue) === incomingId);

  if (existingIndex !== -1) {
    const updated = [...nextIssues];
    updated[existingIndex] = {
      ...updated[existingIndex],
      ...normalizedIncoming,
      id: incomingId,
    };
    return updated;
  }

  return [normalizedIncoming, ...nextIssues];
};

export const mergeIssuesList = (existingIssues: Issue[], incomingIssues: Issue[]): Issue[] => {
  return incomingIssues.reduce((acc, issue) => upsertIssue(acc, issue), existingIssues);
};
