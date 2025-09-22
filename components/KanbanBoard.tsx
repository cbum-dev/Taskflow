'use client';

import React from 'react';
import { Issue, Status } from '@/types/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Button } from './ui/button';
import { useAuthStore } from '@/store/authStore';
import { updateIssueStatus } from '@/services/api';
import { toast } from 'sonner';

interface KanbanBoardProps {
  issues: Issue[];
  onUpdateIssues: (issues: Issue[]) => void;
}

const statuses = [
  { id: 'TODO', title: 'To Do', color: 'bg-gray-200' },
  { id: 'IN_PROGRESS', title: 'In Progress', color: 'bg-blue-200' },
  { id: 'IN_REVIEW', title: 'In Review', color: 'bg-yellow-200' },
  { id: 'DONE', title: 'Done', color: 'bg-green-200' },
];

export default function KanbanBoard({ issues, onUpdateIssues }: KanbanBoardProps) {
  const { access_token } = useAuthStore();

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    // Dropped outside the list or no change in position
    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
      return;
    }

    try {
      // Find the issue that was moved
      const issue = issues.find(issue => issue.id === draggableId);
      if (!issue) return;

      // Optimistically update the UI
      const updatedIssues = issues.map(i => 
        i.id === issue.id ? { ...i, status: destination.droppableId as Status } : i
      );
      
      // Update local state immediately for instant feedback
      onUpdateIssues(updatedIssues);

      // Only make API call if status changed
      if (source.droppableId !== destination.droppableId) {
        await updateIssueStatus(issue.id, destination.droppableId as Status, access_token);
        
        // Show success message
        toast.success('Task status updated successfully');
      }
    } catch (error) {
      console.error('Error updating issue status:', error);
      
      // Revert the UI on error
      onUpdateIssues([...issues]);
      
      // Show error message
      toast.error('Failed to update task status. Please try again.');
    }
  };

  const getIssuesByStatus = (statusId: string) => {
    return issues.filter(issue => issue.status === statusId);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {statuses.map(status => (
          <div key={status.id} className="flex-shrink-0 w-80">
            <div className={`${status.color} p-2 rounded-t-lg`}>
              <h3 className="font-medium text-center">{status.title}</h3>
            </div>
            <Droppable droppableId={status.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-gray-50 dark:bg-gray-800 p-2 rounded-b-lg min-h-[500px]"
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
                          <Card className="hover:shadow-md transition-shadow">
                            <CardHeader className="p-4 pb-2">
                              <CardTitle className="text-sm font-medium line-clamp-2">
                                {issue.title}
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0 text-xs text-gray-500">
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-muted-foreground">
                                  {issue.assignee?.name || 'Unassigned'}
                                </span>
                                {issue.priority && (
                                  <span 
                                    className={`px-2 py-1 rounded-full text-xs ${
                                      issue.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                                      issue.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-green-100 text-green-800'
                                    }`}
                                  >
                                    {issue.priority.charAt(0) + issue.priority.slice(1).toLowerCase()}
                                  </span>
                                )}
                              </div>
                            </CardContent>
                          </Card>
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
    </DragDropContext>
  );
}
