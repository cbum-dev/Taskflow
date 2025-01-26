"use client";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import ProjectCard from "@/components/projectComponent/ProjectCard";

function Page() {
  const user = useAuthStore((state) => state.user);
  const access_token = useAuthStore((state) => state.access_token);
  const [workspace, setWorkspace] = useState([]); 
  const [workspaceName, setWorkspaceName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const getWorkspace = async () => {
      try {
        const { data } = await axios.get("http://localhost:3001/api/workspace/", {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

          setWorkspace(data.data);
      } catch (error) {
        console.error("Error fetching workspace:", error);
      }
    };

    if (access_token) {
      getWorkspace();
    } else {
      console.warn("Access token is missing");
    }
  }, [access_token]);

  const gotoProject = async (workspaceId:string) => {
    const getProject = await axios.get(`http://localhost:3001/api/projects/workspace/${workspaceId}`,
      {headers:{
        Authorization: `Bearer ${access_token}`
      }}
    );
    console.log(getProject)
  }

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

      setWorkspace((prev) => (Array.isArray(prev) ? [...prev, data] : [data]));
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
            {workspace.length > 0 ? (
              <div>
                {workspace.map((item, index) => (
                  <Card onClick={() => gotoProject(item.id)} key={index} className="mb-4 p-4">
                    <h3>{item.name}</h3>
                    <h3>{item.id}</h3>
                    <ProjectCard projectName={item.name} projectDescription={item.description}/>

                    <p>{item.description}</p>
                  </Card>
                ))}
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
