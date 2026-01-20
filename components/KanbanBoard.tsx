'use client';

import React, { useEffect, useState } from 'react';
import { Issue } from '@/types/types';
import { Card, CardContent } from '@/components/ui/card';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useAuthStore } from '@/store/authStore';
import api, { updateIssueStatus } from '@/services/api';
import { toast } from 'sonner';
import IssueSidebar from './IssueSidebar';
import { useParams } from 'next/navigation';
import { socketInstance as socket } from '@/lib/socket';
import { normalizeIssue, upsertIssue } from './utils';

interface KanbanBoardProps {
  issues: Issue[];
  onUpdateIssues: React.Dispatch<React.SetStateAction<Issue[]>>;
  className?: string;
}

const statuses = [
  { id: 'TODO', title: 'To Do', color: 'bg-gray-100 dark:bg-neutral-600 dark:text-white' },
  { id: 'IN_PROGRESS', title: 'In Progress', color: 'bg-blue-100 dark:bg-blue-900 dark:text-white' },
  { id: 'IN_REVIEW', title: 'In Review', color: 'bg-yellow-100 dark:bg-yellow-900 dark:text-white' },
  { id: 'DONE', title: 'Done', color: 'bg-green-100 dark:bg-green-900 dark:text-white' },
];

export default function KanbanBoard({ issues, onUpdateIssues, className = '' }: KanbanBoardProps) {
  const { access_token } = useAuthStore();
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { projectId, workspaceId } = useParams();
  const [workspaceMembers, setWorkspaceMembers] = useState([]);

  useEffect(() => {
    if (!access_token || !projectId || !workspaceId) return;

    api
      .get(`/workspace/${workspaceId}/members`)
      .then((res) => setWorkspaceMembers(res.data.data || []))
      .catch(console.error);

    const handleIssueCreated = (newIssue: Issue) => {
      onUpdateIssues(prev => upsertIssue(prev, normalizeIssue(newIssue)));
    };

    const handleIssueUpdated = (updatedIssue: Issue) => {
      onUpdateIssues(prev => prev.map(issue => issue.id === updatedIssue.id ? normalizeIssue(updatedIssue) : issue));
    };

    const handleIssueDeleted = (deleted: string | Issue) => {
      const id = typeof deleted === 'object' ? deleted.id : deleted;
      onUpdateIssues(prev => prev.filter(issue => issue.id !== id));
    };

    socket.on('issueCreated', handleIssueCreated);
    socket.on('issueUpdated', handleIssueUpdated);
    socket.on('issueDeleted', handleIssueDeleted);

    return () => {
      socket.off("issueCreated");
      socket.off("issueUpdated");
      socket.off("issueDeleted");
    };
  }, [access_token, projectId, workspaceId, onUpdateIssues]);

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
      return;
    }

    try {
      const issue = issues.find(issue => issue.id === draggableId);
      if (!issue) return;

      const updatedIssues = issues.map(i =>
        i.id === issue.id ? { ...i, status: destination.droppableId as any } : i
      );

      onUpdateIssues(updatedIssues);

      if (source.droppableId !== destination.droppableId) {
        await updateIssueStatus(issue.id, destination.droppableId as any, access_token as string);
        toast.success('Task status updated successfully');
      }
    } catch (error) {
      console.error('Error updating issue status:', error);
      onUpdateIssues([...issues]);
      toast.error('Failed to update task status. Please try again.');
    }
  };

  const getIssuesByStatus = (statusId: string) => issues.filter(issue => issue.status === statusId);

  const handleIssueClick = (issue: Issue) => {
    setSelectedIssue(issue);
    setIsSidebarOpen(true);
  };

  const handleCloseSidebar = () => setIsSidebarOpen(false);

  return (
    <div className={`h-full flex ${isSidebarOpen ? 'pr-[400px]' : ''} relative transition-all duration-300`}>
      <div className={`h-full flex flex-col ${className}`}>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex-1 overflow-x-auto overflow-y-hidden h-full">
            <div className="flex gap-4 h-full">
              {statuses.map(status => (
                <div key={status.id} className="flex-1 min-w-[280px] max-w-[600px] flex flex-col h-full">
                  <div className={`${status.color} p-2 rounded-t-lg`}>
                    <h3 className="font-medium text-center">{status.title}</h3>
                  </div>
                  <Droppable droppableId={status.id}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="bg-gray-50 dark:bg-neutral-800 p-2 rounded-b-lg flex-1 overflow-y-auto min-h-[500px]"
                      >
                        {getIssuesByStatus(status.id).map((issue, index) => (
                          <Draggable key={issue.id} draggableId={issue.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="mb-2"
                              >
                                <div
                                  className="cursor-pointer hover:shadow-md transition-shadow"
                                  onClick={() => handleIssueClick(issue)}
                                >
                                  <Card>
                                    <CardContent className="p-3">
                                      <div className="flex justify-between items-start">
                                        <h4 className="font-medium text-sm line-clamp-2">{issue.title}</h4>
                                        {issue.priority && (
                                          <span
                                            className={`px-2 py-0.5 rounded-full text-xs ${
                                              issue.priority === 'HIGH'
                                                ? 'bg-red-100 text-red-800'
                                                : issue.priority === 'MEDIUM'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-green-100 text-green-800'
                                            }`}
                                          >
                                            {issue.priority.charAt(0) + issue.priority.slice(1).toLowerCase()}
                                          </span>
                                        )}
                                      </div>
                                      {issue.assignee && (
                                        <div className="mt-2 flex items-center text-xs text-muted-foreground">
                                          <span className="truncate">
                                            {/* @ts-ignore */}
                                            {issue.assignee.name || 'Unassigned'}
                                          </span>
                                        </div>
                                      )}
                                    </CardContent>
                                  </Card>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </div>
          </div>
        </DragDropContext>
      </div>

      {isSidebarOpen && selectedIssue && (
        // <div className="fixed right-0 top-0 h-full w-[400px] bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 overflow-y-auto z-50">
          <IssueSidebar
            issue={selectedIssue}
            onClose={handleCloseSidebar}
            members={workspaceMembers}
            socket={socket}
          />
        // </div>
      )}
    </div>
  );
}
