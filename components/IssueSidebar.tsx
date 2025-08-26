"use client";

import React, { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import axios from "axios";
import { useAuthStore } from "@/store/authStore";

export default function IssueSidebar({ issue, onClose, members, socket }) {
  const { access_token } = useAuthStore();
  const [formData, setFormData] = useState({ ...issue });
  const [comment, setComment] = useState("");

  useEffect(() => {
    setFormData({ ...issue });
  }, [issue]);

  if (!issue) return null;

  const saveField = async (field, value) => {
    try {
      const updated = { ...formData, [field]: value };
      setFormData(updated);
      await axios.put(
        `http://localhost:3001/api/issues/${issue.id}`,
        { [field]: value },
        { headers: { Authorization: `Bearer ${access_token}` } }
      );
      socket.emit("issueUpdated", { id: issue.id, [field]: value });
    } catch (e) {
      console.error(e);
    }
  };

  const handleComment = () => {
    if (!comment.trim()) return;
    // TODO: push comment to backend
    console.log("Comment posted:", comment);
    setComment("");
  };

  return (
    <Sidebar
      side="right"
      open={true}
      className="bg-white dark:bg-zinc-900 w-full sm:max-w-sm flex flex-col rounded-l-xl shadow-lg"
    >
      <SidebarHeader className="border-b border-gray-200 dark:border-zinc-700 px-6 py-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{formData.title}</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          ✕
        </Button>
      </SidebarHeader>

      <SidebarContent className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <Textarea
            rows={4}
            value={formData.description || ""}
            onChange={(e) => saveField("description", e.target.value)}
            placeholder="Add a description"
          />
        </div>

        {/* Status + Priority */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <Select
              value={formData.status || ""}
              onValueChange={(val) => saveField("status", val)}
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
              onValueChange={(val) => saveField("priority", val)}
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

        {/* Due Date */}
        <div>
          <label className="block text-sm font-medium mb-1">Due Date</label>
          <div className="relative">
            <Input
              type="date"
              value={formData.dueDate ? formData.dueDate.split("T")[0] : ""}
              onChange={(e) => saveField("dueDate", e.target.value)}
              className="pr-10"
            />
            <CalendarIcon className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Assignees */}
        <div>
          <label className="block text-sm font-medium mb-2">Assignees</label>
          <div className="flex flex-wrap gap-2">
            {members.map((m) => (
              <div
                key={m.id}
                className={`px-3 py-1 rounded-full text-sm cursor-pointer ${
                  formData.assigneeId === m.id
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => saveField("assigneeId", m.id)}
              >
                {m.name}
              </div>
            ))}
          </div>
        </div>

        {/* Comments */}
        <div>
          <label className="block text-sm font-medium mb-2">Comments</label>
          <div className="space-y-2">
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
            />
            <Button onClick={handleComment}>Post Comment</Button>
          </div>
        </div>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-200 dark:border-zinc-700 px-6 py-4 flex gap-3">
        <Button variant="destructive" className="flex-1">
          Delete
        </Button>
        <Button className="flex-1">Done</Button>
      </SidebarFooter>
    </Sidebar>
  );
}
