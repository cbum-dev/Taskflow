'use client';

import React, { useEffect, useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { Calendar } from "@/components/ui/calendar";
import { useAuthStore } from "@/store/authStore";
import { io } from "socket.io-client";
import { CalendarIcon, FlagIcon, PlusIcon, UserIcon, Sparkles, Loader2 } from "lucide-react";
import { Issue } from "@/types/types";
import { useParams } from "next/dist/client/components/navigation";
import { toast } from "@/hooks/use-toast";
import { WorkspaceMember } from "@/types/types";
import { priorities, statuses } from "@/services/valus";
import api from "@/services/api";
import { generateTasksWithAI } from "@/utils/ai";

const socket = io("https://taskflow-backend-dkwh.onrender.com");

export default function CreateIssue({ setIssues }: { setIssues: React.Dispatch<React.SetStateAction<Issue[]>> }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newIssue, setNewIssue] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    status: 'TODO',
    assigneeId: '',
    dueDate: null as Date | null,
  });

  const [isCreating, setIsCreating] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { access_token } = useAuthStore();
  const [refreshKey, setRefreshKey] = useState(0);
  const { projectId, workspaceId } = useParams();
  const [workspaceMembers, setWorkspaceMembers] = useState<WorkspaceMember[]>([]);
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const { data } = await api.get(`/issues/project/${projectId}`);
        const formattedIssues = (data.data || []).map((issue: Issue) => ({
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
        const { data } = await api.get(`/workspace/${workspaceId}/members`);
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
  }, [access_token, projectId, setIssues, workspaceId, refreshKey]);

  const handleCreateIssue = async () => {
    if (!newIssue.title.trim()) return;

    setIsCreating(true);
    try {
      const { data } = await api.post('/issues', {
        ...newIssue,
        projectId,
        reporterId: useAuthStore.getState().user?.id
      });

      const formattedIssue = {
        ...data,
        status: data.status || 'TODO',
        priority: data.priority || 'MEDIUM',
        title: data.title || '',
        description: data.description || '',
        assignee: data.assignee || null,
        dueDate: data.dueDate || null
      };

      setIssues(prev => [formattedIssue, ...prev]);

      setRefreshKey(prev => prev + 1);

      setIsModalOpen(false);
      setNewIssue({
        title: '',
        description: '',
        priority: 'MEDIUM',
        status: 'TODO',
        assigneeId: '',
        dueDate: null
      });

      socket.emit("issueCreated", formattedIssue);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create issue",
        variant: "destructive",
      });
      console.error('Error creating issue:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleAIGenerateTasks = async () => {
    if (!aiPrompt.trim()) return;
    
    try {
      setIsGenerating(true);
      console.log("Starting AI task generation with prompt:", aiPrompt);
      
      await generateTasksWithAI({
        prompt: aiPrompt,
        projectId: projectId as string,
        workspaceId: workspaceId as string,
        onSuccess: async (count, tasks) => {
          console.log("AI generation success callback:", { count, tasks });
          
          toast({
            title: "Success",
            description: `Successfully generated ${count} tasks!`,
            variant: "default",
          });
          
          // Close the AI modal and reset the prompt
          setIsAIModalOpen(false);
          setAiPrompt("");
          
          // Update the parent's issues list with the new tasks
          if (tasks && tasks.length > 0) {
            setIssues(prevIssues => [...prevIssues, ...tasks]);
          }
          
          // Also trigger a full refresh to ensure consistency
          setRefreshKey(prev => prev + 1);
          
          // Force a complete refresh of the issues list
          try {
            const { data } = await api.get(`/issues/project/${projectId}`);
            setIssues(data.data || []);
          } catch (error) {
            console.error("Error refreshing issues:", error);
          }
        },
        onError: (error) => {
          console.error("Error generating tasks:", error);
          toast({
            title: "Error",
            description: error instanceof Error ? error.message : "Failed to generate tasks. Please try again.",
            variant: "destructive",
          });
        }
      });
    } catch (error) {
      console.error("Error in handleAIGenerateTasks:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex gap-2">
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
              onChange={(e) => setNewIssue({ ...newIssue, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <Input
              placeholder="Issue description"
              value={newIssue.description}
              onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })}
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
                    onClick={() => setNewIssue({ ...newIssue, status })}
                  >
                    {status.split('_').join(' ')}
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
                  onSelect={(date) => date && setNewIssue({ ...newIssue, dueDate: date })}
                />
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
                    onClick={() => setNewIssue({ ...newIssue, priority })}
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
                    onClick={() => setNewIssue({ ...newIssue, assigneeId: member.id })}
                  >
                    {member.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button
            onClick={handleCreateIssue}
            className="w-full mt-4"
            disabled={isCreating}
          >
            {isCreating ? "Creating..." : "Create Issue"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>

    <Dialog open={isAIModalOpen} onOpenChange={setIsAIModalOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Sparkles className="w-4 h-4 mr-2" />
          AI Generate Tasks
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Tasks with AI</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Describe what you want to achieve
            </label>
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g., I want to build a todo app with user authentication..."
              className="w-full p-2 border rounded-md min-h-[100px] dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              disabled={isGenerating}
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              The AI will generate a set of tasks based on your description.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsAIModalOpen(false)}
              disabled={isGenerating}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAIGenerateTasks}
              disabled={!aiPrompt.trim() || isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Tasks
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </div>
  );
}
