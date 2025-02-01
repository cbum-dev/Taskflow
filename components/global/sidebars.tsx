'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { HomeIcon, InboxIcon, MoreHorizontalIcon, PlusIcon, ChevronLeftIcon, FolderIcon, ChevronDownIcon } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import axios from 'axios'
import { Sidebar, SidebarContent } from '@/components/ui/sidebar'

export function AppSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { user, access_token } = useAuthStore()
  const [workspaces, setWorkspaces] = useState([])
  const [selectedWorkspace, setSelectedWorkspace] = useState(null)
  const [projects, setProjects] = useState([])

  useEffect(() => {
    const fetchWorkspaces = async () => {
      if (!access_token) return
      try {
        const { data } = await axios.get("http://localhost:3001/api/workspace/user", {
          headers: { Authorization: `Bearer ${access_token}` }
        })
        setWorkspaces(data.data || [])

        const workspaceIdFromUrl = pathname.split('/')[2] // Extract workspaceId from URL
        const workspaceFromUrl = data.data.find(w => w.id === workspaceIdFromUrl)

        if (workspaceFromUrl) {
          setSelectedWorkspace(workspaceFromUrl)
          fetchProjects(workspaceFromUrl.id)
        }
      } catch (error) {
        console.error("Error fetching workspaces:", error)
      }
    }
    fetchWorkspaces()
  }, [access_token, pathname])

  const fetchProjects = async (workspaceId) => {
    if (!access_token) return
    try {
      const { data } = await axios.get(`http://localhost:3001/api/projects/workspace/${workspaceId}`, {
        headers: { Authorization: `Bearer ${access_token}` }
      })
      setProjects(data.data || [])
    } catch (error) {
      console.error("Error fetching projects:", error)
    }
  }

  const handleWorkspaceSelect = (workspace) => {
    setSelectedWorkspace(workspace)
    fetchProjects(workspace.id)
    router.push(`/dashboard/${workspace.id}`)
  }

  return (
    <Sidebar variant="inset" id="hiiii" className="h-[90vh]">
      <SidebarContent>
        <div className="flex items-center justify-between p-4 border-b">
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src={user.image} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{user.name}</span>
                <ChevronDownIcon className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {workspaces.map((workspace) => (
                  <DropdownMenuItem key={workspace.id} onClick={() => handleWorkspaceSelect(workspace)}>
                    {workspace.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        {selectedWorkspace && (
          <div className="flex-1 p-4 overflow-hidden">
            <div className="text-sm font-medium text-gray-500 mb-2">Projects in {selectedWorkspace.name}</div>
            <nav className="space-y-2">
              {projects.map((project) => (
                <Button key={project.id} variant="ghost" className="w-full justify-start" onClick={() => router.push(`/dashboard/${selectedWorkspace.id}/${project.id}`)}>
                  <FolderIcon className="w-5 h-5 mr-2" /> {project.name}
                </Button>
              ))}
            </nav>
          </div>
        )}
        <div className="p-4 border-t flex items-center justify-between">
          <Button variant="ghost">Invite</Button>
          <Button variant="ghost">Help</Button>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}
