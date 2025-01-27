"use client";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import ProjectCard from "@/components/projectComponent/ProjectCard";

type Workspace = {
  id: string;
  name: string;
  description: string;
};

type Project = {
  id: string;
  name: string;
  description: string;
};

type Issue = {
  id: string;
  title: string;
  description: string;
};

function Page() {
  const user = useAuthStore((state) => state.user);
  const access_token = useAuthStore((state) => state.access_token);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [workspaceName, setWorkspaceName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    const getWorkspaces = async () => {
      try {
        const { data } = await axios.get("http://localhost:3001/api/workspace/user", {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        setWorkspaces(data.data || []);
      } catch (error) {
        console.error("Error fetching workspaces:", error);
      }
    };

    if (access_token) {
      getWorkspaces();
    } else {
      console.warn("Access token is missing");
    }
  }, [access_token]);

  const gotoProject = async (workspaceId: string) => {
    try {
      const { data } = await axios.get(
        `http://localhost:3001/api/projects/workspace/${workspaceId}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      setProjects(data.data || []);
      setIssues([]); 
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const showIssues = async (projectId: string) => {
    try {
      const { data } = await axios.get(
        `http://localhost:3001/api/issues/project/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      setIssues(data.data || []);
    } catch (error) {
      console.error("Error fetching issues:", error);
    }
  };

  const handlePostWorkspace = async () => {
    if (!workspaceName.trim()) {
      console.warn("Workspace name cannot be empty");
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:3001/api/workspace/",
        { name: workspaceName, description },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      setWorkspaces((prev) => [...prev, data]);
      setWorkspaceName("");
      setDescription("");
      console.log("Workspace posted successfully:", data);
    } catch (error) {
      console.error("Error posting workspace:", error);
    }
  };

  return (
    <div>
      {user ? (
        <div>
          <h1>Welcome, {user.name}!</h1>
          <p>Email: {user.email}</p>

          <div className="mt-6">
            <h2>Create a Workspace</h2>
            <Input
              type="text"
              placeholder="Workspace Name"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              className="mb-2"
            />
            <Input
              type="text"
              placeholder="Description (Optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mb-4"
            />
            <Button onClick={handlePostWorkspace}>Create Workspace</Button>
          </div>

          <div className="mt-6">
            <h2>Your Workspaces</h2>
            {workspaces.length > 0 ? (
              <div>
                {workspaces.map((workspace) => (
                  <Card
                    onClick={() => gotoProject(workspace.id)}
                    key={workspace.id}
                    className="mb-4 w-1/4 p-4 cursor-pointer"
                  >
                    <h3>{workspace.name}</h3>
                    <p>{workspace.description}</p>
                  </Card>
                ))}
                {projects.length > 0 ? (
                  projects.map((project) => (
                    <div key={project.id} className="mt-4">
                      <ProjectCard
                        projectName={project.name}
                        projectDescription={project.description}
                      />
                      <Button
                        onClick={() => showIssues(project.id)}
                        className="mt-2"
                      >
                        Show Issues
                      </Button>
                      {issues.length > 0 &&
                        issues.map((issue) => (
                          <Card key={issue.id} className="mt-2 w-1/5 p-2">
                            <h4>{issue.title}</h4>
                            <p>{issue.description}</p>
                          </Card>
                        ))}
                    </div>
                  ))
                ) : (
                  <p>No projects found.</p>
                )}
              </div>
            ) : (
              <p>No workspaces found.</p>
            )}
          </div>
        </div>
      ) : (
        <div>
          <p>No user logged in.</p>
        </div>
      )}
    </div>
  );
}

export default Page;
