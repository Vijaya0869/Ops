import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";
import { Calendar, DollarSign, Clock, AlertTriangle, Download, Calculator } from "lucide-react";

// Detailed renovation cost breakdown categories from your Excel template
interface CostBreakdownItem {
  group: string;
  subcategory: string;
  units?: string;
  materialCost: number;
  laborCost: number;
  totalCost: number;
}

const renovationCostBreakdown: CostBreakdownItem[] = [
  // Prep & Demo
  { group: "Prep & Demo", subcategory: "Permitting & Plan Review", materialCost: 0, laborCost: 1200, totalCost: 1200 },
  { group: "Prep & Demo", subcategory: "Demo & Haul-Off", materialCost: 0, laborCost: 2500, totalCost: 2500 },
  { group: "Prep & Demo", subcategory: "Dumpster/Roll-off", materialCost: 800, laborCost: 0, totalCost: 800 },
  
  // Structural & Foundation
  { group: "Structural & Foundation", subcategory: "Structural Beams/Headers", materialCost: 2800, laborCost: 1500, totalCost: 4300 },
  { group: "Structural & Foundation", subcategory: "Foundation Crack Injection", materialCost: 400, laborCost: 800, totalCost: 1200 },
  
  // Framing & Envelope  
  { group: "Framing & Envelope", subcategory: "Insulation - Attic Blown-In", units: "sf", materialCost: 800, laborCost: 600, totalCost: 1400 },
  { group: "Framing & Envelope", subcategory: "Drywall Install & Texture", units: "sf", materialCost: 1200, laborCost: 2000, totalCost: 3200 },
  { group: "Framing & Envelope", subcategory: "Interior Doors", units: "ea", materialCost: 800, laborCost: 400, totalCost: 1200 },
  
  // Roofing & Gutters
  { group: "Roofing & Gutters", subcategory: "Roof - Tear Off & Shingles", units: "sq", materialCost: 3500, laborCost: 2800, totalCost: 6300 },
  { group: "Roofing & Gutters", subcategory: "Gutters & Downspouts", units: "lf", materialCost: 800, laborCost: 600, totalCost: 1400 },
  
  // Windows & Exterior
  { group: "Windows & Exterior", subcategory: "Windows Replacement", units: "ea", materialCost: 2400, laborCost: 1200, totalCost: 3600 },
  { group: "Windows & Exterior", subcategory: "Exterior Doors", units: "ea", materialCost: 800, laborCost: 400, totalCost: 1200 },
  { group: "Windows & Exterior", subcategory: "Siding - Vinyl/Fiber Cement", units: "sf", materialCost: 3200, laborCost: 2800, totalCost: 6000 },
  
  // Plumbing
  { group: "Plumbing", subcategory: "Water Heater", materialCost: 1200, laborCost: 800, totalCost: 2000 },
  { group: "Plumbing", subcategory: "Supply Lines (PEX/Copper)", materialCost: 800, laborCost: 1500, totalCost: 2300 },
  { group: "Plumbing", subcategory: "Fixtures - Kitchen", materialCost: 600, laborCost: 400, totalCost: 1000 },
  { group: "Plumbing", subcategory: "Fixtures - Bath", materialCost: 800, laborCost: 600, totalCost: 1400 },
  
  // Electrical
  { group: "Electrical", subcategory: "Service Panel Upgrade", materialCost: 800, laborCost: 1200, totalCost: 2000 },
  { group: "Electrical", subcategory: "Whole-House Rewire/Circuits", materialCost: 1500, laborCost: 3500, totalCost: 5000 },
  { group: "Electrical", subcategory: "Lighting Fixtures", materialCost: 600, laborCost: 800, totalCost: 1400 },
  
  // HVAC
  { group: "HVAC", subcategory: "Furnace", materialCost: 2800, laborCost: 1200, totalCost: 4000 },
  { group: "HVAC", subcategory: "AC Condenser", materialCost: 2000, laborCost: 800, totalCost: 2800 },
  { group: "HVAC", subcategory: "Ductwork Supply/Returns", materialCost: 1200, laborCost: 1800, totalCost: 3000 },
  
  // Interior Finishes
  { group: "Interior Finishes", subcategory: "Painting - Interior", materialCost: 800, laborCost: 2200, totalCost: 3000 },
  { group: "Interior Finishes", subcategory: "Flooring - LVP", units: "sf", materialCost: 2400, laborCost: 1600, totalCost: 4000 },
  { group: "Interior Finishes", subcategory: "Flooring - Tile", units: "sf", materialCost: 1800, laborCost: 2200, totalCost: 4000 },
  
  // Kitchen
  { group: "Kitchen", subcategory: "Cabinets", units: "lf", materialCost: 4200, laborCost: 2500, totalCost: 6700 },
  { group: "Kitchen", subcategory: "Countertops (Granite/Quartz)", units: "lf", materialCost: 1800, laborCost: 800, totalCost: 2600 },
  { group: "Kitchen", subcategory: "Appliances Package", units: "set", materialCost: 3500, laborCost: 400, totalCost: 3900 },
  { group: "Kitchen", subcategory: "Backsplash", units: "sf", materialCost: 600, laborCost: 800, totalCost: 1400 },
  
  // Bathrooms
  { group: "Bathrooms", subcategory: "Tub/Shower Pan", materialCost: 1500, laborCost: 1200, totalCost: 2700 },
  { group: "Bathrooms", subcategory: "Tile Surround", units: "sf", materialCost: 1200, laborCost: 900, totalCost: 2100 },
  { group: "Bathrooms", subcategory: "Vanity & Top", materialCost: 800, laborCost: 400, totalCost: 1200 },
  
  // Exterior Sitework
  { group: "Exterior Sitework", subcategory: "Porch/Deck Build or Repair", units: "sf", materialCost: 2400, laborCost: 1800, totalCost: 4200 },
  { group: "Exterior Sitework", subcategory: "Landscaping (Sod/Seed/Plants)", units: "sf", materialCost: 800, laborCost: 600, totalCost: 1400 },
  
  // Finals & Misc
  { group: "Finals & Misc", subcategory: "Painting - Exterior", materialCost: 600, laborCost: 1800, totalCost: 2400 },
  { group: "Finals & Misc", subcategory: "Final Deep Cleaning", materialCost: 200, laborCost: 800, totalCost: 1000 },
  { group: "Finals & Misc", subcategory: "Contingency", materialCost: 0, laborCost: 0, totalCost: 5000 }
];

interface RenovationProject {
  id: string;
  name: string;
  status: "planning" | "in-progress" | "completed" | "delayed";
  projected: {
    totalCost: number;
    labor: number;
    materials: number;
    startDate: string;
    endDate: string;
    duration: number; // in days
  };
  actual: {
    totalCost: number;
    labor: number;
    materials: number;
    startDate: string;
    endDate?: string;
    daysElapsed: number;
  };
}

interface RenovationExpensesProps {
  className?: string;
}

export function RenovationExpenses({ className = "" }: RenovationExpensesProps) {
  // Mock renovation projects data
  const [projects] = useState<RenovationProject[]>([
    {
      id: "1",
      name: "Kitchen Renovation - 123 Main St",
      status: "completed",
      projected: {
        totalCost: 25000,
        labor: 15000,
        materials: 10000,
        startDate: "2024-01-15",
        endDate: "2024-02-15",
        duration: 31
      },
      actual: {
        totalCost: 27500,
        labor: 16800,
        materials: 10700,
        startDate: "2024-01-15",
        endDate: "2024-02-20",
        daysElapsed: 36
      }
    },
    {
      id: "2", 
      name: "Bathroom Remodel - 456 Oak Ave",
      status: "in-progress",
      projected: {
        totalCost: 18000,
        labor: 12000,
        materials: 6000,
        startDate: "2024-02-01",
        endDate: "2024-03-01",
        duration: 29
      },
      actual: {
        totalCost: 14200,
        labor: 9500,
        materials: 4700,
        startDate: "2024-02-01",
        daysElapsed: 20
      }
    },
    {
      id: "3",
      name: "Full Rehab - 789 Pine St",
      status: "planning",
      projected: {
        totalCost: 45000,
        labor: 28000,
        materials: 17000,
        startDate: "2024-03-15",
        endDate: "2024-05-15",
        duration: 61
      },
      actual: {
        totalCost: 0,
        labor: 0,
        materials: 0,
        startDate: "2024-03-15",
        daysElapsed: 0
      }
    }
  ]);

  // Aggregate data for charts
  const projectedVsActualData = projects.map(project => ({
    name: project.name.split(" - ")[0],
    projected: project.projected.totalCost,
    actual: project.actual.totalCost || 0,
    variance: ((project.actual.totalCost || 0) - project.projected.totalCost) / project.projected.totalCost * 100
  }));

  const laborMaterialsData = projects.map(project => ({
    name: project.name.split(" - ")[0],
    projectedLabor: project.projected.labor,
    actualLabor: project.actual.labor,
    projectedMaterials: project.projected.materials,
    actualMaterials: project.actual.materials
  }));

  const timelineData = projects.filter(p => p.status !== "planning").map(project => ({
    name: project.name.split(" - ")[0],
    estimatedDays: project.projected.duration,
    actualDays: project.actual.daysElapsed,
    variance: project.status === "completed" ? 
      ((project.actual.daysElapsed - project.projected.duration) / project.projected.duration * 100) :
      ((project.actual.daysElapsed - (Date.now() - new Date(project.projected.startDate).getTime()) / (1000 * 60 * 60 * 24)) / project.projected.duration * 100)
  }));

  const totalProjected = projects.reduce((sum, p) => sum + p.projected.totalCost, 0);
  const totalActual = projects.reduce((sum, p) => sum + p.actual.totalCost, 0);
  const totalVariance = ((totalActual - totalProjected) / totalProjected) * 100;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500";
      case "in-progress": return "bg-blue-500";
      case "planning": return "bg-gray-500";
      case "delayed": return "bg-destructive";
      default: return "bg-gray-500";
    }
  };

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Total Projected</span>
            </div>
            <div className="text-2xl font-bold">{formatCurrency(totalProjected)}</div>
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
            <div className={`text-2xl font-bold ${totalVariance > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {totalVariance > 0 ? '+' : ''}{totalVariance.toFixed(1)}%
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Active Projects</span>
            </div>
            <div className="text-2xl font-bold">
              {projects.filter(p => p.status === "in-progress").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="budget">Budget Analysis</TabsTrigger>
          <TabsTrigger value="breakdown">Labor vs Materials</TabsTrigger>
          <TabsTrigger value="timeline">Timeline Tracking</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Breakdown</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Project Status Cards */}
          <div className="grid gap-4">
            {projects.map((project) => (
              <Card key={project.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Projected Cost</p>
                      <p className="text-lg font-semibold">{formatCurrency(project.projected.totalCost)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Actual Cost</p>
                      <p className="text-lg font-semibold">{formatCurrency(project.actual.totalCost)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Timeline</p>
                      <p className="text-sm">
                        {project.projected.duration} days (est.)
                        {project.status !== "planning" && (
                          <span className="block">{project.actual.daysElapsed} days (actual)</span>
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Progress</p>
                      <Progress 
                        value={project.status === "planning" ? 0 : 
                               project.status === "completed" ? 100 :
                               (project.actual.daysElapsed / project.projected.duration) * 100} 
                        className="mt-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="budget" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Projected vs Actual Costs</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={projectedVsActualData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                  <Bar dataKey="projected" name="Projected" fill="hsl(var(--chart-1))" />
                  <Bar dataKey="actual" name="Actual" fill="hsl(var(--chart-2))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="breakdown" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Labor vs Materials Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={laborMaterialsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                  <Bar dataKey="projectedLabor" name="Projected Labor" fill="hsl(var(--chart-1))" />
                  <Bar dataKey="actualLabor" name="Actual Labor" fill="hsl(var(--chart-2))" />
                  <Bar dataKey="projectedMaterials" name="Projected Materials" fill="hsl(var(--chart-3))" />
                  <Bar dataKey="actualMaterials" name="Actual Materials" fill="hsl(var(--chart-4))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Detailed breakdown table */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Cost Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Project</th>
                      <th className="text-right p-2">Proj. Labor</th>
                      <th className="text-right p-2">Act. Labor</th>
                      <th className="text-right p-2">Proj. Materials</th>
                      <th className="text-right p-2">Act. Materials</th>
                      <th className="text-right p-2">Total Variance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project) => {
                      const variance = project.actual.totalCost > 0 ? 
                        ((project.actual.totalCost - project.projected.totalCost) / project.projected.totalCost * 100) : 0;
                      return (
                        <tr key={project.id} className="border-b">
                          <td className="p-2">{project.name.split(" - ")[0]}</td>
                          <td className="text-right p-2">{formatCurrency(project.projected.labor)}</td>
                          <td className="text-right p-2">{formatCurrency(project.actual.labor)}</td>
                          <td className="text-right p-2">{formatCurrency(project.projected.materials)}</td>
                          <td className="text-right p-2">{formatCurrency(project.actual.materials)}</td>
                          <td className={`text-right p-2 ${variance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {variance > 0 ? '+' : ''}{variance.toFixed(1)}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Timeline Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="estimatedDays" name="Estimated Days" fill="hsl(var(--chart-1))" />
                  <Bar dataKey="actualDays" name="Actual Days" fill="hsl(var(--chart-2))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Timeline details */}
          <div className="grid gap-4">
            {projects.filter(p => p.status !== "planning").map((project) => {
              const daysVariance = project.status === "completed" ? 
                project.actual.daysElapsed - project.projected.duration :
                project.actual.daysElapsed - (Date.now() - new Date(project.projected.startDate).getTime()) / (1000 * 60 * 60 * 24);
              
              return (
                <Card key={project.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{project.name}</h3>
                      <Badge variant={daysVariance > 0 ? "destructive" : "default"}>
                        {daysVariance > 0 ? '+' : ''}{Math.round(daysVariance)} days
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Start Date</p>
                        <p>{new Date(project.actual.startDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Estimated Duration</p>
                        <p>{project.projected.duration} days</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Current Status</p>
                        <p>{project.actual.daysElapsed} days elapsed</p>
                      </div>
                    </div>
                    <Progress 
                      value={project.status === "completed" ? 100 : 
                             (project.actual.daysElapsed / project.projected.duration) * 100} 
                      className="mt-3"
                    />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Comprehensive Cost Breakdown</CardTitle>
                <p className="text-sm text-muted-foreground">Detailed line-item breakdown by category with labor and materials</p>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Template
              </Button>
            </CardHeader>
            <CardContent>
              {/* Category breakdown by groups */}
              {Object.entries(
                renovationCostBreakdown.reduce((acc, item) => {
                  if (!acc[item.group]) acc[item.group] = [];
                  acc[item.group].push(item);
                  return acc;
                }, {} as Record<string, CostBreakdownItem[]>)
              ).map(([groupName, items]) => {
                const groupTotal = items.reduce((sum, item) => sum + item.totalCost, 0);
                const groupMaterials = items.reduce((sum, item) => sum + item.materialCost, 0);
                const groupLabor = items.reduce((sum, item) => sum + item.laborCost, 0);
                
                return (
                  <Card key={groupName} className="mb-4">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">{groupName}</CardTitle>
                        <div className="text-right">
                          <div className="text-lg font-bold">{formatCurrency(groupTotal)}</div>
                          <div className="text-xs text-muted-foreground">
                            Materials: {formatCurrency(groupMaterials)} | Labor: {formatCurrency(groupLabor)}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {items.map((item, idx) => (
                          <div key={idx} className="grid grid-cols-12 gap-4 items-center py-2 border-b border-border/50 last:border-0">
                            <div className="col-span-4">
                              <span className="text-sm font-medium">{item.subcategory}</span>
                              {item.units && (
                                <span className="text-xs text-muted-foreground ml-2">({item.units})</span>
                              )}
                            </div>
                            <div className="col-span-2 text-right">
                              <span className="text-sm">{formatCurrency(item.materialCost)}</span>
                              <div className="text-xs text-muted-foreground">Materials</div>
                            </div>
                            <div className="col-span-2 text-right">
                              <span className="text-sm">{formatCurrency(item.laborCost)}</span>
                              <div className="text-xs text-muted-foreground">Labor</div>
                            </div>
                            <div className="col-span-2 text-right">
                              <span className="text-sm font-semibold">{formatCurrency(item.totalCost)}</span>
                              <div className="text-xs text-muted-foreground">Total</div>
                            </div>
                            <div className="col-span-2">
                              <Input 
                                type="number" 
                                placeholder="Qty" 
                                className="h-8 text-xs"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Category Summary */}
                      <div className="mt-4 pt-3 border-t border-border">
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="text-center">
                            <div className="font-semibold">{formatCurrency(groupMaterials)}</div>
                            <div className="text-xs text-muted-foreground">Total Materials</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold">{formatCurrency(groupLabor)}</div>
                            <div className="text-xs text-muted-foreground">Total Labor</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-lg">{formatCurrency(groupTotal)}</div>
                            <div className="text-xs text-muted-foreground">Category Total</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {/* Overall Summary */}
              <Card className="mt-6 bg-muted/30">
                <CardContent className="p-6">
                  <div className="grid grid-cols-3 gap-6 text-center">
                    <div>
                      <div className="text-2xl font-bold">
                        {formatCurrency(renovationCostBreakdown.reduce((sum, item) => sum + item.materialCost, 0))}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Materials</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {formatCurrency(renovationCostBreakdown.reduce((sum, item) => sum + item.laborCost, 0))}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Labor</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-primary">
                        {formatCurrency(renovationCostBreakdown.reduce((sum, item) => sum + item.totalCost, 0))}
                      </div>
                      <div className="text-sm text-muted-foreground">Grand Total</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}