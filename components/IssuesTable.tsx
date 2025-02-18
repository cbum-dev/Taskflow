'use client'

import React from 'react'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { FlagIcon, UserIcon,TrashIcon } from 'lucide-react'

export default function IssuesTable({ issues, search,deleteIssue }) {
  const statuses = ["TODO", "IN_PROGRESS", "IN_REVIEW", "HOLD_STAGE", "COMPLETE"]
  const priorities = ["LOW", "MEDIUM", "HIGH", "URGENT"]

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Assignee</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {issues
          .filter(issue => issue?.title?.toLowerCase().includes(search.toLowerCase()))
          .map(issue => (
            <TableRow key={issue.id}>
              <TableCell>{issue?.title || "Untitled Issue"}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Badge>{issue?.status || "Select Status"}</Badge>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {statuses.map((status) => (
                      <DropdownMenuItem key={status}>{status}</DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <FlagIcon className="w-4 h-4 mr-2" /> {issue?.priority || "Select Priority"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {priorities.map((priority) => (
                      <DropdownMenuItem key={priority}>{priority}</DropdownMenuItem>
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
                </DropdownMenu>
                <Button variant="destructive" onClick={() => deleteIssue && deleteIssue(issue.id)}>
  <TrashIcon className="w-4 h-4" />
</Button>

              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  )
}
