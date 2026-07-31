import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TimePeriodDropdown } from "@/components/ui/time-period-dropdown";
import { useTimePeriod, formatTimePeriodForDisplay } from "@/contexts/TimePeriodContext";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Download, DollarSign, Home, Hammer, Building, Wrench, Calculator, TrendingUp } from "lucide-react";

type ExpenseCategory = 'acquisition' | 'holding' | 'selling' | 'refinancing' | 'renovation' | 'rentalOps';

export default function ExpensesPage() {
  const { timePeriod, setTimePeriod } = useTimePeriod();
  const [selectedProperty, setSelectedProperty] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<ExpenseCategory>('acquisition');
  const [selectedProject, setSelectedProject] = useState<string>("Kitchen Renovation");

  // Mock expense data organized by the requested categories
  const expenseData = {
    acquisition: {
      total: 31500,
      description: "Costs incurred to acquire properties",
      items: [
        { name: "Wholesale fee", amount: 15000, properties: {"123 Main St": 5000, "456 Oak Ave": 4500, "789 Pine Rd": 5500} },
        { name: "Lender points", amount: 8500, properties: {"123 Main St": 3500, "456 Oak Ave": 2800, "789 Pine Rd": 2200} },
        { name: "Title fees", amount: 4200, properties: {"123 Main St": 1800, "456 Oak Ave": 1500, "789 Pine Rd": 900} },
        { name: "Closing costs", amount: 3800, properties: {"123 Main St": 1200, "456 Oak Ave": 1300, "789 Pine Rd": 1300} }
      ]
    },
    holding: {
      total: 41900,
      description: "Ongoing costs while holding properties",
      items: [
        { name: "Debt payments", amount: 18500, properties: {"123 Main St": 7200, "456 Oak Ave": 6500, "789 Pine Rd": 4800} },
        { name: "Tax", amount: 9200, properties: {"123 Main St": 3800, "456 Oak Ave": 3200, "789 Pine Rd": 2200} },
        { name: "Insurance", amount: 6800, properties: {"123 Main St": 2800, "456 Oak Ave": 2400, "789 Pine Rd": 1600} },
        { name: "Utilities", amount: 2400, properties: {"123 Main St": 950, "456 Oak Ave": 850, "789 Pine Rd": 600} },
        { name: "Property care", amount: 3200, properties: {"123 Main St": 1200, "456 Oak Ave": 1000, "789 Pine Rd": 1000} },
        { name: "Misc", amount: 1800, properties: {"123 Main St": 750, "456 Oak Ave": 550, "789 Pine Rd": 500} }
      ]
    },
    selling: {
      total: 45500,
      description: "Costs associated with selling properties",
      items: [
        { name: "Staging", amount: 5500, properties: {"123 Main St": 2200, "456 Oak Ave": 1800, "789 Pine Rd": 1500} },
        { name: "Realtor commissions", amount: 24000, properties: {"123 Main St": 9600, "456 Oak Ave": 8400, "789 Pine Rd": 6000} },
        { name: "Concessions", amount: 8000, properties: {"123 Main St": 3200, "456 Oak Ave": 2800, "789 Pine Rd": 2000} },
        { name: "Remedies", amount: 3200, properties: {"123 Main St": 1200, "456 Oak Ave": 1000, "789 Pine Rd": 1000} },
        { name: "Closing/title costs", amount: 4800, properties: {"123 Main St": 1900, "456 Oak Ave": 1600, "789 Pine Rd": 1300} }
      ]
    },
    refinancing: {
      total: 16200,
      description: "Costs for refinancing existing properties",
      items: [
        { name: "Appraisal fee", amount: 1500, properties: {"123 Main St": 600, "456 Oak Ave": 500, "789 Pine Rd": 400} },
        { name: "Lender points", amount: 6800, properties: {"123 Main St": 2800, "456 Oak Ave": 2200, "789 Pine Rd": 1800} },
        { name: "Title fees", amount: 2200, properties: {"123 Main St": 900, "456 Oak Ave": 700, "789 Pine Rd": 600} },
        { name: "Insurance", amount: 1200, properties: {"123 Main St": 500, "456 Oak Ave": 400, "789 Pine Rd": 300} },
        { name: "Broker fees", amount: 4500, properties: {"123 Main St": 1800, "456 Oak Ave": 1500, "789 Pine Rd": 1200} }
      ]
    },
    renovation: {
      total: 24600,
      description: "Construction and renovation project costs",
      projects: {
        "Kitchen Renovation": {
          property: "123 Main St",
          labor: 5500,
          materials: 11100,
          total: 16600,
          breakdown: [
            { category: "Demo & Haul-Off", labor: 1200, materials: 0 },
            { category: "Dumpster/Roll-off", labor: 0, materials: 800 },
            { category: "Cabinets", labor: 2500, materials: 4200 },
            { category: "Countertops", labor: 800, materials: 1800 },
            { category: "Appliances Package", labor: 400, materials: 3500 },
            { category: "Kitchen Fixtures", labor: 600, materials: 800 }
          ]
        },
        "Bathroom Remodel": {
          property: "456 Oak Ave",
          labor: 3800,
          materials: 4200,
          total: 8000,
          breakdown: [
            { category: "Demo & Haul-Off", labor: 800, materials: 0 },
            { category: "Tub/Shower Pan", labor: 1200, materials: 1500 },
            { category: "Tile Surround", labor: 900, materials: 1200 },
            { category: "Vanity & Top", labor: 400, materials: 800 },
            { category: "Bath Fixtures", labor: 500, materials: 700 }
          ]
        }
      }
    },
    rentalOps: {
      total: 27200,
      description: "Ongoing rental property operational costs",
      items: [
        { name: "Maintenance", amount: 8500, properties: {"123 Main St": 3500, "456 Oak Ave": 3000, "789 Pine Rd": 2000} },
        { name: "PM fees", amount: 4200, properties: {"123 Main St": 1800, "456 Oak Ave": 1500, "789 Pine Rd": 900} },
        { name: "CapEx", amount: 12000, properties: {"123 Main St": 5000, "456 Oak Ave": 4000, "789 Pine Rd": 3000} },
        { name: "Concessions", amount: 2500, properties: {"123 Main St": 1000, "456 Oak Ave": 800, "789 Pine Rd": 700} }
      ]
    }
  };

  const categories = [
    { id: 'acquisition' as ExpenseCategory, name: 'Acquisition Costs', icon: Building, color: 'hsl(var(--chart-1))' },
    { id: 'holding' as ExpenseCategory, name: 'Holding Costs', icon: Home, color: 'hsl(var(--chart-2))' },
    { id: 'selling' as ExpenseCategory, name: 'Selling Costs', icon: DollarSign, color: 'hsl(var(--chart-3))' },
    { id: 'refinancing' as ExpenseCategory, name: 'Refinancing Costs', icon: Calculator, color: 'hsl(var(--chart-4))' },
    { id: 'renovation' as ExpenseCategory, name: 'Renovation/Construction', icon: Hammer, color: 'hsl(var(--chart-5))' },
    { id: 'rentalOps' as ExpenseCategory, name: 'Rental Ops Costs', icon: Wrench, color: 'hsl(var(--accent))' }
  ];

  const properties = ["123 Main St", "456 Oak Ave", "789 Pine Rd"];

  const totalExpenses = Object.values(expenseData).reduce((sum, cat) => sum + cat.total, 0);

  const chartData = categories.map(cat => ({
    name: cat.name,
    value: expenseData[cat.id].total,
    fill: cat.color
  }));

  const downloadReport = () => {
    const reportContent = `Expense Analysis Report - ${formatTimePeriodForDisplay(timePeriod)}
==========================================

Generated on: ${new Date().toLocaleDateString()}
Time Period: ${formatTimePeriodForDisplay(timePeriod)}

EXPENSE SUMMARY BY CATEGORY
---------------------------
${categories.map(cat => `${cat.name}: $${expenseData[cat.id].total.toLocaleString()}`).join('\n')}

Total Expenses: $${totalExpenses.toLocaleString()}
`;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expense-analysis-${timePeriod}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderCategoryContent = (categoryId: ExpenseCategory) => {
    const category = expenseData[categoryId];

    if (categoryId === 'renovation') {
      const renovationData = category as typeof expenseData.renovation;
      const projects = Object.entries(renovationData.projects);
      
      return (
        <div className="space-y-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Renovation/Construction Projects</h3>
            <p className="text-sm text-muted-foreground mb-4">Select a project to view detailed labor and materials breakdown</p>
            <div className="flex items-center gap-4">
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map(([projectName]) => (
                    <SelectItem key={projectName} value={projectName}>
                      {projectName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="text-sm text-muted-foreground">
                Total Renovation Costs: <span className="font-semibold">${renovationData.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {projects.map(([projectName, project]) => (
            <div
              key={projectName}
              className={selectedProject === projectName ? "block" : "hidden"}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{projectName}</span>
                    <span className="text-sm text-muted-foreground">{project.property}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    {/* Labor Column */}
                    <div>
                      <h4 className="font-semibold mb-4 text-center">Labor</h4>
                      <div className="space-y-3">
                        {project.breakdown.map((item, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span className="text-sm">{item.category}</span>
                            <span className="font-medium">${item.labor.toLocaleString()}</span>
                          </div>
                        ))}
                        <div className="border-t pt-2 flex justify-between font-semibold">
                          <span>Total Labor</span>
                          <span>${project.labor.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Materials Column */}
                    <div>
                      <h4 className="font-semibold mb-4 text-center">Materials</h4>
                      <div className="space-y-3">
                        {project.breakdown.map((item, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span className="text-sm">{item.category}</span>
                            <span className="font-medium">${item.materials.toLocaleString()}</span>
                          </div>
                        ))}
                        <div className="border-t pt-2 flex justify-between font-semibold">
                          <span>Total Materials</span>
                          <span>${project.materials.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Project Total</span>
                      <span>${project.total.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      );
    }

    // Regular category display
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground mb-6">{category.description}</p>
        
        {'items' in category && category.items.map((item, idx) => (
          <Card key={idx}>
            <CardHeader>
              <CardTitle className="text-lg flex justify-between items-center">
                <span>{item.name}</span>
                <span>${item.amount.toLocaleString()}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(item.properties).map(([property, amount]) => (
                  <div
                    key={property}
                    className={`flex justify-between ${
                      selectedProperty === "all" || selectedProperty === property ? "block" : "hidden"
                    }`}
                  >
                    <span className="text-muted-foreground">{property}</span>
                    <span className="font-medium">${amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-background">
      <Navigation />
      
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Expense Analysis</h1>
              <p className="text-muted-foreground">Detailed breakdown of all property-related expenses</p>
            </div>
            <div className="flex items-center gap-4">
              <TimePeriodDropdown value={timePeriod} onValueChange={setTimePeriod} />
              <Button onClick={downloadReport} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download Report
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalExpenses.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">All categories combined</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Highest Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${expenseData.selling.total.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Selling Costs</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Average Monthly</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${Math.round(totalExpenses / 6).toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Based on 6-month period</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Expense Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#818CF8"
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']} />
                      <Bar dataKey="value" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Property Filter */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Filter by Property:</span>
            <Select value={selectedProperty} onValueChange={setSelectedProperty}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Properties</SelectItem>
                {properties.map(property => (
                  <SelectItem key={property} value={property}>{property}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Expense Categories Tabs */}
          <Card>
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ExpenseCategory)}>
                <div className="border-b">
                  <TabsList className="w-full justify-start rounded-none h-auto p-0 bg-transparent">
                    {categories.map(category => (
                      <TabsTrigger
                        key={category.id}
                        value={category.id}
                        className="flex items-center gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-6 py-4"
                      >
                        <category.icon className="h-4 w-4" />
                        <span>{category.name}</span>
                        <span className="ml-2 text-xs bg-muted px-2 py-1 rounded">
                          ${expenseData[category.id].total.toLocaleString()}
                        </span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                {categories.map(category => (
                  <TabsContent key={category.id} value={category.id} className="p-6">
                    {renderCategoryContent(category.id)}
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}