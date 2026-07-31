import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Building2, 
  Target, 
  Calendar, 
  Users, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  ClipboardCheck,
  Timer,
  BarChart3
} from "lucide-react";

const ProjectManagementPage = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <Navigation />
      
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Project Management Playbook</h1>
                <p className="text-muted-foreground">
                  Best practices for managing real estate development projects from start to finish
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary">Project Planning</Badge>
              <Badge variant="secondary">Execution</Badge>
              <Badge variant="secondary">Risk Management</Badge>
            </div>
          </div>

          {/* Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Project Management Overview
              </CardTitle>
              <CardDescription>
                Systematic approach to planning, executing, and closing real estate projects
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground">
                Effective project management in real estate development ensures projects are completed on time, 
                within budget, and to quality specifications. This involves coordinating multiple stakeholders, 
                managing resources, and mitigating risks throughout the project lifecycle.
              </p>
            </CardContent>
          </Card>

          {/* Project Phases */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Project Management Phases
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                    <Target className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">1. Planning Phase</h4>
                    <p className="text-sm text-muted-foreground mt-1 mb-2">
                      Define project scope, objectives, timeline, and resource requirements.
                    </p>
                    <div className="ml-4 space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span>Project charter development</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span>Stakeholder identification</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span>Risk assessment</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span>Budget planning</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-full bg-orange-100 text-orange-600">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">2. Execution</h4>
                    <p className="text-sm text-muted-foreground mt-1 mb-2">
                      Implement the project plan and coordinate team activities.
                    </p>
                    <div className="ml-4 space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span>Team coordination</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span>Resource allocation</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span>Quality assurance</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span>Progress tracking</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-full bg-secondary text-muted-foreground">
                    <BarChart3 className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">3. Monitoring</h4>
                    <p className="text-sm text-muted-foreground mt-1 mb-2">
                      Track progress and performance against the project plan.
                    </p>
                    <div className="ml-4 space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span>Performance metrics</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span>Budget monitoring</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span>Schedule tracking</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span>Risk management</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-full bg-green-100 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">4. Closure</h4>
                    <p className="text-sm text-muted-foreground mt-1 mb-2">
                      Complete all project activities and conduct final evaluations.
                    </p>
                    <div className="ml-4 space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span>Final deliverables</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span>Documentation</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span>Lessons learned</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span>Project evaluation</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5" />
                Key Project Management Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border">
                    <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      Stakeholder Management
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Identify, engage, and manage all project stakeholders including investors, 
                      contractors, local authorities, and end users.
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-lg border">
                    <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <Timer className="h-4 w-4 text-primary" />
                      Schedule Management
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Develop detailed project schedules, track milestones, and manage 
                      dependencies between different project phases.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-lg border">
                    <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-primary" />
                      Budget Control
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Monitor project costs, manage change orders, and ensure projects 
                      stay within approved budgets.
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-lg border">
                    <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-primary" />
                      Risk Management
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Identify potential risks, develop mitigation strategies, and implement 
                      contingency plans for project challenges.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Best Practices */}
          <Card>
            <CardHeader>
              <CardTitle>Project Management Best Practices</CardTitle>
              <CardDescription>
                Proven strategies for successful real estate project delivery
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border-l-4 border-blue-500">
                  <h4 className="font-semibold text-foreground mb-2">Clear Communication</h4>
                  <p className="text-sm text-muted-foreground">
                    Establish regular communication protocols with all stakeholders. Use project 
                    management tools to keep everyone informed of progress and changes.
                  </p>
                </div>
                
                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border-l-4 border-green-500">
                  <h4 className="font-semibold text-foreground mb-2">Documentation</h4>
                  <p className="text-sm text-muted-foreground">
                    Maintain comprehensive project documentation including contracts, change orders, 
                    permits, and progress reports for legal and reference purposes.
                  </p>
                </div>
                
                <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-950/20 border-l-4 border-orange-500">
                  <h4 className="font-semibold text-foreground mb-2">Quality Control</h4>
                  <p className="text-sm text-muted-foreground">
                    Implement regular quality checks and inspections throughout the project lifecycle 
                    to ensure standards are met and issues are identified early.
                  </p>
                </div>
                
                <div className="p-4 rounded-lg bg-secondary-50 dark:bg-secondary border-l-4 border-border">
                  <h4 className="font-semibold text-foreground mb-2">Continuous Learning</h4>
                  <p className="text-sm text-muted-foreground">
                    Conduct post-project reviews to capture lessons learned and improve processes 
                    for future projects.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tools & Technologies */}
          <Card>
            <CardHeader>
              <CardTitle>Project Management Tools</CardTitle>
              <CardDescription>
                Essential tools and technologies for effective project management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border text-center">
                  <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h4 className="font-semibold text-foreground mb-1">Scheduling Tools</h4>
                  <p className="text-xs text-muted-foreground">Microsoft Project, Primavera, Smartsheet</p>
                </div>
                
                <div className="p-4 rounded-lg border text-center">
                  <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h4 className="font-semibold text-foreground mb-1">Collaboration</h4>
                  <p className="text-xs text-muted-foreground">Slack, Teams, Asana, Monday.com</p>
                </div>
                
                <div className="p-4 rounded-lg border text-center">
                  <BarChart3 className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h4 className="font-semibold text-foreground mb-1">Analytics</h4>
                  <p className="text-xs text-muted-foreground">Power BI, Tableau, Excel</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ProjectManagementPage;