'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
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


const socket = io('http://localhost:3001')

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


export default function IssuesPage() {
  const { access_token, user } = useAuthStore()
  const { projectId, workspaceId } = useParams()
  const [issues, setIssues] = useState<Issue[]>([])
  const [workspaceMembers, setWorkspaceMembers] = useState<{ id: string; name: string }[]>([])
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const [newIssue, setNewIssue] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    status: 'TODO',
    assigneeId: '',
    dueDate: null as Date | null,
  })

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

  const fetchWorkspaceMembers = async () => {
    try {
      const { data } = await axios.get(`http://localhost:3001/api/workspace/${workspaceId}/members`, {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      setWorkspaceMembers(data.data || [])
    } catch (error) {
      console.error('Error fetching workspace members:', error)
    }
  }

  useEffect(() => {
    if (access_token && projectId) {
      fetchIssues()
      fetchWorkspaceMembers()
    }

    socket.on("issueCreated", (newIssue) => {
      setIssues(prev => [newIssue, ...prev])
      setRefreshKey(prev => prev + 1) // Trigger refresh
    })

    socket.on("issueUpdated", (updatedIssue) => {
      setIssues(prev => prev.map(issue => 
        issue.id === updatedIssue.id ? updatedIssue : issue
      ))
    })

    socket.on("issueDeleted", (deletedId) => {
      setIssues(prev => prev.filter(issue => issue.id !== deletedId))
    })

    return () => {
      socket.off("issueCreated")
      socket.off("issueUpdated")
      socket.off("issueDeleted")
    }
  }, [access_token, projectId, workspaceId])

  const handleCreateIssue = async () => {
    if (!newIssue.title.trim()) return
    
    setIsCreating(true)
    setError('')
    setSuccess(false)

    try {
      const { data } = await axios.post(
        'http://localhost:3001/api/issues',
        { ...newIssue, projectId, reporterId: user?.id },
        { headers: { Authorization: `Bearer ${access_token}` } }
      )

      // Update state and force KanbanBoard refresh
      setIssues(prev => [data, ...prev])
      setRefreshKey(prev => prev + 1)
      socket.emit("issueCreated", data)

      setIsModalOpen(false)
      setNewIssue({ 
        title: '', 
        description: '', 
        priority: 'MEDIUM', 
        status: 'TODO', 
        assigneeId: '', 
        dueDate: null 
      })
      setSuccess(true)
    } catch (error) {
      console.error('Error creating issue:', error)
      setError('Failed to create issue. Please try again.')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="px-6 space-y-4">
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
                
                {error && <div className="text-red-500 mb-2">{error}</div>}
                {success && <div className="text-green-500 mb-2">Issue created successfully!</div>}
                
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
                      {newIssue.assigneeId 
                        ? workspaceMembers.find(m => m.id === newIssue.assigneeId)?.name 
                        : "Assign User"}
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
                      <DropdownMenuItem 
                        key={priority} 
                        onClick={() => setNewIssue({ ...newIssue, priority })}
                      >
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
                      selected={newIssue.dueDate || undefined}
                      onSelect={(date) => setNewIssue({ ...newIssue, dueDate: date || null })}
                    />
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button 
                  onClick={handleCreateIssue} 
                  className="w-full mt-4"
                  disabled={isCreating}
                >
                  {isCreating ? "Creating..." : "Create Issue"}
                </Button>
              </DialogContent>
            </Dialog>
          </div>
          <KanbanBoard key={refreshKey} issues={issues} />
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