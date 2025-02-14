import React from 'react'
import { useDroppable } from '@dnd-kit/core'
import KanbanCard from './KanbanCard';

export default function KanbanColumn({ status, issues }) {
  const { setNodeRef } = useDroppable({ id: status });

  return (
    <div ref={setNodeRef} className="w-72 bg-gray-100 p-4 rounded-md shadow-md">
      <h2 className="text-lg font-semibold mb-4">{status.replace("_", " ")}</h2>
      <div className="space-y-2">
        {issues.map((issue) => (
          <KanbanCard key={issue.id} issue={issue} />
        ))}
      </div>
    </div>
  );
}
