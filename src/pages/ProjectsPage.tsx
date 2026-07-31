import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building, 
  MapPin, 
  DollarSign,
  Calendar,
  Users,
  Wrench,
  Plus,
  Eye,
  FileText,
  Upload
} from "lucide-react";

interface Project {
  id: string;
  propertyAddress: string;
  type: "flip" | "rental";
  status: "planning" | "in-progress" | "completed";
  startDate: string;
  estimatedCompletion: string;
  budget: number;
  spent: number;
  progress: number;
  contractor: string;
  tasks: {
    total: number;
    completed: number;
    overdue: number;
  };
}

const mockProjects: Project[] = [
  {
    id: "1",
    propertyAddress: "123 Oak Street, Dallas TX",
    type: "flip",
    status: "in-progress",
    startDate: "2024-01-15",
    estimatedCompletion: "2024-03-15",
    budget: 25000,
    spent: 18500,
    progress: 75,
    contractor: "ABC Construction",
    tasks: { total: 24, completed: 18, overdue: 2 }
  },
  {
    id: "2",
    propertyAddress: "456 Pine Avenue, Austin TX",
    type: "rental",
    status: "planning",
    startDate: "2024-02-01",
    estimatedCompletion: "2024-04-01",
    budget: 32000,
    spent: 2500,
    progress: 5,
    contractor: "XYZ Builders",
    tasks: { total: 32, completed: 2, overdue: 0 }
  }
];

const ProjectsPage = () => {
  const totalBudget = mockProjects.reduce((sum, project) => sum + project.budget, 0);
  const totalSpent = mockProjects.reduce((sum, project) => sum + project.spent, 0);
  const totalTasks = mockProjects.reduce((sum, project) => sum + project.tasks.total, 0);
  const totalOverdue = mockProjects.reduce((sum, project) => sum + project.tasks.overdue, 0);

  return (
    <div className="flex min-h-screen bg-background">
      <Navigation />
      
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Rehab & Construction Dashboard
              </h1>
              <p className="text-muted-foreground">
                Gantt timelines, budget tracking, and project management
              </p>
            </div>
            <Button className="bg-primary hover:bg-primary-dark">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>

          {/* Project KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Projects
                </CardTitle>
                <Wrench className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{mockProjects.length}</div>
                <p className="text-xs text-muted-foreground mt-1">2 in progress</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Budget
                </CardTitle>
                <DollarSign className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">
                  ${totalBudget.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  ${totalSpent.toLocaleString()} spent
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Tasks
                </CardTitle>
                <Calendar className="h-4 w-4 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-warning">{totalTasks}</div>
                <p className="text-xs text-destructive mt-1">{totalOverdue} overdue</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Budget Variance
                </CardTitle>
                <DollarSign className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {(((totalBudget - totalSpent) / totalBudget) * 100).toFixed(1)}%
                </div>
                <p className="text-xs text-success mt-1">Under budget</p>
              </CardContent>
            </Card>
          </div>

          {/* Project Tabs */}
          <Tabs defaultValue="projects" className="w-full">
            <TabsList>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="projects">
              <Card>
                <CardHeader>
                  <CardTitle>Active Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {mockProjects.map((project) => (
                      <div key={project.id} className="p-4 border rounded-lg bg-card">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Building className="h-4 w-4 text-muted-foreground" />
                              <span className="font-semibold">{project.propertyAddress}</span>
                              <Badge variant={
                                project.status === "planning" ? "secondary" :
                                project.status === "in-progress" ? "default" : "outline"
                              }>
                                {project.status.replace("-", " ").toUpperCase()}
                              </Badge>
                              <Badge variant="outline" className={
                                project.type === "flip" ? "bg-primary/20" : "bg-success/20"
                              }>
                                {project.type.toUpperCase()}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {project.contractor}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {project.startDate} - {project.estimatedCompletion}
                              </span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span>Progress</span>
                            <span>{project.progress}%</span>
                          </div>
                          <Progress value={project.progress} className="h-2" />
                        </div>

                        {/* Project Metrics */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="text-muted-foreground">Budget</div>
                            <div className="font-semibold">${project.budget.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Spent</div>
                            <div className="font-semibold text-destructive">
                              ${project.spent.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Remaining</div>
                            <div className="font-semibold text-success">
                              ${(project.budget - project.spent).toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Tasks</div>
                            <div className="font-semibold">
                              {project.tasks.completed}/{project.tasks.total}
                              {project.tasks.overdue > 0 && (
                                <span className="text-destructive ml-1">
                                  ({project.tasks.overdue} overdue)
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Budget Breakdown */}
                        <div className="mt-4 pt-4 border-t">
                          <h4 className="font-medium mb-3">Budget vs. Actual Breakdown</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="flex justify-between">
                              <span>Labor:</span>
                              <span>${(project.spent * 0.6).toLocaleString()} / ${(project.budget * 0.6).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Materials:</span>
                              <span>${(project.spent * 0.35).toLocaleString()} / ${(project.budget * 0.35).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Other:</span>
                              <span>${(project.spent * 0.05).toLocaleString()} / ${(project.budget * 0.05).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Project Documents</CardTitle>
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Document
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Sample Documents */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <div className="flex-1">
                          <h4 className="font-medium">Construction Contract - 123 Oak Street</h4>
                          <p className="text-sm text-muted-foreground">PDF • 2.4 MB • Uploaded Jan 15, 2024</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        ABC Construction • Contract dated Jan 10, 2024
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <div className="flex-1">
                          <h4 className="font-medium">Building Permits - 123 Oak Street</h4>
                          <p className="text-sm text-muted-foreground">PDF • 1.8 MB • Uploaded Jan 12, 2024</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        City of Dallas • Permit #BP2024-0123
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <div className="flex-1">
                          <h4 className="font-medium">Material Invoices - Pine Avenue</h4>
                          <p className="text-sm text-muted-foreground">PDF • 890 KB • Uploaded Feb 1, 2024</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Home Depot • Invoice #HD-2024-0205
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <div className="flex-1">
                          <h4 className="font-medium">Inspection Reports - 456 Pine Avenue</h4>
                          <p className="text-sm text-muted-foreground">PDF • 1.2 MB • Uploaded Feb 5, 2024</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        XYZ Inspections • Report dated Feb 3, 2024
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default ProjectsPage;