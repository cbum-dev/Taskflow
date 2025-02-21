import React from "react"
import { useDroppable } from "@dnd-kit/core"
import KanbanCard from "./KanbanCard"

interface Issue {
  id: string;
  title: string;
  status: string;
  priority: string;
}

interface KanbanColumnProps {
  status: string;
  issues: Issue[];
  onDeleteIssue: (id: string) => void;
}

export default function KanbanColumn({ status, issues, onDeleteIssue }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({ id: status })

  return (
    <div
      ref={setNodeRef}
      className="w-72 p-4 rounded-md shadow-md bg-gray-100 dark:bg-neutral-900 dark:border-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200"
    >
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
        {status.replace("_", " ")}
      </h2>
      <div className="space-y-2">
        {issues.map((issue) => (
          <KanbanCard 
            key={issue.id} 
            issue={issue} 
            onDelete={onDeleteIssue} 
          />
        ))}
      </div>
    </div>
  )
}
