import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { TimePeriodDropdown } from "@/components/ui/time-period-dropdown";
import { useTimePeriod, getDateRange } from "@/contexts/TimePeriodContext";
import { Download, Home, Hammer, FileText, TrendingUp } from "lucide-react";
import { AddTransactionDialog } from "@/components/financials/AddTransactionDialog";
import { useIncome } from "@/hooks/useIncome";
import { useProperties } from "@/hooks/useProperties";
import {
  PageHeaderSkeleton,
  StatCardSkeletonGrid,
  ChartSkeleton,
} from "@/components/ui/loading-skeletons";
import { Skeleton } from "@/components/ui/skeleton";

const CATEGORIES = [
  { id: "rental", name: "Rental Income", icon: Home, color: "hsl(var(--primary))" },
  { id: "flip", name: "Flip Income", icon: Hammer, color: "hsl(var(--success))" },
  { id: "wholesale", name: "Wholesale Income", icon: FileText, color: "hsl(var(--warning))" },
  { id: "other", name: "Other Income", icon: TrendingUp, color: "hsl(var(--accent))" },
] as const;

function lastSixMonths(): { key: string; label: string }[] {
  const months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label: d.toLocaleDateString("en-US", { month: "short" }) });
  }
  return months;
}

export default function IncomePage() {
  const { timePeriod, setTimePeriod } = useTimePeriod();
  const [selectedProperty, setSelectedProperty] = useState<string>("all");

  const { income, loading: incomeLoading, addIncome } = useIncome();
  const { properties, loading: propertiesLoading } = useProperties();

  const loading = incomeLoading || propertiesLoading;

  const { startDate, endDate } = useMemo(() => getDateRange(timePeriod), [timePeriod]);

  const propertyAddress = (propertyId: string) =>
    properties.find((p) => p.id === propertyId)?.address || "Unknown property";

  const visibleIncome = income.filter((i) => {
    if (selectedProperty !== "all" && i.propertyId !== selectedProperty) return false;
    const incomeDate = new Date(i.incomeDate);
    return incomeDate >= startDate && incomeDate <= endDate;
  });

  const categoryTotal = (categoryId: string) =>
    visibleIncome.filter((i) => i.category === categoryId).reduce((sum, i) => sum + i.amount, 0);

  const categoryCount = (categoryId: string) =>
    visibleIncome.filter((i) => i.category === categoryId).length;

  const totalIncome = CATEGORIES.reduce((sum, c) => sum + categoryTotal(c.id), 0);

  const chartIncomeData = CATEGORIES.map((c) => ({
    name: c.name,
    value: categoryTotal(c.id),
    color: c.color,
  })).filter((c) => c.value > 0);

  const monthlyIncomeData = lastSixMonths().map(({ key, label }) => {
    const [year, month] = key.split("-").map(Number);
    const row: Record<string, string | number> = { month: label };
    for (const c of CATEGORIES) {
      row[c.id] = visibleIncome
        .filter((i) => {
          const d = new Date(i.incomeDate);
          return i.category === c.id && d.getFullYear() === year && d.getMonth() === month;
        })
        .reduce((sum, i) => sum + i.amount, 0);
    }
    return row;
  });

  const downloadReport = () => {
    const reportContent = `Income Analysis Report
==========================================

Generated on: ${new Date().toLocaleDateString()}

INCOME SUMMARY
--------------
${CATEGORIES.map((c) => `${c.name}: $${categoryTotal(c.id).toLocaleString()}`).join("\n")}

Total Income: $${totalIncome.toLocaleString()}
`;
    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `income-analysis-report-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <PageHeaderSkeleton />
            <div className="mt-6">
              <StatCardSkeletonGrid count={4} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              <Card>
                <CardHeader>
                  <Skeleton className="h-5 w-40" />
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ChartSkeleton />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Skeleton className="h-5 w-40" />
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ChartSkeleton />
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
    );
  }

  return (
    <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Income Analysis</h1>
              <p className="text-muted-foreground">Comprehensive breakdown of all income streams and sources</p>
            </div>
            <div className="flex gap-3">
              <TimePeriodDropdown value={timePeriod} onValueChange={setTimePeriod} />
              <AddTransactionDialog
                title="Add Income"
                properties={properties}
                categories={CATEGORIES.map((c) => ({ id: c.id, name: c.name }))}
                onSubmit={(data) =>
                  addIncome({
                    propertyId: data.propertyId,
                    category: data.category,
                    description: data.description,
                    amount: data.amount,
                    incomeDate: data.date,
                  })
                }
              />
              <Button onClick={downloadReport} variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Download Report
              </Button>
            </div>
          </div>

          {/* Income Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {CATEGORIES.map((c) => (
              <Card key={c.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{c.name}</CardTitle>
                  <c.icon className="h-4 w-4 text-success" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success">${categoryTotal(c.id).toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">{categoryCount(c.id)} record{categoryCount(c.id) === 1 ? "" : "s"}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Income Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {chartIncomeData.length === 0 ? (
                  <div className="h-[300px] flex items-center justify-center text-sm text-muted-foreground">
                    No income recorded in this time period
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartIncomeData}
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        fill="#818CF8"
                        dataKey="value"
                      >
                        {chartIncomeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name) => [
                          `$${Number(value).toLocaleString()} (${((Number(value) / totalIncome) * 100).toFixed(0)}%)`,
                          name,
                        ]}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Income Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyIncomeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                    <Legend />
                    {CATEGORIES.map((c) => (
                      <Bar key={c.id} dataKey={c.id} stackId="a" fill={c.color} name={c.name} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Property Level Drilldown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Property Level Drilldown
                <Select value={selectedProperty} onValueChange={setSelectedProperty}>
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Select property" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Properties</SelectItem>
                    {properties.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.address}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedProperty === "all" ? (
                <div className="text-center text-muted-foreground py-8">
                  Select a specific property to view detailed income breakdown
                </div>
              ) : visibleIncome.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No income recorded for {propertyAddress(selectedProperty)} yet
                </div>
              ) : (
                <div className="space-y-3">
                  {visibleIncome.map((i) => (
                    <div key={i.id} className="flex justify-between items-center border-b border-border pb-2">
                      <div>
                        <p className="font-medium">{i.description || i.category}</p>
                        <p className="text-xs text-muted-foreground">
                          {CATEGORIES.find((c) => c.id === i.category)?.name || i.category} ·{" "}
                          {new Date(i.incomeDate).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="font-semibold text-success">${i.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
  );
}
