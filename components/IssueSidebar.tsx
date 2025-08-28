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
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import api from "@/services/api";
import { WorkspaceMember, Issue } from "@/types/types";
import { toast } from "sonner";

export default function IssueSidebar({ issue, onClose, members, socket }: { issue: Issue; onClose: () => void; members: WorkspaceMember[]; socket: any; }) {
  const [formData, setFormData] = useState<any>({ ...issue });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setFormData({ ...issue });
    setHasChanges(false);
  }, [issue]);

  if (!issue) return null;

  const updateField = (field: string, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    setHasChanges(true);
  };

  const saveAllChanges = async () => {
    if (!hasChanges) return;

    try {
      const changedFields: { [key: string]: any } = {};
      Object.keys(formData).forEach(key => {
        if (formData[key] !== issue[key as keyof Issue]) {
          changedFields[key] = formData[key];
        }
      });

      if (Object.keys(changedFields).length === 0) {
        setHasChanges(false);
        return;
      }
      await api.put(`/issues/${issue.id}`, changedFields);

      socket.emit("issueUpdated", { id: issue.id, ...changedFields });
      toast("Issue updated successfully", {
        description: "You can click to start working on your updated issue.",
        action: {
          label: "Close",
          onClick: () => console.log("Close"),
        },
      });

      setHasChanges(false);
      onClose();
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

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this issue? This action cannot be undone.")) {
      return;
    }

    try {
      await api.delete(`/issues/${issue.id}`);
      socket.emit("issueDeleted", { id: issue.id });
      onClose();
    } catch (e) {
      console.error("Error deleting issue:", e);
      alert("Failed to delete issue. Please try again.");
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
      });
    } catch (error) {
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