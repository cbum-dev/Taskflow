'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { io } from 'socket.io-client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { PlusIcon, CalendarIcon, UserIcon, FlagIcon } from 'lucide-react'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Calendar } from '@/components/ui/calendar'
import { useAuthStore } from '@/store/authStore'
import KanbanBoard from '@/components/KanbanBoard'
import IssuesTable from '@/components/IssuesTable'
import { Issue } from '@/types/issue'

const socket = io('http://localhost:3001') // Connect to WebSocket server

export default function IssuesPage() {
  const { access_token, user } = useAuthStore()
  const { projectId, workspaceId } = useParams()
  const router = useRouter()
  const [issues, setIssues] = useState<Issue[]>([])
  const [workspaceMembers, setWorkspaceMembers] = useState<{ id: string; name: string }[]>([]) // Store workspace members
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [newIssue, setNewIssue] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    status: 'TODO',
    assigneeId: '',
    dueDate: null as Date | null,
  })

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3001/api/issues/project/${projectId}`, {
          headers: { Authorization: `Bearer ${access_token}` },
        })
        setIssues(data.data || [])
      } catch (error) {
        console.error('Error fetching issues:', error)
      }
    }
    if (access_token && projectId) fetchIssues()

    const fetchWorkspaceMembers = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3001/api/workspace/${workspaceId}/members`, {
          headers: { Authorization: `Bearer ${access_token}` },
        })
        setWorkspaceMembers(data.data || [])
        console.log(data)
      } catch (error) {
        console.error('Error fetching workspace members:', error)
      }
    }
    if (access_token && workspaceId) fetchWorkspaceMembers()

    // Listen for real-time issue updates
    socket.on("issueCreated", (newIssue) => {
      setIssues((prevIssues) => [newIssue, ...prevIssues])
    })

    return () => {
      socket.off("issueCreated") // Cleanup listener on unmount
    }
  }, [access_token, projectId, workspaceId])

  const handleCreateIssue = async () => {
    if (!newIssue.title.trim()) return;
    
    try {
      const { data } = await axios.post(
        'http://localhost:3001/api/issues',
        { ...newIssue, projectId, reporterId: user?.id },
        { headers: { Authorization: `Bearer ${access_token}` } }
      );

      // Optimistically update the UI immediately
      setIssues(prevIssues => [data, ...prevIssues]);

      // Reset form and close modal
      setIsModalOpen(false);
      setNewIssue({ 
        title: '', 
        description: '', 
        priority: 'MEDIUM', 
        status: 'TODO', 
        assigneeId: '', 
        dueDate: null 
      });

      // Refresh the page to show updated data
      router.refresh();

    } catch (error) {
      console.error('Error creating issue:', error);
      // Optionally show error to user
    }
  };

  return (
    <div className="p-6 space-y-4">
      <Tabs defaultValue="kanban">
        <TabsList className="flex space-x-4 bg-transparent">
          <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
          <TabsTrigger value="table">Issues Table</TabsTrigger>
        </TabsList>

        <TabsContent value="kanban">
          <div className="flex justify-end mb-4">
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button variant="default">
                  <PlusIcon className="w-4 h-4 mr-2" /> Add Issue
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Issue</DialogTitle>
                </DialogHeader>
                
                <Input
                  type="text"
                  placeholder="Issue Title"
                  value={newIssue.title}
                  onChange={(e) => setNewIssue({ ...newIssue, title: e.target.value })}
                  className="mb-2"
                />
                <Input
                  type="text"
                  placeholder="Issue Description"
                  value={newIssue.description}
                  onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })}
                  className="mb-2"
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="mb-2">
                      <UserIcon className="w-4 h-4 mr-2" />
                      {newIssue.assigneeId || "Assign User"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {workspaceMembers.map((member) => (
                      <DropdownMenuItem
                        key={member.id}
                        onClick={() => setNewIssue({ ...newIssue, assigneeId: member.id })}
                      >
                        {member.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="mb-2">
                      <FlagIcon className="w-4 h-4 mr-2" />
                      {newIssue.priority}

                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {["LOW", "MEDIUM", "HIGH", "URGENT"].map((priority) => (
                      <DropdownMenuItem key={priority} onClick={() => setNewIssue({ ...newIssue, priority })}>
                        {priority}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="mb-2">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {newIssue.dueDate ? newIssue.dueDate.toDateString() : "Select Due Date"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <Calendar
                      mode="single"
                      selected={newIssue.dueDate}
                      onSelect={(date) => date && setNewIssue({ ...newIssue, dueDate: date })}
                    />
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button onClick={()=> router.refresh()} className="w-full mt-4">
                  Create Issuesss
                </Button>
              </DialogContent>
            </Dialog>
          </div>
          <KanbanBoard issues={issues} />
        </TabsContent>

        <TabsContent value="table">
          <IssuesTable 
            issues={issues} 
            setIssues={setIssues} 
            search={search}
            setSearch={setSearch}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}