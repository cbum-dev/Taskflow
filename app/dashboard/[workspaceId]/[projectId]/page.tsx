'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import { io } from 'socket.io-client'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { FlagIcon, UserIcon, CalendarIcon } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { Calendar } from '@/components/ui/calendar'

const socket = io('http://localhost:3001') // Change to your backend URL

export default function IssuesPage() {
  const { access_token } = useAuthStore()
  const { projectId } = useParams()
  const [issues, setIssues] = useState([])
  const [search, setSearch] = useState('')
  const [statuses] = useState(["TODO", "IN_PROGRESS", "IN_REVIEW", "HOLD_STAGE", "COMPLETE"]);
  const [priorities] = useState(["LOW", "MEDIUM", "HIGH", "URGENT"]);
  const [assignees, setAssignees] = useState([]);

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

    // Listen for issue updates from WebSocket
    socket.on('issueUpdated', (updatedIssue) => {
      setIssues((prevIssues) =>
        prevIssues.map((issue) => (issue.id === updatedIssue.id ? updatedIssue : issue))
      )
    })

    return () => {
      socket.off('issueUpdated') // Cleanup on unmount
    }
  }, [access_token, projectId])

  const updateIssue = async (issueId, field, value) => {
    try {
      await axios.put(`http://localhost:3001/api/issues/${issueId}`, { [field]: value }, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      socket.emit('updateIssue', { id: issueId, field, value }) // Notify server
    } catch (error) {
      console.error('Error updating issue:', error);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Project Issues</h1>
        <Input
          type="text"
          placeholder="Search issues..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/3"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead>Due Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {issues.filter(issue => issue.title.toLowerCase().includes(search.toLowerCase())).map(issue => (
            <TableRow key={issue.id}>
              <TableCell>{issue.title}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Badge>{issue.status || "Select Status"}</Badge>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {statuses.map((status) => (
                      <DropdownMenuItem key={status} onClick={() => updateIssue(issue.id, "status", status)}>
                        {status}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <FlagIcon className="w-4 h-4 mr-2" /> {issue.priority || "Select Priority"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {priorities.map((priority) => (
                      <DropdownMenuItem key={priority} onClick={() => updateIssue(issue.id, "priority", priority)}>
                        {priority}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <UserIcon className="w-4 h-4 mr-2" /> {issue.assignee || "Assign User"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {assignees.map((assignee) => (
                      <DropdownMenuItem key={assignee.id} onClick={() => updateIssue(issue.id, "assignee", assignee.name)}>
                        {assignee.name}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuItem>
                      <Button variant="ghost" className="w-full">Send Invite</Button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <CalendarIcon className="w-4 h-4 mr-2" /> {issue.dueDate ? new Date(issue.dueDate).toLocaleString() : "Select Date"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
<Calendar
  selected={issue.dueDate ? new Date(issue.dueDate) : null}
  onChange={(date) => updateIssue(issue.id, "dueDate", date.toISOString())}
/>

                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
