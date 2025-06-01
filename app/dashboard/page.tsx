'use client'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Activity,
  CheckCircle2,
  Clock,
  FileText,
  Users,
  AlertCircle,
  MoreHorizontal,
  Plus
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const data = [
  { name: 'Jan', issues: 45, resolved: 32 },
  { name: 'Feb', issues: 52, resolved: 41 },
  { name: 'Mar', issues: 68, resolved: 58 },
  { name: 'Apr', issues: 72, resolved: 65 },
  { name: 'May', issues: 84, resolved: 72 },
  { name: 'Jun', issues: 91, resolved: 83 },
]

const pieData = [
  { name: 'Completed', value: 83 },
  { name: 'In Progress', value: 12 },
  { name: 'Pending', value: 5 },
]

const COLORS = ['#10B981', '#3B82F6', '#F59E0B']

const recentIssues = [
  {
    id: "ISS-202",
    title: "Authentication bug in mobile app",
    priority: "high",
    status: "in-progress",
    assignee: "JD"
  },
  {
    id: "ISS-201",
    title: "Dashboard performance optimization",
    priority: "medium",
    status: "pending",
    assignee: "SM"
  },
  {
    id: "ISS-200",
    title: "Update documentation for API v2",
    priority: "low",
    status: "completed",
    assignee: "AL"
  },
  {
    id: "ISS-199",
    title: "Implement dark mode toggle",
    priority: "medium",
    status: "completed",
    assignee: "TM"
  },
]

const teamMembers = [
  { name: "John Doe", role: "Frontend Dev", tasks: 12, avatar: "/avatars/jd.jpg" },
  { name: "Sarah Miller", role: "Backend Dev", tasks: 8, avatar: "/avatars/sm.jpg" },
  { name: "Alex Lee", role: "UX Designer", tasks: 5, avatar: "/avatars/al.jpg" },
  { name: "Taylor Morgan", role: "Product Manager", tasks: 3, avatar: "/avatars/tm.jpg" },
]

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">83</div>
            <p className="text-xs text-muted-foreground">+18% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">-4% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">+2 since last quarter</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Issues Overview</CardTitle>
            <CardDescription>Monthly issue tracking and resolution rate</CardDescription>
          </CardHeader>
          <CardContent className="pl-2 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="issues" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
      <CardHeader>
        <CardTitle>Issue Status</CardTitle>
        <CardDescription>Current distribution of issues</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        {/* Ensure ResponsiveContainer has proper dimensions */}
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
                itemStyle={{
                  color: "hsl(var(--foreground))",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Issues</CardTitle>
                <CardDescription>Last updated issues in your workspace</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Issue
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assignee</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentIssues.map((issue) => (
                  <TableRow key={issue.id}>
                    <TableCell className="font-medium">{issue.id}</TableCell>
                    <TableCell>{issue.title}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          issue.priority === "high" ? "destructive" : 
                          issue.priority === "medium" ? "secondary" : "outline"
                        }
                      >
                        {issue.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          issue.status === "completed" ? "default" : 
                          issue.status === "in-progress" ? "secondary" : "outline"
                        }
                      >
                        {issue.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`/avatars/${issue.assignee.toLowerCase()}.jpg`} />
                        <AvatarFallback>{issue.assignee}</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Assign to</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              Showing <strong>1-4</strong> of <strong>124</strong> issues
            </div>
            <div className="space-x-2">
              <Button variant="outline" size="sm">
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </CardFooter>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Team Activity</CardTitle>
            <CardDescription>Current tasks by team members</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {teamMembers.map((member) => (
                <div key={member.name} className="flex items-center">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                  <div className="ml-auto flex flex-col items-end">
                    <p className="text-sm font-medium">{member.tasks} tasks</p>
                    <Progress value={(member.tasks / 12) * 100} className="w-24 h-2 mt-1" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View All Members
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Workspace Performance</CardTitle>
            <CardDescription>Resolution time over last 6 months</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="resolved" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks for your workspace</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-24 flex flex-col">
                <FileText className="h-6 w-6 mb-2" />
                <span>New Report</span>
              </Button>
              <Button variant="outline" className="h-24 flex flex-col">
                <Users className="h-6 w-6 mb-2" />
                <span>Invite Member</span>
              </Button>
              <Button variant="outline" className="h-24 flex flex-col">
                <Activity className="h-6 w-6 mb-2" />
                <span>View Analytics</span>
              </Button>
              <Button variant="outline" className="h-24 flex flex-col">
                <CheckCircle2 className="h-6 w-6 mb-2" />
                <span>Run Audit</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
