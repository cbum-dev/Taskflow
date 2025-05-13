import React from "react"
import { useDroppable } from "@dnd-kit/core"
import KanbanCard from "./KanbanCard"
import { cn } from "@/lib/utils"

interface Issue {
  id: string;
  title: string;
  status: string;
  priority: string;
  description?: string;
  dueDate?: string;
  assignee?: { name: string };
}

interface KanbanColumnProps {
  status: string;
  issues: Issue[];
  onDeleteIssue: (id: string) => void;
}

const statusColors: Record<string, string> = {
  TODO: "bg-gray-100 border-gray-200 dark:bg-gray-800/50 dark:border-gray-700",
  IN_PROGRESS: "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800",
  IN_REVIEW: "bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800",
  DONE: "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800",
};

const statusTextColors: Record<string, string> = {
  TODO: "text-gray-800 dark:text-gray-200",
  IN_PROGRESS: "text-blue-800 dark:text-blue-200",
  IN_REVIEW: "text-amber-800 dark:text-amber-200",
  DONE: "text-green-800 dark:text-green-200",
};

export default function KanbanColumn({ status, issues, onDeleteIssue }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status })

  const formattedStatus = status.replace("_", " ")

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "w-72 h-auto flex-shrink-0 rounded-lg border p-4 transition-colors",
        statusColors[status],
        isOver ? "ring-2 ring-offset-2 ring-blue-500" : ""
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className={cn(
          "text-sm font-semibold uppercase tracking-wider",
          statusTextColors[status]
        )}>
          {formattedStatus}
        </h2>
        <span className="text-xs px-2 py-1 rounded-full bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300">
          {issues.length}
        </span>
      </div>
      
      <div className="space-y-3">
        {issues.length > 0 ? (
          issues.map((issue) => (
            <KanbanCard 
              key={issue.id} 
              issue={issue} 
              onDelete={onDeleteIssue} 
            />
          ))
        ) : (
          <div className="text-center py-6 text-sm text-gray-500 dark:text-gray-400">
            No issues in this column
          </div>
        )}
      </div>
    </div>
  )
}