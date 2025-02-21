'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import { io } from 'socket.io-client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { PlusIcon } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import KanbanBoard from '@/components/KanbanBoard'
import IssuesTable from '@/components/IssuesTable'

const socket = io('http://localhost:3001')

export default function IssuesPage() {
  const { access_token, user } = useAuthStore()
  const { projectId } = useParams()
  const [issues, setIssues] = useState([])
  const [search, setSearch] = useState('')
  const [newIssue, setNewIssue] = useState({ title: '', description: '', priority: 'MEDIUM', status: 'TODO' })
  const [isModalOpen, setIsModalOpen] = useState(false)

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

    socket.on('issueUpdated', (updatedIssue) => {
      setIssues((prevIssues) =>
        prevIssues.map((issue) => (issue.id === updatedIssue.id ? updatedIssue : issue))
      )
    })

    return () => {
      socket.off('issueUpdated')
    }
  }, [access_token, projectId])

  const deleteIssue = async (issueId) => {
    try {
      await axios.delete(`http://localhost:3001/api/issues/${issueId}`,
        {
          headers: { Authorization: `Bearer ${access_token}` },

        }
        
      );
      setIssues((prevIssues) => prevIssues.filter(issue => issue.id !== issueId));
    } catch (error) {
      console.error('Error deleting issue:', error);
    }
  };
  
  const handleCreateIssue = async () => {
    if (!newIssue.title.trim()) return
    try {
      const { data } = await axios.post(
        'http://localhost:3001/api/issues',
        { ...newIssue, projectId, reporterId: user?.id },
        { headers: { Authorization: `Bearer ${access_token}` } }
      )
      setIssues((prev) => [data, ...prev])
      socket.emit('newIssue', data)
      setNewIssue({ title: '', description: '', priority: 'MEDIUM', status: 'TODO', reporterId: user?.id })
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error creating issue:', error)
    }
  }

  return (
    <div className="p-6 space-y-4">
      <KanbanBoard issues={issues} />
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
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button variant="primary">
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
      </div>
      <IssuesTable issues={issues} setIssues={setIssues}  search={search} deleteIssue={deleteIssue} />
    </div>
  )
}