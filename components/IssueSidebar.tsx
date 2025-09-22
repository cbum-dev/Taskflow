"use client";

import React, { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "./ui/calendar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarIcon, Plus, Trash2, } from "lucide-react";
import api from "@/services/api";
import { WorkspaceMember, Issue, Label, Comment } from "@/types/types";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
// Helper to generate a random hex color
const getRandomColor = () => `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`;

export default function IssueSidebar({
  issue,
  onClose,
  members,
  socket,
}: {
  issue: Issue;
  onClose: () => void;
  members: WorkspaceMember[];
  socket: any;
}) {
  const [formData, setFormData] = useState<any>({ ...issue });
  const [hasChanges, setHasChanges] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // --- NEW STATE FOR LABELS AND COMMENTS ---
  const [projectLabels, setProjectLabels] = useState<Label[]>([]);
  const [newLabelName, setNewLabelName] = useState("");
  const [newLabelColor, setNewLabelColor] = useState(getRandomColor());
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const { data: session } = useSession();
  const currentUser = { 
    id: session?.user?.id || "", 
    name: session?.user?.name || "You",
    email: session?.user?.email || "",
    imageUrl: session?.user?.image || ""
  };
  


  // --- FETCH PROJECT LABELS ON COMPONENT MOUNT ---
  useEffect(() => {
    const fetchProjectLabels = async () => {
      if (!issue?.projectId) return;
      try {
        const response = await api.get(`/projects/${issue.projectId}/labels`);
        setProjectLabels(response.data.data);
      } catch (e) {
        console.error("Failed to fetch project labels", e);
        toast.error("Could not load project labels.");
      }
    };
    fetchProjectLabels();
  }, [issue?.projectId]);

  useEffect(() => {
    setFormData({ ...issue, comments: issue.comments || [] }); 
    setHasChanges(false);
  }, [issue]);

  if (!issue) return null;

  const updateField = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const saveAllChanges = async () => {
    if (!hasChanges) return;
    try {
      const changedFields: { [key: string]: any } = {};
      Object.keys(formData).forEach((key) => {
        // Special handling for labels to send only IDs
        if (key === 'labels') {
            const originalLabelIds = new Set(issue.labels?.map(l => l.id));
            const newLabelIds = new Set(formData.labels.map((l: Label) => l.id));
            if (originalLabelIds.size !== newLabelIds.size || ![...originalLabelIds].every(id => newLabelIds.has(id))) {
                changedFields.labels = formData.labels.map((l: Label) => l.id);
            }
        } else if (formData[key] !== issue[key as keyof Issue]) {
          changedFields[key] = formData[key];
        }
      });
      
      if (Object.keys(changedFields).length === 0) {
        setHasChanges(false);
        return;
      }

      await api.put(`/issues/${issue.id}`, changedFields);
      socket.emit("issueUpdated", { id: issue.id, ...changedFields });
      toast.success("Issue updated successfully!");
      setHasChanges(false);
      onClose(); // Optional: close sidebar on successful save
    } catch (e) {
      toast.error("Failed to update issue.");
      console.error(e);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure? This will permanently delete this issue.")) return;
    try {
      await api.delete(`/issues/${issue.id}`);
      socket.emit("issueDeleted", { id: issue.id });
      onClose();
    } catch (e) {
      toast.error("Failed to delete issue.");
      console.error("Error deleting issue:", e);
    }
  };

  const handleCreateLabel = async () => {
    if (!newLabelName.trim()) {
      toast.warning("Label name cannot be empty.");
      return;
    }
    try {
      const response = await api.post(`/projects/${issue.projectId}/labels`, {
        name: newLabelName,
        color: newLabelColor,
      });
      const newLabel = response.data.data;
      setProjectLabels(prev => [...prev, newLabel]);
      setNewLabelName("");
      setNewLabelColor(getRandomColor());
      toast.success(`Label "${newLabel.name}" created.`);
    } catch (error: any) {
      toast.error("Failed to create label.", {
        description: error?.response?.data?.error || ''
      });
    }
  };

  const handleDeleteLabelFromProject = async (labelId: string) => {
    if (!confirm("Delete this label from the entire project?")) return;
    try {
      await api.delete(`/projects/${issue.projectId}/labels/${labelId}`);
      setProjectLabels(prev => prev.filter(l => l.id !== labelId));
      updateField('labels', formData.labels.filter((l: Label) => l.id !== labelId));
      toast.success("Label deleted from project.");
    } catch (error: any) {
      toast.error("Failed to delete label.",{
        description: error?.response?.data?.error || ''
      });
    }
  };

  const toggleIssueLabel = (label: Label) => {
    const isAttached = formData.labels.some((l: Label) => l.id === label.id);
    const newLabels = isAttached
      ? formData.labels.filter((l: Label) => l.id !== label.id)
      : [...formData.labels, label];
    updateField("labels", newLabels);
  };

  const handleAddComment = async (content?: string, isAIGenerated: boolean = false) => {
    const commentContent = content || newComment;
    if (!commentContent.trim()) return;
    
    const commentData: any = { 
      content: commentContent,
      userId: currentUser.id,
      isAIGenerated
    };

    setIsSubmittingComment(true);
    try {
      const response = await api.post(`/issues/${issue.id}/comments`, commentData);
      const newCommentData = response.data.data;
      newCommentData.user = { 
        id: currentUser.id, 
        name: currentUser.name,
        imageUrl: currentUser.imageUrl
      };
      newCommentData.isAIGenerated = isAIGenerated;
      
      updateField('comments', [...(formData.comments || []), newCommentData]);
      
      if (!content) {
        setNewComment("");
      }
      
      // Notify via WebSocket
      socket.emit("newComment", { 
        issueId: issue.id, 
        comment: newCommentData 
      });
    } catch (e) {
      toast.error("Failed to add comment.");
      console.error("Error adding comment:", e);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDateSelect = (date: Date | null | undefined) => {
    if (date) {
      const selectedDate = new Date(date);
      selectedDate.setHours(12, 0, 0, 0);
      const formattedDate = selectedDate.toISOString();
      updateField("dueDate", formattedDate);
    }
    setIsCalendarOpen(false);
  };

  const formatDisplayDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'No date';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });    } catch (error) {
      console.error("Invalid date:", error);
      return 'No date';
    }
  };

  const getSelectedDate = (dateString: Date | null | undefined): Date | undefined => {
    if (!dateString) return undefined;
    try {
      const date = new Date(dateString);
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    } catch (error) {
      console.error("Invalid date:", error);
      return undefined;
    }
  };
  return (
    <Sidebar
      side="right"
      className="bg-white h-[calc(100vh-3rem)] dark:bg-zinc-900 w-full sm:max-w-sm flex flex-col rounded-l-xl shadow-lg"
    >
      <SidebarHeader className="border-b border-gray-200 dark:border-zinc-700 px-6 py-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{formData.title}</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          ✕
        </Button>
      </SidebarHeader>

      <SidebarContent className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <Textarea
            rows={4}
            value={formData.description || ""}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="Add a description"
          />
        </div>
 <div>
          <label className="block text-sm font-medium mb-2">Labels</label>
          <div className="flex flex-wrap items-center gap-2">
            {formData.labels?.map((label: Label) => (
              <Badge key={label.id} style={{ backgroundColor: label.color, color: 'white' }} className="text-xs font-semibold">
                {label.name}
              </Badge>
            ))}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="h-6 w-6 rounded-full">
                  <Plus className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-0">
                <div className="p-4">
                  <h4 className="font-medium mb-2 text-sm">Manage Labels</h4>
                  <div className="space-y-2">
                    {projectLabels.map(label => (
                      <div key={label.id} className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            className="form-checkbox h-4 w-4 rounded text-indigo-600"
                            checked={formData.labels.some((l: Label) => l.id === label.id)}
                            onChange={() => toggleIssueLabel(label)}
                          />
                          <Badge style={{ backgroundColor: label.color, color: 'white' }} className="text-xs font-semibold">
                            {label.name}
                          </Badge>
                        </label>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleDeleteLabelFromProject(label.id)}>
                          <Trash2 className="h-3 w-3 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t dark:border-zinc-700 p-4">
                  <h4 className="font-medium mb-2 text-sm">Create new label</h4>
                  <div className="flex items-center gap-2">
                    <input type="color" value={newLabelColor} onChange={e => setNewLabelColor(e.target.value)} className="h-8 w-8 p-1 bg-transparent border rounded" />
                    <Input
                      placeholder="New label name..."
                      value={newLabelName}
                      onChange={e => setNewLabelName(e.target.value)}
                      className="h-8"
                    />
                    <Button size="sm" onClick={handleCreateLabel}>Create</Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <Select
              value={formData.status || ""}
              onValueChange={(val) => updateField("status", val)}
            >
              <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                {["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"].map((s) => (
                  <SelectItem key={s} value={s}>
                    {s.replace("_", " ").toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Priority</label>
            <Select
              value={formData.priority || ""}
              onValueChange={(val) => updateField("priority", val)}
            >
              <SelectTrigger><SelectValue placeholder="Priority" /></SelectTrigger>
              <SelectContent>
                {["LOW", "MEDIUM", "HIGH", "URGENT"].map((p) => (
                  <SelectItem key={p} value={p}>
                    {p.toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Due Date</label>
          <DropdownMenu open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <CalendarIcon className="w-4 h-4 mr-2" />
                {formatDisplayDate(formData.dueDate)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={getSelectedDate(formData.dueDate)}
                onSelect={handleDateSelect}
                initialFocus
              />
              {formData.dueDate && (
                <div className="p-2 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      updateField("dueDate", null);
                      setIsCalendarOpen(false);
                    }}
                  >
                    Clear Date
                  </Button>
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Assignees</label>
          <div className="flex flex-wrap gap-2">
            {members.map((m: WorkspaceMember) => (
              <div
                key={m.id}
                className={`px-3 py-1 rounded-full text-sm cursor-pointer ${formData.assigneeId === m.id
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-700"
                  }`}
                onClick={() => updateField("assigneeId", m.id)}
              >
                {m.name}
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold">Comments</h3>
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {formData.comments?.length > 0 ? (
                formData.comments.map((comment: Comment) => (
                  <div 
                    key={comment.id} 
                    className={`flex items-start gap-3 group ${comment.isAIGenerated ? 'border-l-2 border-blue-500 pl-3' : ''}`}
                  >
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src={comment.user?.imageUrl} />
                      <AvatarFallback>
                        {comment.isAIGenerated 
                          ? 'AI' 
                          : (comment.user?.name || 'U').charAt(0).toUpperCase()
                        }
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <p className="font-semibold text-sm">
                            {comment.isAIGenerated ? 'AI Assistant' : comment.user?.name || 'Unknown'}
                          </p>
                          {comment.isAIGenerated && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                              AI
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p 
                        className={`whitespace-pre-wrap break-words text-sm ${comment.isAIGenerated ? 'text-blue-800 dark:text-blue-200' : 'text-gray-600 dark:text-gray-300'}`}
                      >
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No comments yet. Add the first one!
                </div>
              )}
            </div>
          <div className="flex items-start gap-3 pt-4">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{currentUser.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
              />
              <Button
                size="sm"
                className="mt-2"
                onClick={() => handleAddComment()}
                disabled={!newComment.trim() || isSubmittingComment}
              >
                {isSubmittingComment ? "Commenting..." : "Comment"}
              </Button>
            </div>
          </div>
        </div>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-200 dark:border-zinc-700 px-6 py-4 flex gap-3">
        <Button
          variant="destructive"
          className="flex-1"
          onClick={handleDelete}
        >
          Delete
        </Button>
        <Button
          className={`flex-1 ${hasChanges ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
          onClick={saveAllChanges}
          disabled={!hasChanges}
        >
          {hasChanges ? 'Save Changes' : 'Done'}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}