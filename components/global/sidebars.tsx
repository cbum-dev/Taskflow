'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { PlusIcon, FolderIcon, ChevronDownIcon } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { Sidebar, SidebarContent } from '@/components/ui/sidebar'
import { Input } from '@/components/ui/input'
import { io } from "socket.io-client";
import {toast} from "sonner";
import api from '@/services/api'
interface Workspace {
  id: string;
  name: string;
  description?: string;
}

interface Project {
  id: string;
  name: string;
  workspaceId: string;
}

const socket = io('https://taskflow-backend-dkwh.onrender.com')
export function AppSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, access_token } = useAuthStore()
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [newWorkspaceName, setNewWorkspaceName] = useState("")
  const [newProjectName, setNewProjectName] = useState("")

  const fetchProjects = useCallback(async (workspaceId: string) => {
    if (!access_token) return
    try {
      const { data } = await api.get(`/projects/workspace/${workspaceId}`)
      setProjects(data.data || [])
    } catch (error) {
      console.error("Error fetching projects:", error)
    }
  }, [access_token, router])
  useEffect(() => {
    const fetchWorkspaces = async () => {
      if (!access_token) return
      try {
        const { data } = await api.get("/workspace/user")
        setWorkspaces(data.data || [])

        const workspaceIdFromUrl = pathname.split('/')[2];
        const workspaceFromUrl = data.data.find((w: Workspace) => w.id === workspaceIdFromUrl) || data.data[0];

        if (workspaceFromUrl) {
          setSelectedWorkspace(workspaceFromUrl)
          fetchProjects(workspaceFromUrl.id)
        }
      } catch (error) {
        console.error("Error fetching workspaces:", error)
      }
    }
    fetchWorkspaces()
  }, [access_token, pathname, fetchProjects])

  const handleWorkspaceSelect = (workspace: Workspace) => {
    setSelectedWorkspace(workspace)
    fetchProjects(workspace.id)
    router.push(`/dashboard/${workspace.id}`)
  }

  useEffect(() => {
    socket.on("projectCreated", (newProject) => {
      setProjects((prev) => [newProject, ...prev]);
    });

    socket.on("projectUpdated", (updatedProject) => {
      setProjects((prev) =>
        prev.map((project) =>
          project.id === updatedProject.id ? updatedProject : project
        )
      );
    });

    socket.on("projectDeleted", (deletedId) => {
      setProjects((prev) => prev.filter((project) => project.id !== deletedId));
    });

    return () => {
      socket.off("projectCreated");
      socket.off("projectUpdated");
      socket.off("projectDeleted");
    };
  }, [access_token]);

  const handleAddWorkspace = async () => {
    if (!newWorkspaceName.trim()) return

    try {
      const { data } = await api.post("/workspace", { name: newWorkspaceName })
      setWorkspaces((prev) => [...prev, data])
      setNewWorkspaceName("")
      toast("Workspace created successfully", {
        description: "You can click to start working on your new workspace.",
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
    } catch (error) {
      console.error("Error adding workspace:", error)
    }
  }

  const handleAddProject = async () => {
    if (!newProjectName.trim() || !selectedWorkspace) return;
  
    try {
      await api.post("/projects", { name: newProjectName, workspaceId: selectedWorkspace.id, ownerId: user?.id });
      setNewProjectName("");
      socket.emit("projectCreated", { name: newProjectName, workspaceId: selectedWorkspace.id, ownerId: user?.id });
      await fetchProjects(selectedWorkspace.id);
      toast("Project created successfully", {
        description: "You can click to start working on your new project.",
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
    } catch (error) {
      toast("Failed to create project", {
        description: "Please try again later.",
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      console.error("Error adding project:", error);
    }
  };


  return (
    <Sidebar variant="inset" id="hiiii" className="h-[95vh]">
      <SidebarContent>
        <div className="flex items-center justify-between p-4 border-b">
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src={user.id} alt={user.name} />
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
                <Separator />
                <div className="p-2">
                  <Input
                    type="text"
                    placeholder="New Workspace"
                    value={newWorkspaceName}
                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                    className="mb-2"
                  />
                  <Button variant="default" className="w-full" onClick={handleAddWorkspace}>
                    <PlusIcon className="w-4 h-4 mr-2" /> Add Workspace
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        {selectedWorkspace && (
          <div className="flex-1 p-4 overflow-auto">
            <div className="text-sm font-medium text-gray-500 mb-2">
              Projects in {selectedWorkspace.name}
            </div>
            <nav className="space-y-2">
              {projects.map((project) => (
                <Button key={project.id} variant="ghost" className="w-full justify-start" onClick={() => router.push(`/dashboard/${selectedWorkspace.id}/${project.id}`)}>
                  <FolderIcon className="w-5 h-5 mr-2" /> {project.name}
                </Button>
              ))}
            </nav>
            <form>
              
            </form>
            <div className="mt-4">
              <Input
                type="text"
                placeholder="New Project"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                className="mb-2"
                onClick={() => router.refresh()}
              />
              <Button variant="default" className="w-full" onClick={handleAddProject}>
                <PlusIcon className="w-4 h-4 mr-2" /> Add Project
              </Button>
            </div>
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
