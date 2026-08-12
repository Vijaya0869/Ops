import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { DollarSign, Clock, AlertTriangle, Plus, Loader2 } from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import type { Project } from "@/services/projects.service";
import { useRenovationItems } from "@/hooks/useRenovationItems";
import { useProperties } from "@/hooks/useProperties";
import { StatTileSkeleton, ListRowSkeletonGroup } from "@/components/ui/loading-skeletons";
import { Skeleton } from "@/components/ui/skeleton";
import { AddProjectDialog } from "@/components/projects/AddProjectDialog";
import {
  STATUS_COLORS,
  daysBetween,
  projectActualCost as calcActualCost,
  projectBudget as calcBudget,
} from "@/lib/project-utils";

// Typical renovation line-item costs, offered as presets when adding an item
// rather than displayed as if they were your actual project data.
interface CostPreset {
  group: string;
  subcategory: string;
  materialCost: number;
  laborCost: number;
}

const PRESET_CATALOG: CostPreset[] = [
  { group: "Prep & Demo", subcategory: "Permitting & Plan Review", materialCost: 0, laborCost: 1200 },
  { group: "Prep & Demo", subcategory: "Demo & Haul-Off", materialCost: 0, laborCost: 2500 },
  { group: "Prep & Demo", subcategory: "Dumpster/Roll-off", materialCost: 800, laborCost: 0 },
  { group: "Structural & Foundation", subcategory: "Structural Beams/Headers", materialCost: 2800, laborCost: 1500 },
  { group: "Structural & Foundation", subcategory: "Foundation Crack Injection", materialCost: 400, laborCost: 800 },
  { group: "Roofing & Gutters", subcategory: "Roof - Tear Off & Shingles", materialCost: 3500, laborCost: 2800 },
  { group: "Roofing & Gutters", subcategory: "Gutters & Downspouts", materialCost: 800, laborCost: 600 },
  { group: "Windows & Exterior", subcategory: "Windows Replacement", materialCost: 2400, laborCost: 1200 },
  { group: "Windows & Exterior", subcategory: "Siding - Vinyl/Fiber Cement", materialCost: 3200, laborCost: 2800 },
  { group: "Plumbing", subcategory: "Water Heater", materialCost: 1200, laborCost: 800 },
  { group: "Plumbing", subcategory: "Fixtures - Kitchen", materialCost: 600, laborCost: 400 },
  { group: "Plumbing", subcategory: "Fixtures - Bath", materialCost: 800, laborCost: 600 },
  { group: "Electrical", subcategory: "Service Panel Upgrade", materialCost: 800, laborCost: 1200 },
  { group: "Electrical", subcategory: "Whole-House Rewire/Circuits", materialCost: 1500, laborCost: 3500 },
  { group: "HVAC", subcategory: "Furnace", materialCost: 2800, laborCost: 1200 },
  { group: "HVAC", subcategory: "AC Condenser", materialCost: 2000, laborCost: 800 },
  { group: "Interior Finishes", subcategory: "Painting - Interior", materialCost: 800, laborCost: 2200 },
  { group: "Interior Finishes", subcategory: "Flooring - LVP", materialCost: 2400, laborCost: 1600 },
  { group: "Kitchen", subcategory: "Cabinets", materialCost: 4200, laborCost: 2500 },
  { group: "Kitchen", subcategory: "Countertops (Granite/Quartz)", materialCost: 1800, laborCost: 800 },
  { group: "Kitchen", subcategory: "Appliances Package", materialCost: 3500, laborCost: 400 },
  { group: "Bathrooms", subcategory: "Tub/Shower Pan", materialCost: 1500, laborCost: 1200 },
  { group: "Bathrooms", subcategory: "Vanity & Top", materialCost: 800, laborCost: 400 },
  { group: "Finals & Misc", subcategory: "Painting - Exterior", materialCost: 600, laborCost: 1800 },
  { group: "Finals & Misc", subcategory: "Final Deep Cleaning", materialCost: 200, laborCost: 800 },
];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

function AddRenovationItemDialog({
  properties,
  projects,
  onSubmit,
}: {
  properties: ReturnType<typeof useProperties>["properties"];
  projects: Project[];
  onSubmit: (data: {
    propertyId: string;
    projectId: string | null;
    category: string;
    estimatedCost: number;
  }) => Promise<unknown>;
}) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [propertyId, setPropertyId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [preset, setPreset] = useState("");
  const [category, setCategory] = useState("");
  const [estimatedCost, setEstimatedCost] = useState("");

  const applyPreset = (subcategory: string) => {
    setPreset(subcategory);
    const item = PRESET_CATALOG.find((p) => p.subcategory === subcategory);
    if (item) {
      setCategory(item.subcategory);
      setEstimatedCost(String(item.materialCost + item.laborCost));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!propertyId || !category || !estimatedCost) return;
    setSubmitting(true);
    const result = await onSubmit({
      propertyId,
      projectId: projectId || null,
      category,
      estimatedCost: parseFloat(estimatedCost),
    });
    setSubmitting(false);
    if (result) {
      setPreset("");
      setCategory("");
      setEstimatedCost("");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Item
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Renovation Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Property</Label>
            <Select value={propertyId} onValueChange={setPropertyId}>
              <SelectTrigger>
                <SelectValue placeholder="Select property" />
              </SelectTrigger>
              <SelectContent>
                {properties.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.address}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Project (optional)</Label>
            <Select value={projectId} onValueChange={setProjectId}>
              <SelectTrigger>
                <SelectValue placeholder="Unassigned" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Start from a typical cost (optional)</Label>
            <Select value={preset} onValueChange={applyPreset}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a preset to pre-fill cost" />
              </SelectTrigger>
              <SelectContent>
                {PRESET_CATALOG.map((p) => (
                  <SelectItem key={p.subcategory} value={p.subcategory}>
                    {p.group} — {p.subcategory} ({formatCurrency(p.materialCost + p.laborCost)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Cabinets" required />
          </div>
          <div className="space-y-2">
            <Label>Estimated Cost</Label>
            <Input
              type="number"
              step="0.01"
              value={estimatedCost}
              onChange={(e) => setEstimatedCost(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={submitting || !propertyId || !category || !estimatedCost}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface RenovationExpensesProps {
  className?: string;
  dateRange?: { startDate: Date; endDate: Date };
}

export function RenovationExpenses({ className = "", dateRange }: RenovationExpensesProps) {
  const { projects: allProjects, loading: projectsLoading, addProject } = useProjects();
  const { renovationItems, loading: itemsLoading, addRenovationItem } = useRenovationItems();
  const { properties, loading: propertiesLoading } = useProperties();

  const loading = projectsLoading || itemsLoading || propertiesLoading;

  // Renovation items have no date of their own — only their parent project
  // does (startDate/endDate) — so the time-period filter works at the
  // project level: a project counts if its timeline overlaps the range.
  const projects = dateRange
    ? allProjects.filter((p) => {
        if (!p.startDate) return true;
        const start = new Date(p.startDate);
        const end = p.endDate ? new Date(p.endDate) : start;
        return start <= dateRange.endDate && end >= dateRange.startDate;
      })
    : allProjects;

  const propertyFor = (propertyId: string) => properties.find((p) => p.id === propertyId);
  const itemsFor = (projectId: string) => renovationItems.filter((i) => i.projectId === projectId);

  const projectActual = (project: Project) => calcActualCost(project, itemsFor(project.id));

  const projectBudget = (project: Project) => calcBudget(project, itemsFor(project.id));

  const plannedDuration = (project: Project) =>
    project.startDate && project.endDate
      ? daysBetween(new Date(project.startDate), new Date(project.endDate))
      : null;

  const elapsedDays = (project: Project) => {
    if (!project.startDate) return 0;
    const start = new Date(project.startDate);
    const end = project.status === "completed" && project.endDate ? new Date(project.endDate) : new Date();
    return Math.max(0, daysBetween(start, end));
  };

  const totalBudget = projects.reduce((sum, p) => sum + projectBudget(p), 0);
  const totalActual = projects.reduce((sum, p) => sum + projectActual(p), 0);
  const totalVariance = totalBudget > 0 ? ((totalActual - totalBudget) / totalBudget) * 100 : 0;
  const activeProjects = projects.filter((p) => p.status === "in_progress");

  const budgetVsActualData = projects.map((p) => ({
    name: p.name,
    budget: projectBudget(p),
    actual: projectActual(p),
  }));

  const categoryTotals = new Map<string, { estimated: number; actual: number }>();
  for (const item of renovationItems) {
    const entry = categoryTotals.get(item.category) || { estimated: 0, actual: 0 };
    entry.estimated += item.estimatedCost;
    entry.actual += item.actualCost ?? 0;
    categoryTotals.set(item.category, entry);
  }
  const categoryChartData = Array.from(categoryTotals.entries()).map(([category, totals]) => ({
    name: category,
    estimated: totals.estimated,
    actual: totals.actual,
  }));

  const handleAddProject = (data: {
    propertyId: string;
    name: string;
    budget: number | null;
    startDate: string | null;
    endDate: string | null;
  }) => addProject(data);

  const handleAddItem = (data: {
    propertyId: string;
    projectId: string | null;
    category: string;
    estimatedCost: number;
  }) => addRenovationItem(data);

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex justify-end gap-3">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-28" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <StatTileSkeleton key={i} />
          ))}
        </div>
        <ListRowSkeletonGroup count={2} statCols={4} />
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex justify-end gap-3">
        <AddProjectDialog properties={properties} onSubmit={handleAddProject} />
        <AddRenovationItemDialog properties={properties} projects={projects} onSubmit={handleAddItem} />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Total Budget</span>
            </div>
            <div className="text-2xl font-bold">{formatCurrency(totalBudget)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Total Actual</span>
            </div>
            <div className="text-2xl font-bold">{formatCurrency(totalActual)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Budget Variance</span>
            </div>
            <div className={`text-2xl font-bold ${totalVariance > 0 ? "text-red-600" : "text-green-600"}`}>
              {totalVariance > 0 ? "+" : ""}
              {totalVariance.toFixed(1)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Active Projects</span>
            </div>
            <div className="text-2xl font-bold">{activeProjects.length}</div>
          </CardContent>
        </Card>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            {allProjects.length === 0
              ? "No renovation projects yet — create one to start tracking costs."
              : "No renovation projects in this time period."}
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="budget">Budget Analysis</TabsTrigger>
            <TabsTrigger value="category">Cost by Category</TabsTrigger>
            <TabsTrigger value="timeline">Timeline Tracking</TabsTrigger>
            <TabsTrigger value="detailed">Detailed Breakdown</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4">
              {projects.map((project) => {
                const budget = projectBudget(project);
                const actual = projectActual(project);
                const duration = plannedDuration(project);
                const elapsed = elapsedDays(project);
                const progress =
                  project.status === "completed" ? 100 : duration ? Math.min(100, (elapsed / duration) * 100) : 0;

                return (
                  <Card key={project.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          {project.name} — {propertyFor(project.propertyId)?.address || "Unknown property"}
                        </CardTitle>
                        <Badge className={STATUS_COLORS[project.status]}>
                          {project.status.replace("_", " ")}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Budget</p>
                          <p className="text-lg font-semibold">{formatCurrency(budget)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Actual Cost</p>
                          <p className="text-lg font-semibold">{formatCurrency(actual)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Timeline</p>
                          <p className="text-sm">
                            {duration ? `${duration} days (planned)` : "No dates set"}
                            {project.status !== "planned" && <span className="block">{elapsed} days elapsed</span>}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Progress</p>
                          <Progress value={progress} className="mt-1" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="budget" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Budget vs Actual Costs</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={budgetVsActualData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                    <Bar dataKey="budget" name="Budget" fill="hsl(var(--chart-1))" />
                    <Bar dataKey="actual" name="Actual" fill="hsl(var(--chart-2))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="category" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Estimated vs Actual by Category</CardTitle>
              </CardHeader>
              <CardContent>
                {categoryChartData.length === 0 ? (
                  <p className="text-muted-foreground text-sm py-8 text-center">No renovation items recorded yet.</p>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={categoryChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                      <Bar dataKey="estimated" name="Estimated" fill="hsl(var(--chart-1))" />
                      <Bar dataKey="actual" name="Actual" fill="hsl(var(--chart-2))" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4">
            <div className="grid gap-4">
              {projects
                .filter((p) => p.status !== "planned")
                .map((project) => {
                  const duration = plannedDuration(project);
                  const elapsed = elapsedDays(project);
                  const variance = duration ? elapsed - duration : null;
                  const progress = project.status === "completed" ? 100 : duration ? Math.min(100, (elapsed / duration) * 100) : 0;

                  return (
                    <Card key={project.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{project.name}</h3>
                          {variance !== null && (
                            <Badge variant={variance > 0 ? "destructive" : "default"}>
                              {variance > 0 ? "+" : ""}
                              {variance} days
                            </Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Start Date</p>
                            <p>{project.startDate ? new Date(project.startDate).toLocaleDateString() : "—"}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Planned Duration</p>
                            <p>{duration ? `${duration} days` : "—"}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Elapsed</p>
                            <p>{elapsed} days</p>
                          </div>
                        </div>
                        <Progress value={progress} className="mt-3" />
                      </CardContent>
                    </Card>
                  );
                })}
              {projects.filter((p) => p.status !== "planned").length === 0 && (
                <p className="text-muted-foreground text-sm py-8 text-center">
                  No projects in progress or completed yet.
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="detailed" className="space-y-4">
            {projects.map((project) => {
              const items = itemsFor(project.id);
              if (items.length === 0) return null;
              return (
                <Card key={project.id}>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>{project.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {propertyFor(project.propertyId)?.address}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {items.map((item) => (
                        <div key={item.id} className="grid grid-cols-12 gap-4 items-center py-2 border-b border-border/50 last:border-0">
                          <div className="col-span-6">
                            <span className="text-sm font-medium">{item.category}</span>
                          </div>
                          <div className="col-span-3 text-right">
                            <span className="text-sm">{formatCurrency(item.estimatedCost)}</span>
                            <div className="text-xs text-muted-foreground">Estimated</div>
                          </div>
                          <div className="col-span-3 text-right">
                            <span className="text-sm font-semibold">
                              {item.actualCost != null ? formatCurrency(item.actualCost) : "—"}
                            </span>
                            <div className="text-xs text-muted-foreground">Actual</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            {projects.every((p) => itemsFor(p.id).length === 0) && (
              <p className="text-muted-foreground text-sm py-8 text-center">
                No itemized renovation costs recorded yet.
              </p>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
