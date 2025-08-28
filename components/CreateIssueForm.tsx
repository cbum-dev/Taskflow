'use client'

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { PlusIcon } from 'lucide-react'
import axios from 'axios'
import { useAuthStore } from '@/store/authStore'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'

interface Issue {
  id: string;
  title: string;
  description?: string;
  priority: string;
  status: string;
}

interface CreateIssueFormProps {
  onIssueCreated: (issue: Issue) => void;
}

export default function CreateIssueForm({ onIssueCreated }: CreateIssueFormProps) {
  const { access_token, user } = useAuthStore()
  const { projectId } = useParams()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newIssue, setNewIssue] = useState({ title: '', description: '', priority: 'MEDIUM', status: 'TODO' })
  const [loading, setLoading] = useState(false)

  const handleCreateIssue = async () => {
    if (!newIssue.title.trim()) return
    setLoading(true)
    try {
      const { data } = await axios.post(
        'http://localhost:3001/api/issues',
        { ...newIssue, projectId, reporterId: user?.id },
        { headers: { Authorization: `Bearer ${access_token}` } }
      )

      onIssueCreated(data) 
      setNewIssue({ title: '', description: '', priority: 'MEDIUM', status: 'TODO' })
      setIsModalOpen(false) 
      toast("Issue created successfully", {
        description: "You can click to start working on your new issue.",
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
    } catch (error) {
      toast("Failed to create issue", {
        description: "Please try again later.",
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      console.error('Error creating issue:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button variant="default" disabled={loading}>
          <PlusIcon className="w-4 h-4 mr-2" /> {loading ? 'Adding...' : 'Add Issue'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Issues</DialogTitle>
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
        <Button onClick={handleCreateIssue} className="w-full mt-4" disabled={loading}>
          {loading ? 'Creating...' : 'Create Issues'}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
