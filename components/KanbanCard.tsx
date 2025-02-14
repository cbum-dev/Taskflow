import React from 'react'
import { useDraggable } from '@dnd-kit/core'

export default function KanbanCard({ issue }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: issue.id });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="p-3 bg-white rounded shadow cursor-grab"
      style={{ transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined }}
    >
      <h3 className="text-sm font-medium">{issue.title}</h3>
    </div>
  );
}
