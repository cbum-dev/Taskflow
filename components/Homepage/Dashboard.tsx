import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, ChevronRight, Loader2, Folder, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

type Workspace = {
  id: string;
  name: string;
  description: string;
  projectsCount: number;
  updatedAt: string;
};

type Project = {
  id: string;
  name: string;
  description: string;
  issuesCount: number;
  workspaceId: string;
  updatedAt: string;
};

type Issue = {
  id: string;
  title: string;
  status: 'open' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  projectId: string;
  updatedAt: string;
};

const Dashboard = () => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState({
    workspaces: true,
    projects: true,
    issues: true
  });
  const [activeWorkspace, setActiveWorkspace] = useState<string | null>(null);
  const access_token = useAuthStore((state) => state.access_token);
  const username = useAuthStore((state) => state.user)

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/workspace/user',{
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
        setWorkspaces(response.data.data || []);
        if (response.data.data.length > 0) {
          setActiveWorkspace(response.data.data[0].id);
        }
      } catch (error) {
        console.error('Error fetching workspaces:', error);
      } finally {
        setLoading(prev => ({ ...prev, workspaces: false }));
      }
    };

    fetchWorkspaces();
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!activeWorkspace) return;
      
      try {
        setLoading(prev => ({ ...prev, projects: true }));
        const response = await axios.get(`http://localhost:3001/api/projects/workspace/${activeWorkspace}`,{
          headers: { Authorization: `Bearer ${access_token}` }
        });
        setProjects(response.data.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(prev => ({ ...prev, projects: false }));
      }
    };

    fetchProjects();
  }, [activeWorkspace]);

  useEffect(() => {
    const fetchIssues = async () => {
      if (projects.length === 0) return;
      
      try {
        setLoading(prev => ({ ...prev, issues: true }));
        const projectIds = projects.map(p => p.id).join(',');
        const response = await axios.get(`http://localhost:3001/api/issues/project/${projectIds}`,{
          headers: { Authorization: `Bearer ${access_token}` },
        });
        setIssues(response.data.data);
      } catch (error) {
        console.error('Error fetching issues:', error);
      } finally {
        setLoading(prev => ({ ...prev, issues: false }));
      }
    };

    fetchIssues();
  }, [projects]);

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return <Badge variant="destructive" className="text-xs">High</Badge>;
      case 'MEDIUM':
        return <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-xs">Medium</Badge>;
      default:
        return <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs">Low</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DONE':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'IN_PROGRESS':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      default:
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="px-6 z-10 py-24 space-y-8 w-full min-h-screen relative bg-neutral-50 dark:bg-neutral-950">
      {/* Subtle grid background */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, <span className="text-blue-600 dark:text-blue-400">{username?.name}</span>!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Here's what's happening with your projects today
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
          <Button 
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-blue-500/20 transition-all"
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Workspace
          </Button>
        </div>

        {/* Workspaces Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center">
              <Folder className="w-5 h-5 mr-2 text-blue-500" />
              Your Workspaces
            </h2>
            <Link href="/workspaces" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center group">
              View all workspaces
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading.workspaces ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            </div>
          ) : workspaces.length === 0 ? (
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
              <CardContent className="p-8 text-center">
                <Folder className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No workspaces found</h3>
                <p className="text-gray-600 dark:text-gray-400">Create your first workspace to get started</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {workspaces?.map(workspace => (
                <Card 
                  key={workspace.id} 
                  className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md ${
                    activeWorkspace === workspace.id ? 'ring-2 ring-blue-500/30 border-blue-300 dark:border-blue-500' : ''
                  }`}
                  onClick={() => setActiveWorkspace(workspace.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">{workspace.name}</CardTitle>
                      <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
                        {workspace.projectsCount} {workspace.projectsCount === 1 ? 'project' : 'projects'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 dark:text-gray-400 mb-3">
                      {workspace.description || 'No description provided'}
                    </CardDescription>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      Updated {new Date(workspace.updatedAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Projects Section */}
        {activeWorkspace && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-indigo-500" />
                Active Projects
              </h2>
              <Link 
                href={`/projects?workspace=${activeWorkspace}`} 
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center group"
              >
                View all projects
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {loading.projects ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
              </div>
            ) : projects.length === 0 ? (
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                <CardContent className="p-8 text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No projects found</h3>
                  <p className="text-gray-600 dark:text-gray-400">Create your first project in this workspace</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {projects?.map(project => (
                  <Link key={project.id} href={`/project/${project.id}`} className="group">
                    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-500 transition-all duration-200 shadow-sm hover:shadow-md group-hover:-translate-y-1">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {project.name}
                          </CardTitle>
                          <Badge variant="secondary" className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200">
                            {project.issuesCount} {project.issuesCount === 1 ? 'issue' : 'issues'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-gray-600 dark:text-gray-400 mb-3">
                          {project.description || 'No description provided'}
                        </CardDescription>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          Updated {new Date(project.updatedAt).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Recent Issues Section */}
        {projects.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-amber-500" />
                Recent Issues
              </h2>
              <Link 
                href="/issues" 
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center group"
              >
                View all issues
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            {loading.issues ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
              </div>
            ) : issues.length === 0 ? (
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                <CardContent className="p-8 text-center">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No recent issues</h3>
                  <p className="text-gray-600 dark:text-gray-400">No issues found across your projects</p>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {issues.slice(0, 5).map(issue => (
                    <Link key={issue.id} href={`/issues/${issue.id}`} className="block hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <div className="p-5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(issue.status)}
                            <span className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                              {issue.title}
                            </span>
                          </div>
                          {getPriorityBadge(issue.priority)}
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <span className="truncate">
                            {projects.find(p => p.id === issue.projectId)?.name}
                          </span>
                          <span className="mx-2">•</span>
                          <span>
                            Updated {new Date(issue.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                {issues.length > 5 && (
                  <div className="p-4 text-center border-t border-gray-200 dark:border-gray-700">
                    <Link 
                      href="/issues" 
                      className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center justify-center group"
                    >
                      View all {issues.length} issues
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                )}
              </Card>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default Dashboard;