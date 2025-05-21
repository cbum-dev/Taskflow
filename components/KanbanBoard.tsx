'use client'
import React from 'react'
import { DndContext, closestCorners, DragEndEvent } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'
import { useAuthStore } from '@/store/authStore'
import KanbanColumn from './KanbanColumn'
import axios from 'axios'
import { io } from 'socket.io-client'

const STATUSES = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"];
const socket = io('http://localhost:3001')

// Make sure this Issue interface matches the one in KanbanColumn
interface Issue {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  projectId: string;
  assignee?: string;
  dueDate?: string; 
}

interface KanbanBoardProps {
  issues: Issue[];
}

export default function KanbanBoard({ issues }: KanbanBoardProps) {
  const { access_token } = useAuthStore();

  const updateIssueStatus = async (issueId: string, newStatus: string) => {
    try {
      await axios.put(`http://localhost:3001/api/issues/${issueId}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      
      socket.emit('updateIssue', { id: issueId, newStatus });
    } catch (error) {
      console.error('Error updating issue status:', error);
    }
  };

  const handleDeleteIssue = async (issueId: string) => {
    try {
      await axios.delete(`http://localhost:3001/api/issues/${issueId}`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      
      socket.emit('issueDeleted', issueId);
    } catch (error) {
      console.error('Error deleting issue:', error);
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const draggedIssueId = String(active.id);
    const newStatus = String(over.id);
    updateIssueStatus(draggedIssueId, newStatus);
  };

  return (
    <DndContext collisionDetection={closestCorners} onDragEnd={onDragEnd}>
      <div className="flex space-x-4 overflow-x-auto p-4 h-auto overflow-scroll">
        {STATUSES.map((status) => (
          <SortableContext key={status} items={issues.filter(issue => issue.status === status)}>
            <KanbanColumn
              key={status}
              status={status}
              issues={issues.filter(issue => issue.status === status).map(issue => ({
                ...issue,
                assignee: issue.assignee ? { name: issue.assignee } : undefined
              }))}
              onDeleteIssue={handleDeleteIssue}
            />
          </SortableContext>
        ))}
      </div>
    </DndContext>
  );
}
