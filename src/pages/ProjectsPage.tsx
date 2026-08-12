import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building,
  Calendar,
  DollarSign,
  ListChecks,
  Wrench,
  Loader2,
} from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import { useRenovationItems } from "@/hooks/useRenovationItems";
import { useProperties } from "@/hooks/useProperties";
import { AddProjectDialog } from "@/components/projects/AddProjectDialog";
import { STATUS_COLORS, daysBetween, projectActualCost, projectBudget } from "@/lib/project-utils";
import type { Project } from "@/services/projects.service";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
    amount,
  );
}

const ProjectsPage = () => {
  const { projects, loading: projectsLoading, addProject } = useProjects();
  const { renovationItems, loading: itemsLoading } = useRenovationItems();
  const { properties, loading: propertiesLoading } = useProperties();

  const isLoading = projectsLoading || itemsLoading || propertiesLoading;

  const propertyFor = (propertyId: string) => properties.find((p) => p.id === propertyId);
  const itemsFor = (projectId: string) => renovationItems.filter((i) => i.projectId === projectId);

  const activeProjects = projects.filter((p) => !["completed", "cancelled"].includes(p.status));

  const totalBudget = projects.reduce((sum, p) => sum + projectBudget(p, itemsFor(p.id)), 0);
  const totalSpent = projects.reduce((sum, p) => sum + projectActualCost(p, itemsFor(p.id)), 0);
  const budgetVariance = totalBudget > 0 ? ((totalBudget - totalSpent) / totalBudget) * 100 : 0;

  const totalItems = renovationItems.length;
  const completedItems = renovationItems.filter((i) => i.completed).length;

  // Progress is only shown when there's a real basis for it: renovation
  // items to count completion on, or an unambiguous planned(0%)/completed(100%) status.
  const progressFor = (project: Project) => {
    const items = itemsFor(project.id);
    if (items.length > 0) {
      return Math.round((items.filter((i) => i.completed).length / items.length) * 100);
    }
    if (project.status === "completed") return 100;
    if (project.status === "planned") return 0;
    return null;
  };

  // Dates come from the API as UTC-midnight timestamps for a calendar date;
  // formatting with the viewer's local timezone can roll them back a day, so
  // format in UTC to show the calendar date actually stored.
  const formatDate = (value: string) => new Date(value).toLocaleDateString(undefined, { timeZone: "UTC" });

  const dateRangeLabel = (project: Project) => {
    if (!project.startDate && !project.endDate) return "No dates set";
    const start = project.startDate ? formatDate(project.startDate) : "—";
    const end = project.endDate ? formatDate(project.endDate) : "—";
    return `${start} - ${end}`;
  };

  const daysRemaining = (project: Project) => {
    if (!project.endDate || project.status === "completed" || project.status === "cancelled") return null;
    return daysBetween(new Date(), new Date(project.endDate));
  };

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
                Budget tracking and project management across your portfolio
              </p>
            </div>
            <AddProjectDialog properties={properties} onSubmit={addProject} />
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
                <div className="text-2xl font-bold text-primary">{activeProjects.length}</div>
                <p className="text-xs text-muted-foreground mt-1">{projects.length} total</p>
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
                <div className="text-2xl font-bold text-success">{formatCurrency(totalBudget)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatCurrency(totalSpent)} spent
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Renovation Items
                </CardTitle>
                <ListChecks className="h-4 w-4 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-warning">{totalItems}</div>
                <p className="text-xs text-muted-foreground mt-1">{completedItems} completed</p>
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
                  {totalBudget > 0 ? `${budgetVariance.toFixed(1)}%` : "—"}
                </div>
                <p className={`text-xs mt-1 ${budgetVariance >= 0 ? "text-success" : "text-destructive"}`}>
                  {totalBudget > 0 ? (budgetVariance >= 0 ? "Under budget" : "Over budget") : "No budgets set"}
                </p>
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
                  <CardTitle>All Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : projects.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      No projects yet. Click "New Project" to add one.
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {projects.map((project) => {
                        const property = propertyFor(project.propertyId);
                        const items = itemsFor(project.id);
                        const budget = projectBudget(project, items);
                        const actual = projectActualCost(project, items);
                        const remaining = budget - actual;
                        const progress = progressFor(project);
                        const remainingDays = daysRemaining(project);

                        return (
                          <div key={project.id} className="p-4 border rounded-lg bg-card">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Building className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-semibold">{project.name}</span>
                                  <Badge className={STATUS_COLORS[project.status]}>
                                    {project.status.replace("_", " ").toUpperCase()}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span>{property?.address || "Unknown property"}</span>
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {dateRangeLabel(project)}
                                    {remainingDays !== null &&
                                      (remainingDays >= 0
                                        ? ` (${remainingDays}d remaining)`
                                        : ` (${Math.abs(remainingDays)}d overdue)`)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Progress Bar */}
                            {progress !== null && (
                              <div className="mb-4">
                                <div className="flex justify-between text-sm mb-2">
                                  <span>Progress</span>
                                  <span>{progress}%</span>
                                </div>
                                <Progress value={progress} className="h-2" />
                              </div>
                            )}

                            {/* Project Metrics */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <div className="text-muted-foreground">Budget</div>
                                <div className="font-semibold">{formatCurrency(budget)}</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">Spent</div>
                                <div className="font-semibold text-destructive">
                                  {formatCurrency(actual)}
                                </div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">Remaining</div>
                                <div className={`font-semibold ${remaining >= 0 ? "text-success" : "text-destructive"}`}>
                                  {formatCurrency(remaining)}
                                </div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">Renovation Items</div>
                                <div className="font-semibold">
                                  {items.filter((i) => i.completed).length}/{items.length}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Project Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    Project-level documents aren't tracked separately yet — upload contracts,
                    permits, and invoices from each property's own Documents tab
                    (Properties → Portfolio → select a property).
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
