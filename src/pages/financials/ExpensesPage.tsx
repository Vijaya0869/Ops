import { useMemo, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TimePeriodDropdown } from "@/components/ui/time-period-dropdown";
import { useTimePeriod, formatTimePeriodForDisplay, getDateRange } from "@/contexts/TimePeriodContext";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Download, DollarSign, Home, Hammer, Building, Wrench, Calculator } from "lucide-react";
import {
  PageHeaderSkeleton,
  StatCardSkeletonGrid,
  ChartSkeleton,
} from "@/components/ui/loading-skeletons";
import { Skeleton } from "@/components/ui/skeleton";
import { AddTransactionDialog } from "@/components/financials/AddTransactionDialog";
import { useExpenses } from "@/hooks/useExpenses";
import { useProperties } from "@/hooks/useProperties";
import { useRenovationItems } from "@/hooks/useRenovationItems";
import { useProjects } from "@/hooks/useProjects";

type ExpenseCategory = "acquisition" | "holding" | "selling" | "refinancing" | "renovation" | "rentalOps";

const CATEGORIES: { id: ExpenseCategory; name: string; icon: typeof Building; color: string }[] = [
  { id: "acquisition", name: "Acquisition Costs", icon: Building, color: "hsl(var(--chart-1))" },
  { id: "holding", name: "Holding Costs", icon: Home, color: "hsl(var(--chart-2))" },
  { id: "selling", name: "Selling Costs", icon: DollarSign, color: "hsl(var(--chart-3))" },
  { id: "refinancing", name: "Refinancing Costs", icon: Calculator, color: "hsl(var(--chart-4))" },
  { id: "renovation", name: "Renovation/Construction", icon: Hammer, color: "hsl(var(--chart-5))" },
  { id: "rentalOps", name: "Rental Ops Costs", icon: Wrench, color: "hsl(var(--accent))" },
];

export default function ExpensesPage() {
  const { timePeriod, setTimePeriod } = useTimePeriod();
  const [selectedProperty, setSelectedProperty] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<ExpenseCategory>("acquisition");

  const { expenses, loading: expensesLoading, addExpense } = useExpenses();
  const { properties, loading: propertiesLoading } = useProperties();
  const { renovationItems, loading: renovationLoading } = useRenovationItems();
  const { projects, loading: projectsLoading } = useProjects();

  const loading = expensesLoading || propertiesLoading || renovationLoading || projectsLoading;

  const { startDate, endDate } = useMemo(() => getDateRange(timePeriod), [timePeriod]);

  const propertyAddress = (propertyId: string) =>
    properties.find((p) => p.id === propertyId)?.address || "Unknown property";

  const visibleExpenses = expenses.filter((e) => {
    if (selectedProperty !== "all" && e.propertyId !== selectedProperty) return false;
    const expenseDate = new Date(e.expenseDate);
    return expenseDate >= startDate && expenseDate <= endDate;
  });
  // Renovation items have no date of their own (only their parent project does),
  // so they're only filtered by property here, not by the time period.
  const visibleRenovationItems = renovationItems.filter(
    (r) => selectedProperty === "all" || r.propertyId === selectedProperty,
  );

  const categoryTotal = (categoryId: ExpenseCategory): number => {
    if (categoryId === "renovation") {
      return visibleRenovationItems.reduce((sum, r) => sum + (r.actualCost ?? r.estimatedCost), 0);
    }
    return visibleExpenses
      .filter((e) => e.category === categoryId)
      .reduce((sum, e) => sum + e.amount, 0);
  };

  const totalExpenses = CATEGORIES.reduce((sum, c) => sum + categoryTotal(c.id), 0);
  const highestCategory = CATEGORIES.reduce(
    (max, c) => (categoryTotal(c.id) > categoryTotal(max.id) ? c : max),
    CATEGORIES[0],
  );

  const chartData = CATEGORIES.map((c) => ({ name: c.name, value: categoryTotal(c.id), fill: c.color }));
  const pieChartData = chartData.filter((c) => c.value > 0);

  const downloadReport = () => {
    const reportContent = `Expense Analysis Report - ${formatTimePeriodForDisplay(timePeriod)}
==========================================

Generated on: ${new Date().toLocaleDateString()}

EXPENSE SUMMARY BY CATEGORY
---------------------------
${CATEGORIES.map((c) => `${c.name}: $${categoryTotal(c.id).toLocaleString()}`).join("\n")}

Total Expenses: $${totalExpenses.toLocaleString()}
`;
    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `expense-analysis-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderRenovationContent = () => {
    const grouped = new Map<string, typeof visibleRenovationItems>();
    for (const item of visibleRenovationItems) {
      const key = item.projectId || "unassigned";
      grouped.set(key, [...(grouped.get(key) || []), item]);
    }

    if (grouped.size === 0) {
      return <p className="text-muted-foreground text-sm py-8 text-center">No renovation items recorded yet.</p>;
    }

    return (
      <div className="space-y-6">
        {Array.from(grouped.entries()).map(([projectId, items]) => {
          const project = projects.find((p) => p.id === projectId);
          const totalEstimated = items.reduce((sum, i) => sum + i.estimatedCost, 0);
          const totalActual = items.reduce((sum, i) => sum + (i.actualCost ?? 0), 0);

          return (
            <Card key={projectId}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{project?.name || "Unassigned items"}</span>
                  <span className="text-sm text-muted-foreground">
                    {propertyAddress(items[0].propertyId)}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-4 text-center">Estimated</h4>
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div key={item.id} className="flex justify-between">
                          <span className="text-sm">{item.category}</span>
                          <span className="font-medium">${item.estimatedCost.toLocaleString()}</span>
                        </div>
                      ))}
                      <div className="border-t pt-2 flex justify-between font-semibold">
                        <span>Total Estimated</span>
                        <span>${totalEstimated.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-4 text-center">Actual</h4>
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div key={item.id} className="flex justify-between">
                          <span className="text-sm">{item.category}</span>
                          <span className="font-medium">
                            {item.actualCost != null ? `$${item.actualCost.toLocaleString()}` : "—"}
                          </span>
                        </div>
                      ))}
                      <div className="border-t pt-2 flex justify-between font-semibold">
                        <span>Total Actual</span>
                        <span>${totalActual.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  const renderCategoryContent = (categoryId: ExpenseCategory) => {
    if (categoryId === "renovation") return renderRenovationContent();

    const items = visibleExpenses.filter((e) => e.category === categoryId);

    if (items.length === 0) {
      return <p className="text-muted-foreground text-sm py-8 text-center">No expenses recorded in this category yet.</p>;
    }

    return (
      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle className="text-lg flex justify-between items-center">
                <span>{item.description || "Expense"}</span>
                <span>${item.amount.toLocaleString()}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{propertyAddress(item.propertyId)}</span>
                <span>{new Date(item.expenseDate).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Navigation />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            <PageHeaderSkeleton />
            <StatCardSkeletonGrid count={3} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-5 w-40" />
                </CardHeader>
                <CardContent className="h-80">
                  <ChartSkeleton />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Skeleton className="h-5 w-40" />
                </CardHeader>
                <CardContent className="h-80">
                  <ChartSkeleton />
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    );
  }

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
              <AddTransactionDialog
                title="Add Expense"
                properties={properties}
                categories={CATEGORIES.filter((c) => c.id !== "renovation")}
                onSubmit={(data) =>
                  addExpense({
                    propertyId: data.propertyId,
                    category: data.category,
                    description: data.description,
                    amount: data.amount,
                    expenseDate: data.date,
                  })
                }
              />
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
                <div className="text-2xl font-bold">${categoryTotal(highestCategory.id).toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">{highestCategory.name}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Recorded Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{visibleExpenses.length + visibleRenovationItems.length}</div>
                <p className="text-xs text-muted-foreground">Line items across all categories</p>
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
                  {pieChartData.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                      No expenses recorded in this time period
                    </div>
                  ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        fill="#818CF8"
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number, name) => [
                          `$${value.toLocaleString()} (${((value / totalExpenses) * 100).toFixed(0)}%)`,
                          name,
                        ]}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                  )}
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
                      <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, "Amount"]} />
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
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Properties</SelectItem>
                {properties.map((property) => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.address}
                  </SelectItem>
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
                    {CATEGORIES.map((category) => (
                      <TabsTrigger
                        key={category.id}
                        value={category.id}
                        className="flex items-center gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-6 py-4"
                      >
                        <category.icon className="h-4 w-4" />
                        <span>{category.name}</span>
                        <span className="ml-2 text-xs bg-muted px-2 py-1 rounded">
                          ${categoryTotal(category.id).toLocaleString()}
                        </span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                {CATEGORIES.map((category) => (
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
