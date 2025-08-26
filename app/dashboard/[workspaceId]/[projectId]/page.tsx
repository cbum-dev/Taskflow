'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import { io } from 'socket.io-client'
// import { Input } from '@/components/ui/input'
// import { Button } from '@/components/ui/button'
// import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
// import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
// import { PlusIcon, CalendarIcon, UserIcon, FlagIcon } from 'lucide-react'
// import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
// import { Calendar } from '@/components/ui/calendar'
import { useAuthStore } from '@/store/authStore'
// import KanbanBoard from '@/components/KanbanBoard'
import IssueTable from '@/components/issueTable'
// import IssuesTable from '@/components/IssuesTable'


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
  // const [issues, setIssues] = useState<Issue[]>([])
  // const [workspaceMembers, setWorkspaceMembers] = useState<{ id: string; name: string }[]>([])
  // const [search, setSearch] = useState('')
  // const [isModalOpen, setIsModalOpen] = useState(false)
  // const [isCreating, setIsCreating] = useState(false)
  // const [error, setError] = useState('')
  // const [success, setSuccess] = useState(false)
  // const [refreshKey, setRefreshKey] = useState(0)

  // const [newIssue, setNewIssue] = useState({
  //   title: '',
  //   description: '',
  //   priority: 'MEDIUM',
  //   status: 'TODO',
  //   assigneeId: '',
  //   dueDate: null as Date | null,
  // })

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
      setRefreshKey(prev => prev + 1) 
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

  // const handleCreateIssue = async () => {
  //   if (!newIssue.title.trim()) return
    
  //   setIsCreating(true)
  //   setError('')
  //   setSuccess(false)

  //   try {
  //     const { data } = await axios.post(
  //       'http://localhost:3001/api/issues',
  //       { ...newIssue, projectId, reporterId: user?.id },
  //       { headers: { Authorization: `Bearer ${access_token}` } }
  //     )

  //     // Update state and force KanbanBoard refresh
  //     setIssues(prev => [data, ...prev])
  //     setRefreshKey(prev => prev + 1)
  //     socket.emit("issueCreated", data)

  //     setIsModalOpen(false)
  //     setNewIssue({ 
  //       title: '', 
  //       description: '', 
  //       priority: 'MEDIUM', 
  //       status: 'TODO', 
  //       assigneeId: '', 
  //       dueDate: null 
  //     })
  //     setSuccess(true)
  //   } catch (error) {
  //     console.error('Error creating issue:', error)
  //     setError('Failed to create issue. Please try again.')
  //   } finally {
  //     setIsCreating(false)
  //   }
  // }

  return (
    <div className="px-6 space-y-4">
        <IssueTable/>
    </div>
  )
}