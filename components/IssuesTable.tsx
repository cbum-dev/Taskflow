"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  FlagIcon,
  CalendarIcon,
  UserIcon,
  SearchIcon,
  PlusIcon,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useParams } from "next/navigation";
import { io } from "socket.io-client";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Issue } from "@/types/issue";
import Link from "next/link";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
const socket = io("http://localhost:3001");

interface Assignee {
  id: string;
  name: string;
}

interface IssuesTableProps {
  issues: Issue[];
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setIssues: React.Dispatch<React.SetStateAction<Issue[]>>;
}

export default function IssuesTable({
  issues,
  search,
  setSearch,
  setIssues,
}: IssuesTableProps) {
  const statuses = [
    "TODO",
    "IN_PROGRESS",
    "IN_REVIEW",
    "HOLD_STAGE",
    "COMPLETE",
  ];
  const priorities = ["LOW", "MEDIUM", "HIGH", "URGENT"];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newIssue, setNewIssue] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    status: 'TODO',
    assigneeId: '',
    dueDate: null as Date | null,
  });

  const statusColors: Record<string, string> = {
    TODO: "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100",
    IN_PROGRESS: "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-100",
    IN_REVIEW: "bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900 dark:text-amber-100",
    HOLD_STAGE: "bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-100",
    COMPLETE: "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-100",
  };

  const priorityColors: Record<string, string> = {
    LOW: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
    MEDIUM: "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300",
    HIGH: "bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300",
    URGENT: "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300",
  };

  const { access_token } = useAuthStore();
  const { projectId, workspaceId } = useParams();
  const [workspaceMembers, setWorkspaceMembers] = useState<{ id: string; name: string }[]>([]);
  const assignees: Assignee[] = workspaceMembers;
  
  const handleCreateIssue = async () => {
    if (!newIssue.title.trim()) return;
    
    try {
      const { data } = await axios.post(
        'http://localhost:3001/api/issues',
        { 
          ...newIssue, 
          projectId, 
          reporterId: useAuthStore.getState().user?.id 
        },
        { headers: { Authorization: `Bearer ${access_token}` } }
      );

      // Make sure the returned data has all the expected properties
      const formattedIssue = {
        ...data,
        status: data.status || 'TODO',
        priority: data.priority || 'MEDIUM',
        title: data.title || '',
        description: data.description || '',
        assignee: data.assignee || null,
        dueDate: data.dueDate || null
      };

      // Update the UI with properly formatted issue
      setIssues(prev => [formattedIssue, ...prev]);
      
      // Close modal and reset form
      setIsModalOpen(false);
      setNewIssue({ 
        title: '', 
        description: '', 
        priority: 'MEDIUM', 
        status: 'TODO', 
        assigneeId: '', 
        dueDate: null 
      });
    } catch (error) {
      console.error('Error creating issue:', error);
    }
  };

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3001/api/issues/project/${projectId}`,
          {
            headers: { Authorization: `Bearer ${access_token}` },
          }
        );
        // Make sure all issues have the required properties
        const formattedIssues = (data.data || []).map((issue: any) => ({
          ...issue,
          status: issue.status || 'TODO',
          priority: issue.priority || 'MEDIUM',
          title: issue.title || '',
          description: issue.description || '',
        }));
        setIssues(formattedIssues);
      } catch (error) {
        console.error("Error fetching issues:", error);
      }
    };
    if (access_token && projectId) fetchIssues();

    socket.on("issueUpdated", (updatedIssue: Issue) => {
      setIssues((prevIssues) =>
        prevIssues.map((issue) =>
          issue.id === updatedIssue.id ? updatedIssue : issue
        )
      );
    });

    socket.on("issueCreated", (newIssue: Issue) => {
      setIssues((prevIssues) => [newIssue, ...prevIssues]);
    });

    const fetchWorkspaceMembers = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3001/api/workspace/${workspaceId}/members`,
          {
            headers: { Authorization: `Bearer ${access_token}` },
          }
        );
        setWorkspaceMembers(data.data || []);
      } catch (error) {
        console.error("Error fetching workspace members:", error);
      }
    };
    if (access_token && workspaceId) fetchWorkspaceMembers();

    return () => {
      socket.off("issueUpdated");
      socket.off("issueCreated");
    };
  }, [access_token, projectId, setIssues, workspaceId]);

  const updateIssue = async (
    issueId: string,
    field: "status" | "priority" | "assigneeId" | "dueDate",
    value: string
  ) => {
    try {
      await axios.put(
        `http://localhost:3001/api/issues/${issueId}`,
        { [field]: value },
        { headers: { Authorization: `Bearer ${access_token}` } }
      );
      socket.emit("updateIssue", { id: issueId, field, value });
    } catch (error) {
      console.error("Error updating issue:", error);
    }
  };

  // Safe method to format status
  const formatStatus = (status: any): string => {
    if (typeof status === 'string') {
      return status.split('_').join(' ');
    }
    return "Select Status";
  };

  // Filter issues safely checking for title property
  const filteredIssues = issues.filter((issue) => 
    typeof issue.title === 'string' && issue.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Project Issues</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Track and manage all project issues in one place
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative w-full md:w-64">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search issues..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="w-4 h-4 mr-2" />
                New Issue
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Issue</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title
                  </label>
                  <Input
                    placeholder="Issue title"
                    value={newIssue.title}
                    onChange={(e) => setNewIssue({...newIssue, title: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <Input
                    placeholder="Issue description"
                    value={newIssue.description}
                    onChange={(e) => setNewIssue({...newIssue, description: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        {newIssue.status.split('_').join(' ')}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {statuses.map((status) => (
                        <DropdownMenuItem
                          key={status}
                          onClick={() => setNewIssue({...newIssue, status})}
                        >
                          {status.split('_').join(' ')}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Priority
                  </label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <FlagIcon className="w-4 h-4 mr-2" />
                        {newIssue.priority}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {priorities.map((priority) => (
                        <DropdownMenuItem
                          key={priority}
                          onClick={() => setNewIssue({...newIssue, priority})}
                        >
                          {priority}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Assignee
                  </label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <UserIcon className="w-4 h-4 mr-2" />
                        {workspaceMembers.find(m => m.id === newIssue.assigneeId)?.name || 'Unassigned'}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {workspaceMembers.map((member) => (
                        <DropdownMenuItem
                          key={member.id}
                          onClick={() => setNewIssue({...newIssue, assigneeId: member.id})}
                        >
                          {member.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Due Date
                  </label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        {newIssue.dueDate ? newIssue.dueDate.toLocaleDateString() : 'No date'}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <Calendar
                        mode="single"
                        selected={newIssue.dueDate || undefined}
                        onSelect={(date) => date && setNewIssue({...newIssue, dueDate: date})}
                      />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <Button 
                  onClick={handleCreateIssue}
                  className="w-full mt-4"
                >
                  Create Issue
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <Table className="min-w-full">
          <TableHeader className="bg-gray-50 dark:bg-gray-800">
            <TableRow>
              <TableHead className="w-[40%] text-gray-600 dark:text-gray-300">Issue</TableHead>
              <TableHead className="text-gray-600 dark:text-gray-300">Status</TableHead>
              <TableHead className="text-gray-600 dark:text-gray-300">Priority</TableHead>
              <TableHead className="text-gray-600 dark:text-gray-300">Assignee</TableHead>
              <TableHead className="text-gray-600 dark:text-gray-300">Due Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredIssues.map((issue) => (
              <TableRow 
                key={issue.id || `issue-${Math.random()}`} 
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <TableCell className="font-medium">
                  <Link 
                    href={`/issues/${issue.id}`}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                  >
                    {issue.title || "Untitled Issue"}
                  </Link>
                </TableCell>

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Badge
                        className={`${statusColors[issue.status] || statusColors.TODO} cursor-pointer transition-colors`}
                        variant="outline"
                      >
                        {formatStatus(issue.status)}
                      </Badge>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="min-w-[120px]">
                      {statuses.map((status) => (
                        <DropdownMenuItem
                          key={status}
                          onClick={() => updateIssue(issue.id, "status", status)}
                          className="capitalize"
                        >
                          {status.split("_").join(" ").toLowerCase()}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Badge
                        className={`${priorityColors[issue.priority] || priorityColors.MEDIUM} py-1 cursor-pointer transition-colors`}
                        variant="outline"
                      >
                        <FlagIcon className="w-3 h-3 mr-1.5" />
                        {issue.priority || "MEDIUM"}
                      </Badge>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="min-w-[120px]">
                      {priorities.map((priority) => (
                        <DropdownMenuItem
                          key={priority}
                          onClick={() => updateIssue(issue.id, "priority", priority)}
                        >
                          {priority}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-2"
                      >
                        <UserIcon className="w-4 h-4" />
                        <span>{issue.assignee?.name || "Unassigned"}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="max-h-60 overflow-y-auto">
                      {assignees.map((assignee) => (
                        <DropdownMenuItem
                          key={assignee.id}
                          onClick={() => updateIssue(issue.id, "assigneeId", assignee.id)}
                        >
                          {assignee.name}
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuItem>
                        <Button variant="ghost" className="w-full">
                          Invite New Member
                        </Button>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4" />
                        <span>
                          {issue.dueDate
                            ? new Date(issue.dueDate).toLocaleDateString()
                            : "Set date"}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <Calendar
                        mode="single"
                        selected={issue.dueDate ? new Date(issue.dueDate) : undefined}
                        onSelect={(date) =>
                          date && updateIssue(issue.id, "dueDate", date.toISOString())
                        }
                        className="rounded-md border"
                      />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredIssues.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-4">
            <FlagIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
            No issues found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md">
            {search
              ? "Try adjusting your search query"
              : "Create your first issue to get started"}
          </p>
        </div>
      )}
    </div>
  );
}