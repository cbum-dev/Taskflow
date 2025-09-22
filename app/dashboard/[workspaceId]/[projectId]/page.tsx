'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { io } from 'socket.io-client'
import { useAuthStore } from '@/store/authStore'
import IssueTable from '@/components/issueTable'
import CreateIssue from '@/components/CreateIssuesForm'
import { Issue } from '@/types/types'
import api from '@/services/api'

const socket = io('https://taskflow-backend-dkwh.onrender.com')


export default function IssuesPage() {
  const { access_token } = useAuthStore()
  const { projectId } = useParams()
  const [issues, setIssuesState] = useState<Issue[]>([])

  const setIssues = useCallback((action: React.SetStateAction<Issue[]>) => {
    setIssuesState(action)
  }, [])

  const fetchIssues = useCallback(async () => {
    try {
      const { data } = await api.get(`/issues/project/${projectId}`);
      setIssues(data.data || []);
    } catch (error) {
      console.error('Error fetching issues:', error)
    }
  }, [projectId, setIssues])

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
  }, [access_token, projectId, fetchIssues, setIssues])

  return (
    <div className="px-6 space-y-4">
      <CreateIssue
        setIssues={setIssues}
      />
      <IssueTable issues={issues} setIssues={setIssues} />
    </div>
  )
}