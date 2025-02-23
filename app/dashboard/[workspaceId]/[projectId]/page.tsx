'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import { io } from 'socket.io-client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { PlusIcon } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import KanbanBoard from '@/components/KanbanBoard'
import IssuesTable from '@/components/IssuesTable'
import { Issue } from '@/types/issue'

const socket = io('https://json-schema-lint-zzda.vercel.app') // Connect to WebSocket server

export default function IssuesPage() {
  const { access_token, user } = useAuthStore()
  const { projectId } = useParams()
  const [issues, setIssues] = useState<Issue[]>([])
  const [search, setSearch] = useState('')
  const [newIssue, setNewIssue] = useState({ title: '', description: '', priority: 'MEDIUM', status: 'TODO' })
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const { data } = await axios.get(`https://json-schema-lint-zzda.vercel.app/api/issues/project/${projectId}`, {
          headers: { Authorization: `Bearer ${access_token}` },
        })
        setIssues(data.data || [])
      } catch (error) {
        console.error('Error fetching issues:', error)
      }
    }
    if (access_token && projectId) fetchIssues()

    // Listen for real-time issue updates
    socket.on("issueCreated", (newIssue) => {
      setIssues((prevIssues) => [newIssue, ...prevIssues])
    })

    return () => {
      socket.off("issueCreated") // Cleanup listener on unmount
    }
  }, [access_token, projectId])

  // const deleteIssue = async (issueId:string) => {
  //   try {
  //     await axios.delete(`https://json-schema-lint-zzda.vercel.app/api/issues/${issueId}`, {
  //       headers: { Authorization: `Bearer ${access_token}` },
  //     })
  //     setIssues((prevIssues) => prevIssues.filter(issue => issue.id !== issueId))
  //   } catch (error) {
  //     console.error('Error deleting issue:', error)
  //   }
  // }

  const handleCreateIssue = async () => {
    if (!newIssue.title.trim()) return
    try {
      const { data } = await axios.post(
        'https://json-schema-lint-zzda.vercel.app/api/issues',
        { ...newIssue, projectId, reporterId: user?.id },
        { headers: { Authorization: `Bearer ${access_token}` } }
      )
      socket.emit("newIssue", data) // Emit new issue event to the server
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error creating issue:', error)
    }
  }

  return (
    <div className="p-6 space-y-4">
      <Tabs defaultValue="kanban">
        <TabsList className="flex space-x-4">
          <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
          <TabsTrigger value="table">Issues Table</TabsTrigger>
        </TabsList>

        {/* Kanban Board Tab */}
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
                <Button onClick={handleCreateIssue} className="w-full mt-4">
                  Create Issue
                </Button>
              </DialogContent>
            </Dialog>
          </div>
          <KanbanBoard />
        </TabsContent>

        {/* Issues Table Tab */}
        <TabsContent value="table">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Project Issues</h1>
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Search issues..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-1/3"
              />
            </div>
          </div>
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
