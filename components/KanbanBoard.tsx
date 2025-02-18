'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import { DndContext, closestCorners } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'
import { useAuthStore } from '@/store/authStore'
import KanbanColumn from './KanbanColumn'

const STATUSES = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"];

export default function KanbanBoard() {
  const { access_token } = useAuthStore()
  const { projectId } = useParams()
  const [issues, setIssues] = useState([])

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3001/api/issues/project/${projectId}`, {
          headers: { Authorization: `Bearer ${access_token}` },
        });
        setIssues(data.data || []);
      } catch (error) {
        console.error('Error fetching issues:', error);
      }
    };
    if (access_token && projectId) fetchIssues();
  }, [access_token, projectId]);

  const updateIssueStatus = async (issueId: string, newStatus: string) => {
    try {
      await axios.put(`http://localhost:3001/api/issues/${issueId}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      setIssues((prevIssues) =>
        prevIssues.map((issue) => (issue.id === issueId ? { ...issue, status: newStatus } : issue))
      );
    } catch (error) {
      console.error('Error updating issue status:', error);
    }
  };

  const onDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const draggedIssueId = active.id;
    const newStatus = over.id; 

    updateIssueStatus(draggedIssueId, newStatus);
  };

  return (
    <DndContext collisionDetection={closestCorners} onDragEnd={onDragEnd}>
      <div className="flex space-x-4 overflow-x-auto p-4">
        {STATUSES.map((status) => (
          <SortableContext key={status} items={issues.filter(issue => issue.status === status)}>
            <KanbanColumn key={status} status={status} issues={issues.filter(issue => issue.status === status)} />
          </SortableContext>
        ))}
      </div>
    </DndContext>
  );
}
