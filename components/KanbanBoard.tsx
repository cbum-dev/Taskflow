'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import { DndContext, closestCorners, DragEndEvent } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'
import { useAuthStore } from '@/store/authStore'
import KanbanColumn from './KanbanColumn'
import { io } from 'socket.io-client'

const STATUSES = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"];
const socket = io('https://json-schema-lint-zzda.vercel.app')

interface Issue {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
}

export default function KanbanBoard() {
  const { access_token } = useAuthStore()
  const { projectId } = useParams()
  const [issues, setIssues] = useState<Issue[]>([])

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const { data } = await axios.get(`https://json-schema-lint-zzda.vercel.app/api/issues/project/${projectId}`, {
          headers: { Authorization: `Bearer ${access_token}` },
        });
        setIssues(data.data || []);
      } catch (error) {
        console.error('Error fetching issues:', error);
      }
    };
    if (access_token && projectId) fetchIssues();

    socket.on('issueUpdated', (updatedIssue: Issue) => {
      setIssues((prevIssues: Issue[]) =>
        prevIssues.map((issue) => (issue.id === updatedIssue.id ? updatedIssue : issue))
      );
    });

    return () => {
      socket.off('issueUpdated') 
    }
  }, [access_token, projectId]);

  const updateIssueStatus = async (issueId: string, newStatus: string) => {
    try {
      await axios.put(`https://json-schema-lint-zzda.vercel.app/api/issues/${issueId}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      setIssues((prevIssues) =>
        prevIssues.map((issue) => (issue.id === issueId ? { ...issue, status: newStatus } : issue))
      );
      socket.emit('updateIssue',{id: issueId,newStatus})
    } catch (error) {
      console.error('Error updating issue status:', error);
    }
  };

  const handleDeleteIssue = async (issueId: string) => {
    try {
      await axios.delete(`https://json-schema-lint-zzda.vercel.app/api/issues/${issueId}`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      setIssues(prevIssues => prevIssues.filter(issue => issue.id !== issueId));
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
      <div className="flex space-x-4 overflow-x-auto p-4">
        {STATUSES.map((status) => (
          <SortableContext key={status} items={issues.filter(issue => issue.status === status)}>
            <KanbanColumn 
              key={status} 
              status={status} 
              issues={issues.filter(issue => issue.status === status)}
              onDeleteIssue={handleDeleteIssue}
            />
          </SortableContext>
        ))}
      </div>
    </DndContext>
  );
}
