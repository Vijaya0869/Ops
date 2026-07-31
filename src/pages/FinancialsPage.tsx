import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { CashPosition } from "@/components/financials/CashPosition";
import { CashFlowForecast } from "@/components/financials/CashFlowForecast";
import { BalanceSheet } from "@/components/financials/BalanceSheet";
import { ProfitLoss } from "@/components/financials/ProfitLoss";
import { NetWorth } from "@/components/financials/NetWorth";
import { FinancialDrilldown } from "@/components/financials/FinancialDrilldown";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  PieChart as PieChartIcon,
  BarChart3,
  Receipt,
  Banknote,
  CreditCard
} from "lucide-react";

const FinancialsPage = () => {
  // Mock financial data - this represents existing dashboard data
  const overallFinancials = {
    totalIncome: 145000,
    totalExpenses: 98000,
    grossProfit: 47000,
    netProfit: 42000,
    cashOnCashReturn: 15.8,
    roi: 18.5,
    roe: 22.3
  };

  // Extract key financial data for cash components
  const existingFinancialData = {
    totalIncome: overallFinancials.totalIncome,
    totalExpenses: overallFinancials.totalExpenses,
    rentalIncome: 18000, // From income breakdown
    wholesaleProfits: 45000, // From income breakdown  
    flipSaleProceeds: 65000, // From income breakdown
  };

  // Income data for pie chart
  const incomeData = [
    { name: "Sales Revenue", value: 125000, fill: "hsl(var(--chart-1))" },
    { name: "Refinance Value", value: 15000, fill: "hsl(var(--chart-2))" },
    { name: "Rental Income", value: existingFinancialData.rentalIncome, fill: "hsl(var(--chart-3))" }
  ];

  const incomeBreakdown = [
    { category: "Wholesale Sales", amount: existingFinancialData.wholesaleProfits, percentage: 31 },
    { category: "Fix & Flip Sales", amount: existingFinancialData.flipSaleProceeds, percentage: 45 },
    { category: "Wholetail Sales", amount: 15000, percentage: 10 },
    { category: "Rental Income", amount: existingFinancialData.rentalIncome, percentage: 12 },
    { category: "Other Income", amount: 2000, percentage: 2 }
  ];

  // Renovation expenses breakdown based on template categories
  const renovationExpenses = [
    { name: "Prep & Demo", value: 8000, fill: "hsl(var(--chart-1))" },
    { name: "Structural & Foundation", value: 12000, fill: "hsl(var(--chart-2))" },
    { name: "Framing & Envelope", value: 15000, fill: "hsl(var(--chart-3))" },
    { name: "Roofing & Gutters", value: 9000, fill: "hsl(var(--chart-4))" },
    { name: "Windows & Exterior", value: 14000, fill: "hsl(var(--chart-5))" },
    { name: "Plumbing", value: 11000, fill: "hsl(var(--primary))" },
    { name: "Electrical", value: 8500, fill: "hsl(var(--secondary))" },
    { name: "HVAC", value: 13000, fill: "hsl(var(--accent))" },
    { name: "Interior Finishes", value: 16000, fill: "hsl(var(--muted))" },
    { name: "Kitchen", value: 18000, fill: "hsl(var(--success))" },
    { name: "Bathrooms", value: 12000, fill: "hsl(var(--warning))" },
    { name: "Exterior Sitework", value: 7500, fill: "hsl(var(--destructive))" }
  ];

  const expenseBreakdown = [
    { category: "Acquisition Costs", amount: 25000, percentage: 26 },
    { category: "Closing Costs", amount: 12000, percentage: 12 },
    { category: "Holding Costs", amount: 18000, percentage: 18 },
    { category: "Selling Costs", amount: 15000, percentage: 15 },
    { category: "Refinancing Costs", amount: 8000, percentage: 8 },
    { category: "Franchise Fees", amount: 5000, percentage: 5 },
    { category: "Other Expenses", amount: 15000, percentage: 16 }
  ];

  const lendingData = [
    {
      type: "Hard Money",
      totalDebt: 185000,
      interestRate: 12.5,
      dailyInterest: 63.36,
      payoffDeadline: "2024-06-15"
    },
    {
      type: "Private Money", 
      totalDebt: 95000,
      interestRate: 8.0,
      dailyInterest: 20.82,
      payoffDeadline: "2024-08-30"
    },
    {
      type: "DSCR Loan",
      totalDebt: 220000,
      interestRate: 7.25,
      dailyInterest: 43.84,
      payoffDeadline: "2029-03-15"
    }
  ];

  return (
    <div className="flex min-h-screen">
      <Navigation />
      
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Financial Dashboard
            </h1>
            <p className="text-muted-foreground">
              Comprehensive financial tracking and analysis
            </p>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6 lg:grid-cols-11 glass-card">
              <TabsTrigger value="overview" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground text-muted-foreground text-xs">Overview</TabsTrigger>
              <TabsTrigger value="drilldown" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground text-muted-foreground text-xs">Drilldown</TabsTrigger>
              <TabsTrigger value="income" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground text-muted-foreground text-xs">Income</TabsTrigger>
              <TabsTrigger value="expenses" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground text-muted-foreground text-xs">Expenses</TabsTrigger>
              <TabsTrigger value="rentals" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground text-muted-foreground text-xs">Rentals</TabsTrigger>
              <TabsTrigger value="lending" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground text-muted-foreground text-xs">Lending</TabsTrigger>
              <TabsTrigger value="cash-position" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground text-muted-foreground text-xs">Cash Position</TabsTrigger>
              <TabsTrigger value="cash-forecast" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground text-muted-foreground text-xs">Cash Forecast</TabsTrigger>
              <TabsTrigger value="balance-sheet" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground text-muted-foreground text-xs">Balance Sheet</TabsTrigger>
              <TabsTrigger value="profit-loss" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground text-muted-foreground text-xs">P&L</TabsTrigger>
              <TabsTrigger value="net-worth" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground text-muted-foreground text-xs">Net Worth</TabsTrigger>
            </TabsList>

            <TabsContent value="drilldown" className="space-y-6">
              <FinancialDrilldown />
            </TabsContent>

            <TabsContent value="overview" className="space-y-6">
              {/* Overall Financial KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <Card variant="glass">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total Income
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-success-light" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-success-light">
                      ${overallFinancials.totalIncome.toLocaleString()}
                    </div>
                    <p className="text-xs text-success-light mt-1">+12.5% from last period</p>
                  </CardContent>
                </Card>

                <Card variant="glass">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total Expenses
                    </CardTitle>
                    <TrendingDown className="h-4 w-4 text-destructive" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-destructive">
                      ${overallFinancials.totalExpenses.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">+5.2% from last period</p>
                  </CardContent>
                </Card>

                <Card variant="glass">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Gross Profit
                    </CardTitle>
                    <PieChart className="h-4 w-4 text-accent" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-accent">
                      ${overallFinancials.grossProfit.toLocaleString()}
                    </div>
                    <p className="text-xs text-success-light mt-1">+15.8% from last period</p>
                  </CardContent>
                </Card>

                <Card variant="glass">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Net Profit
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-accent" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-accent">
                      ${overallFinancials.netProfit.toLocaleString()}
                    </div>
                    <p className="text-xs text-success-light mt-1">+18.2% from last period</p>
                  </CardContent>
                </Card>

                <Card variant="glass">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Cash-on-Cash Return
                    </CardTitle>
                    <BarChart3 className="h-4 w-4 text-accent" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-accent">
                      {overallFinancials.cashOnCashReturn}%
                    </div>
                    <p className="text-xs text-success-light mt-1">Above 12% target</p>
                  </CardContent>
                </Card>
              </div>

              {/* ROI Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card variant="glass">
                  <CardHeader>
                    <CardTitle className="text-lg text-foreground">Return on Investment (ROI)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-accent mb-2">
                      {overallFinancials.roi}%
                    </div>
                    <Progress value={overallFinancials.roi} className="h-2" />
                  </CardContent>
                </Card>

                <Card variant="glass">
                  <CardHeader>
                    <CardTitle className="text-lg text-foreground">Return on Equity (ROE)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-success-light mb-2">
                      {overallFinancials.roe}%
                    </div>
                    <Progress value={overallFinancials.roe} className="h-2" />
                  </CardContent>
                </Card>

                <Card variant="glass">
                  <CardHeader>
                    <CardTitle className="text-lg text-foreground">Profit Margin</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-accent mb-2">
                      {((overallFinancials.netProfit / overallFinancials.totalIncome) * 100).toFixed(1)}%
                    </div>
                    <Progress value={(overallFinancials.netProfit / overallFinancials.totalIncome) * 100} className="h-2" />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="income" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Income Pie Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChartIcon className="h-5 w-5" />
                      Income Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        sales: { label: "Sales Revenue", color: "hsl(var(--chart-1))" },
                        refinance: { label: "Refinance Value", color: "hsl(var(--chart-2))" },
                        rental: { label: "Rental Income", color: "hsl(var(--chart-3))" }
                      }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={incomeData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            dataKey="value"
                            label={({ name, value }) => `${name}: $${value.toLocaleString()}`}
                          >
                            {incomeData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                {/* Income Breakdown List */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Banknote className="h-5 w-5" />
                      Income Breakdown by Source
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {incomeBreakdown.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <div className="font-medium">{item.category}</div>
                            <div className="text-sm text-muted-foreground">{item.percentage}% of total income</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-success">${item.amount.toLocaleString()}</div>
                            <Progress value={item.percentage} className="w-20 h-2 mt-1" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="expenses" className="space-y-6">
              {/* General Expense Breakdown Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Receipt className="h-5 w-5" />
                    General Expense Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      {expenseBreakdown.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <div className="font-medium">{item.category}</div>
                            <div className="text-sm text-muted-foreground">{item.percentage}% of total expenses</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-destructive">${item.amount.toLocaleString()}</div>
                            <Progress value={item.percentage} className="w-20 h-2 mt-1" />
                          </div>
                        </div>
                      ))}
                    </div>
                    <ChartContainer
                      config={{}}
                      className="h-[350px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={expenseBreakdown.map((item, index) => {
                              const colors = [
                                "hsl(0, 70%, 50%)",    // Red
                                "hsl(30, 70%, 50%)",   // Orange
                                "hsl(60, 70%, 50%)",   // Yellow
                                "hsl(120, 70%, 50%)",  // Green
                                "hsl(180, 70%, 50%)",  // Cyan
                                "hsl(240, 70%, 50%)",  // Blue
                                "hsl(300, 70%, 50%)"   // Magenta
                              ];
                              return {
                                name: item.category,
                                value: item.amount,
                                fill: colors[index % colors.length]
                              };
                            })}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            innerRadius={40}
                            dataKey="value"
                            stroke="white"
                            strokeWidth={2}
                          >
                            {expenseBreakdown.map((entry, index) => {
                              const colors = [
                                "hsl(0, 70%, 50%)",
                                "hsl(30, 70%, 50%)",
                                "hsl(60, 70%, 50%)",
                                "hsl(120, 70%, 50%)",
                                "hsl(180, 70%, 50%)",
                                "hsl(240, 70%, 50%)",
                                "hsl(300, 70%, 50%)"
                              ];
                              return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                            })}
                          </Pie>
                          <ChartTooltip 
                            content={<ChartTooltipContent />}
                            formatter={(value, name) => [`$${value.toLocaleString()}`, name]}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Renovation Expenses Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5" />
                    Renovation Expenses Breakdown
                  </CardTitle>
                </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{}}
                      className="h-[400px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={renovationExpenses}
                            cx="50%"
                            cy="50%"
                            outerRadius={120}
                            innerRadius={0}
                            dataKey="value"
                            stroke="none"
                            label={({ name, value }) => `${name}: $${value.toLocaleString()}`}
                            labelLine={false}
                          >
                            {renovationExpenses.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <ChartTooltip 
                            content={<ChartTooltipContent />}
                            formatter={(value, name) => [`$${value.toLocaleString()}`, name]}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rentals" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Monthly Rental Income
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-success">$5,250</div>
                    <p className="text-xs text-success mt-1">From 3 properties</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Monthly Expenses
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-destructive">$1,825</div>
                    <p className="text-xs text-muted-foreground mt-1">Repairs, management, etc.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Net Operating Income
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">$3,425</div>
                    <p className="text-xs text-success mt-1">65% profit margin</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="lending" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Lending Portfolio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {lendingData.map((loan, index) => (
                      <div key={index} className="p-4 border rounded-lg bg-card">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold">{loan.type}</h3>
                          <div className="text-right">
                            <div className="font-bold">${loan.totalDebt.toLocaleString()}</div>
                            <div className="text-sm text-muted-foreground">Total Debt</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <div className="text-muted-foreground">Interest Rate</div>
                            <div className="font-semibold">{loan.interestRate}%</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Daily Interest</div>
                            <div className="font-semibold text-destructive">${loan.dailyInterest}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Payoff Deadline</div>
                            <div className="font-semibold">{loan.payoffDeadline}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cash-position" className="space-y-6">
              <CashPosition existingFinancials={existingFinancialData} />
            </TabsContent>

            <TabsContent value="cash-forecast" className="space-y-6">
              <CashFlowForecast existingFinancials={existingFinancialData} />
            </TabsContent>

            <TabsContent value="balance-sheet" className="space-y-6">
              <BalanceSheet financialData={existingFinancialData} />
            </TabsContent>

            <TabsContent value="profit-loss" className="space-y-6">
              <ProfitLoss financialData={existingFinancialData} />
            </TabsContent>

            <TabsContent value="net-worth" className="space-y-6">
              <NetWorth financialData={existingFinancialData} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default FinancialsPage;