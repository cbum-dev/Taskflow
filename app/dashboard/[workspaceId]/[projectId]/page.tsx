'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import { io } from 'socket.io-client'
import { useAuthStore } from '@/store/authStore'
import IssueTable from '@/components/issueTable'
import CreateIssue from '@/components/CreateIssuesForm'


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
  const { access_token } = useAuthStore()
  const { projectId, workspaceId } = useParams()
  const [issues, setIssues] = useState<Issue[]>([])

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


  useEffect(() => {
    if (access_token && projectId) {
      fetchIssues()
    }

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

  return (
    <div className="px-6 space-y-4">
      <CreateIssue
        issues={issues}
        setIssues={setIssues}
      />
      <IssueTable/>
    </div>
  )
}