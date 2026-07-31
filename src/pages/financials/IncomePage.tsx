import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { TimePeriodDropdown, TimePeriod } from "@/components/ui/time-period-dropdown";
import { 
  Download, 
  DollarSign, 
  Home, 
  Hammer, 
  FileText, 
  TrendingUp
} from "lucide-react";

export default function IncomePage() {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("1month");
  const [selectedProperty, setSelectedProperty] = useState<string>("all");

  // Mock income data
  const incomeData = {
    rental: {
      grossIncome: 45000,
      netIncome: 38500,
      concessions: 2500,
      maintenanceDeductions: 3000,
      managementFees: 1000
    },
    flip: {
      totalProjects: 3,
      totalIncome: 85000,
      projects: [
        { id: 1, address: "123 Main St", income: 35000 },
        { id: 2, address: "456 Oak Ave", income: 28000 },
        { id: 3, address: "789 Pine Rd", income: 22000 }
      ]
    },
    wholesale: {
      totalDeals: 8,
      totalIncome: 64000,
      avgPerDeal: 8000,
      assignmentFees: 64000
    },
    other: {
      refiProceeds: 125000,
      miscIncome: 5500
    }
  };

  // Chart data
  const chartIncomeData = [
    { name: "Rental Income", value: incomeData.rental.netIncome, color: "hsl(var(--primary))" },
    { name: "Flip Income", value: incomeData.flip.totalIncome, color: "hsl(var(--success))" },
    { name: "Wholesale Income", value: incomeData.wholesale.totalIncome, color: "hsl(var(--warning))" },
    { name: "Other Income", value: incomeData.other.refiProceeds + incomeData.other.miscIncome, color: "hsl(var(--accent))" }
  ];

  const monthlyIncomeData = [
    { month: "Jan", rental: 3200, flip: 15000, wholesale: 8000, other: 10000 },
    { month: "Feb", rental: 3200, flip: 0, wholesale: 12000, other: 2000 },
    { month: "Mar", rental: 3200, flip: 28000, wholesale: 16000, other: 5000 },
    { month: "Apr", rental: 3200, flip: 22000, wholesale: 8000, other: 1500 },
    { month: "May", rental: 3200, flip: 20000, wholesale: 12000, other: 3000 },
    { month: "Jun", rental: 3200, flip: 0, wholesale: 8000, other: 108000 }
  ];

  const downloadReport = () => {
    const reportContent = `Income Analysis Report - ${timePeriod}
==========================================

Generated on: ${new Date().toLocaleDateString()}
Time Period: ${timePeriod}

INCOME SUMMARY
--------------
Rental Income (Net): $${incomeData.rental.netIncome.toLocaleString()}
Flip Income: $${incomeData.flip.totalIncome.toLocaleString()}
Wholesale Income: $${incomeData.wholesale.totalIncome.toLocaleString()}
Other Income: $${(incomeData.other.refiProceeds + incomeData.other.miscIncome).toLocaleString()}

DETAILED BREAKDOWN
------------------
Rental Income:
- Gross: $${incomeData.rental.grossIncome.toLocaleString()}
- Concessions: -$${incomeData.rental.concessions.toLocaleString()}
- Maintenance: -$${incomeData.rental.maintenanceDeductions.toLocaleString()}
- Management Fees: -$${incomeData.rental.managementFees.toLocaleString()}
- Net: $${incomeData.rental.netIncome.toLocaleString()}

Flip Projects:
${incomeData.flip.projects.map(p => `- ${p.address}: $${p.income.toLocaleString()}`).join('\n')}

Wholesale Deals:
- Total Deals: ${incomeData.wholesale.totalDeals}
- Average per Deal: $${incomeData.wholesale.avgPerDeal.toLocaleString()}
- Total Income: $${incomeData.wholesale.totalIncome.toLocaleString()}
`;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `income-analysis-report-${timePeriod}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen bg-background">
      <Navigation />
      
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Income Analysis</h1>
              <p className="text-muted-foreground">Comprehensive breakdown of all income streams and sources</p>
            </div>
            <div className="flex gap-3">
              <TimePeriodDropdown 
                value={timePeriod} 
                onValueChange={setTimePeriod} 
              />
              <Button onClick={downloadReport} variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Download Report
              </Button>
            </div>
          </div>

          {/* Income Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rental Income</CardTitle>
                <Home className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">${incomeData.rental.netIncome.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Net rental income</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Flip Income</CardTitle>
                <Hammer className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">${incomeData.flip.totalIncome.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">{incomeData.flip.totalProjects} projects</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Wholesale Income</CardTitle>
                <FileText className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">${incomeData.wholesale.totalIncome.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">{incomeData.wholesale.totalDeals} deals</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Other Income</CardTitle>
                <TrendingUp className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">${(incomeData.other.refiProceeds + incomeData.other.miscIncome).toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Refi & misc</p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Income Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Rental Income Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Gross Rental Income</span>
                  <span className="font-semibold">${incomeData.rental.grossIncome.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-destructive">
                  <span>Concessions</span>
                  <span>-${incomeData.rental.concessions.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-destructive">
                  <span>Maintenance Deductions</span>
                  <span>-${incomeData.rental.maintenanceDeductions.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-destructive">
                  <span>Management Fees</span>
                  <span>-${incomeData.rental.managementFees.toLocaleString()}</span>
                </div>
                <hr className="border-border" />
                <div className="flex justify-between items-center font-semibold text-success">
                  <span>Net Rental Income</span>
                  <span>${incomeData.rental.netIncome.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Flip Projects Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {incomeData.flip.projects.map((project) => (
                  <div key={project.id} className="flex justify-between items-center">
                    <span className="text-muted-foreground">{project.address}</span>
                    <span className="font-semibold">${project.income.toLocaleString()}</span>
                  </div>
                ))}
                <hr className="border-border" />
                <div className="flex justify-between items-center font-semibold">
                  <span>Total Flip Income</span>
                  <span className="text-success">${incomeData.flip.totalIncome.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Wholesale & Other Income */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Wholesale Income Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Deals</span>
                  <span className="font-semibold">{incomeData.wholesale.totalDeals}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Average per Deal</span>
                  <span className="font-semibold">${incomeData.wholesale.avgPerDeal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Assignment Fees</span>
                  <span className="font-semibold">${incomeData.wholesale.assignmentFees.toLocaleString()}</span>
                </div>
                <hr className="border-border" />
                <div className="flex justify-between items-center font-semibold">
                  <span>Total Wholesale Income</span>
                  <span className="text-success">${incomeData.wholesale.totalIncome.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Other Income Sources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Refinancing Proceeds</span>
                  <span className="font-semibold">${incomeData.other.refiProceeds.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Miscellaneous Income</span>
                  <span className="font-semibold">${incomeData.other.miscIncome.toLocaleString()}</span>
                </div>
                <hr className="border-border" />
                <div className="flex justify-between items-center font-semibold">
                  <span>Total Other Income</span>
                  <span className="text-success">${(incomeData.other.refiProceeds + incomeData.other.miscIncome).toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Income Distribution Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Income Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartIncomeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#818CF8"
                      dataKey="value"
                    >
                      {chartIncomeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Monthly Income Trend */}
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
                    <Bar dataKey="rental" stackId="a" fill="hsl(var(--primary))" name="Rental" />
                    <Bar dataKey="flip" stackId="a" fill="hsl(var(--success))" name="Flip" />
                    <Bar dataKey="wholesale" stackId="a" fill="hsl(var(--warning))" name="Wholesale" />
                    <Bar dataKey="other" stackId="a" fill="hsl(var(--accent))" name="Other" />
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
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select property" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Properties</SelectItem>
                    <SelectItem value="123-main">123 Main St</SelectItem>
                    <SelectItem value="456-oak">456 Oak Ave</SelectItem>
                    <SelectItem value="789-pine">789 Pine Rd</SelectItem>
                  </SelectContent>
                </Select>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                {selectedProperty === "all" 
                  ? "Select a specific property to view detailed income breakdown"
                  : `Detailed income analysis for ${selectedProperty === "123-main" ? "123 Main St" : selectedProperty === "456-oak" ? "456 Oak Ave" : "789 Pine Rd"}`
                }
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}