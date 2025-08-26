"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, ChevronUp, X } from "lucide-react";

type Member = { id: string; name?: string | null; email?: string | null };

interface Props {
  search: string;
  setSearch: (v: string) => void;

  statusFilter: string; // "", "TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"
  setStatusFilter: (v: string) => void;

  assigneeFilter: string; // "" or member.id
  setAssigneeFilter: (v: string) => void;

  members: Member[];

  sortBy: string | null; // e.g. "createdAt" | "title" | "status" | "priority" | "dueDate" | null
  sortOrder: "asc" | "desc";
  setSortBy: (v: string | null) => void;
  setSortOrder: (v: "asc" | "desc") => void;
}

const STATUS_OPTIONS = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"] as const;
const ALL = "__ALL__";

export default function IssueTableControls({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  assigneeFilter,
  setAssigneeFilter,
  members,
  sortBy,
  sortOrder,
  setSortBy,
  setSortOrder,
}: Props) {
  const clearAll = () => {
    setSearch("");
    setStatusFilter("");
    setAssigneeFilter("");
    setSortBy(null);
    setSortOrder("asc");
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 border rounded-lg bg-muted/30">
      {/* Left: Search */}
      <div className="flex items-center gap-3">
        <Input
          placeholder="Search issues…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[220px]"
        />

        {/* Status filter */}
        <Select
          value={statusFilter || undefined}
          onValueChange={(val) =>
            setStatusFilter(val === ALL ? "" : (val as string))
          }
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All statuses</SelectItem>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>
                {s.replace("_", " ").toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Assignee filter */}
        <Select
          value={assigneeFilter || undefined}
          onValueChange={(val) =>
            setAssigneeFilter(val === ALL ? "" : (val as string))
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All members" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All members</SelectItem>
            {members.map((m) => (
              <SelectItem key={m.id} value={String(m.id)}>
                {m.name || m.email || "Unnamed"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Right: Sort + Clear */}
      <div className="flex items-center gap-2">
        <Select
          value={sortBy ?? undefined}
          onValueChange={(val) => setSortBy((val as string) ?? null)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Sort by…" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">created</SelectItem>
            <SelectItem value="title">title</SelectItem>
            <SelectItem value="status">status</SelectItem>
            <SelectItem value="priority">priority</SelectItem>
            <SelectItem value="dueDate">due date</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="icon"
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          aria-label="Toggle sort order"
        >
          {sortOrder === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </Button>

        <Button variant="ghost" onClick={clearAll} className="gap-2">
          <X size={16} />
          Clear
        </Button>
      </div>
    </div>
  );
}
