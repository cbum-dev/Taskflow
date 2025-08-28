export interface Issue {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  projectId: string;
  assignee?: string;
  dueDate?: string;
}
export interface Project {
  id: string;
  name: string;
  description: string;
  members: number;
  issues: number;
  lastUpdated: string;
  avatar?: string;
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
}

export interface IssueTableProps {
  issues: Issue[];
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setIssues: React.Dispatch<React.SetStateAction<Issue[]>>;
}

export interface WorkspaceMember {
  id: string;
  name: string;
}
