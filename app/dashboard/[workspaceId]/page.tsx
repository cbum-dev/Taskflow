"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  ArrowRight,
  Folder,
  Users,
  Settings,
  Activity,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Link from "next/link";
type Project = {
  id: string;
  name: string;
  description: string;
  members: number;
  issues: number;
  lastUpdated: string;
  avatar?: string;
};

type Workspace = {
  id: string;
  name: string;
  description?: string;
};

export default function WorkspaceDashboard() {
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, access_token } = useAuthStore();
  const [openDialog, setOpenDialog] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [creatingProject, setCreatingProject] = useState(false);
  const [error, setError] = useState("");

  const fetchWorkspace = async () => {
    try {
      const res = await axios.get(
        `https://json-schema-lint.vercel.app/api/workspace/${workspaceId}`,
        { headers: { Authorization: `Bearer ${access_token}` } }
      );
      setWorkspace(res.data.data || null);
    } catch (error) {
      console.error("Error fetching workspace:", error);
    }
  };
  
  const fetchProjects = async () => {
    try {
      const res = await axios.get(
        `https://json-schema-lint.vercel.app/api/projects/workspace/${workspaceId}`,
        { headers: { Authorization: `Bearer ${access_token}` } }
      );
      setProjects(res.data.data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };
  
  const fetchAll = async () => {
    setLoading(true);
    await Promise.all([fetchWorkspace(), fetchProjects()]);
    setLoading(false);
  };
  
  useEffect(() => {
    fetchAll();
  }, [access_token]);
  

  const handleCreateProject = async (e:any) => {
    e.preventDefault();
    setCreatingProject(true);
    setError("");
    try {
      await axios.post(
        "https://json-schema-lint.vercel.app/api/projects",
        {
          name: newProjectName,
          description: newProjectDescription,
          workspaceId: workspaceId,
          ownerId: user?.id,
        },
        { headers: { Authorization: `Bearer ${access_token}` } }
      );
      setNewProjectName("");
      setNewProjectDescription("");
      setOpenDialog(false);
      fetchAll();
    } catch (err) {
      setError("Failed to create project");
      console.error(err);
    } finally {
      setCreatingProject(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-bold mb-4">Workspace not found</h2>
        <Button variant="outline">Back to workspaces</Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{workspace.name}</h1>
          <Badge variant="outline" className="mt-2 capitalize">
            {workspace.name} plan
          </Badge>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Users className="mr-2 h-4 w-4" />
            Members
          </Button>
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="border-2 border-dashed rounded-lg p-12 text-center">
          <Folder className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium">No projects yet</h3>
          <p className="text-muted-foreground mt-2">
            Get started by creating your first project
          </p>
          <Button onClick={() => setOpenDialog(true)} className="mt-6">
            <Plus className="mr-2 h-4 w-4" />
            New Project {openDialog}
          </Button>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Your Projects</h2>
            <Button onClick={() => setOpenDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects?.map((project) => (
              <Card
                key={project.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader className="flex flex-row items-start space-x-4 space-y-0">
                  {project.avatar ? (
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={project.avatar} />
                      <AvatarFallback>{project.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="h-12 w-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <Folder className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                    </div>
                  )}
                  <div className="space-y-1">
                    <CardTitle>{project.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {project.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Users className="mr-1 h-3 w-3" />
                      {project.members} members
                    </div>
                    <div className="flex items-center">
                      <Activity className="mr-1 h-3 w-3" />
                      {project.issues} issues
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <span className="text-xs text-muted-foreground">
                    Updated {project.lastUpdated}
                  </span>
                  <Link href={`${workspaceId}/${project.id}`}>                  <Button variant="ghost" size="sm" className="text-primary">
                    View <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                  </Link>

                </CardFooter>
              </Card>
            ))}
          </div>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogContent>
              <Card className=" shadow-md">
                <CardHeader>
                  <CardTitle className="text-center text-xl">
                    Create Project
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  
                  <form onSubmit={handleCreateProject} className="space-y-4">
                    <Input
                      type="text"
                      placeholder="Project Name"
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      disabled={creatingProject}
                    />
                    <Input
                      type="text"
                      placeholder="Description"
                      value={newProjectDescription}
                      onChange={(e) => setNewProjectDescription(e.target.value)}
                      disabled={creatingProject}
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={creatingProject || !newProjectName}
                    >
                      {creatingProject ? "Creating..." : "Create Project"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
