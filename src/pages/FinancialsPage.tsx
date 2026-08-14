import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { CashPosition } from "@/components/financials/CashPosition";
import { CashFlowForecast } from "@/components/financials/CashFlowForecast";
import { BalanceSheet } from "@/components/financials/BalanceSheet";
import { ProfitLoss } from "@/components/financials/ProfitLoss";
import { NetWorth } from "@/components/financials/NetWorth";
import { FinancialDrilldown, type DrilldownItem } from "@/components/financials/FinancialDrilldown";
import { Loader2 } from "lucide-react";
import { usePortfolioReturns } from "@/hooks/usePortfolioReturns";
import { useIncome } from "@/hooks/useIncome";
import { useExpenses } from "@/hooks/useExpenses";
import { useRenovationItems } from "@/hooks/useRenovationItems";
import { useLenders } from "@/hooks/useLenders";
import type { Property } from "@/types/property";
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

const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--accent))",
];

const INCOME_CATEGORIES = [
  { id: "rental", name: "Rental Income" },
  { id: "flip", name: "Flip Income" },
  { id: "wholesale", name: "Wholesale Income" },
  { id: "other", name: "Other Income" },
];

const EXPENSE_CATEGORIES = [
  { id: "acquisition", name: "Acquisition Costs" },
  { id: "holding", name: "Holding Costs" },
  { id: "selling", name: "Selling Costs" },
  { id: "refinancing", name: "Refinancing Costs" },
  { id: "rentalOps", name: "Rental Ops Costs" },
];

function propertyLabel(propertyId: string, properties: Property[]) {
  return properties.find((p) => p.id === propertyId)?.address || "Unknown property";
}

function drilldownFromRecords(
  name: string,
  records: { propertyId: string; amount: number }[],
  properties: Property[],
): DrilldownItem {
  const byProperty = new Map<string, number>();
  records.forEach((r) => byProperty.set(r.propertyId, (byProperty.get(r.propertyId) || 0) + r.amount));
  const children = Array.from(byProperty.entries()).map(([propertyId, amount]) => ({
    name: propertyLabel(propertyId, properties),
    amount,
  }));
  const amount = children.reduce((sum, c) => sum + c.amount, 0);
  return { name, amount, children: children.length ? children : undefined };
}

const FinancialsPage = () => {
  const { metrics, properties, loans, derived, loading: dashboardLoading } = usePortfolioReturns();
  const { income, loading: incomeLoading } = useIncome();
  const { expenses, loading: expensesLoading } = useExpenses();
  const { renovationItems, loading: renovationLoading } = useRenovationItems();
  const { lenders, loading: lendersLoading } = useLenders();

  const loading = dashboardLoading || incomeLoading || expensesLoading || renovationLoading || lendersLoading;

  const incomeByCategory = (categoryId: string) =>
    income.filter((i) => i.category === categoryId).reduce((sum, i) => sum + i.amount, 0);
  const expenseByCategory = (categoryId: string) =>
    expenses.filter((e) => e.category === categoryId).reduce((sum, e) => sum + e.amount, 0);
  const renovationTotal = renovationItems.reduce((sum, r) => sum + (r.actualCost ?? r.estimatedCost), 0);

  const totalIncome = INCOME_CATEGORIES.reduce((sum, c) => sum + incomeByCategory(c.id), 0);
  const totalExpenses = EXPENSE_CATEGORIES.reduce((sum, c) => sum + expenseByCategory(c.id), 0) + renovationTotal;
  const grossProfit = totalIncome - totalExpenses;
  const profitMargin = totalIncome > 0 ? (grossProfit / totalIncome) * 100 : 0;

  const incomeChartData = INCOME_CATEGORIES.map((c, i) => ({
    name: c.name,
    value: incomeByCategory(c.id),
    fill: CHART_COLORS[i % CHART_COLORS.length],
  })).filter((c) => c.value > 0);

  const incomeBreakdown = INCOME_CATEGORIES.map((c) => {
    const amount = incomeByCategory(c.id);
    return { category: c.name, amount, percentage: totalIncome > 0 ? Math.round((amount / totalIncome) * 100) : 0 };
  });

  const expenseBreakdown = [
    ...EXPENSE_CATEGORIES.map((c) => {
      const amount = expenseByCategory(c.id);
      return { category: c.name, amount, percentage: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0 };
    }),
    {
      category: "Renovation/Construction",
      amount: renovationTotal,
      percentage: totalExpenses > 0 ? Math.round((renovationTotal / totalExpenses) * 100) : 0,
    },
  ];

  // Renovation items are grouped by their own real category (the specific
  // line item, e.g. "Cabinets", "Roof - Tear Off & Shingles") rather than
  // forced into a fixed preset taxonomy some items were never assigned to.
  const renovationByCategory = useMemo(() => {
    const totals = new Map<string, number>();
    renovationItems.forEach((r) => {
      const cost = r.actualCost ?? r.estimatedCost;
      totals.set(r.category, (totals.get(r.category) || 0) + cost);
    });
    return Array.from(totals.entries()).map(([name, value], i) => ({
      name,
      value,
      fill: CHART_COLORS[i % CHART_COLORS.length],
    }));
  }, [renovationItems]);

  const rentalProperties = properties.filter((p) => p.status === "rental");
  const rentalMonthlyIncome = rentalProperties.reduce((sum, p) => sum + (p.monthly_rent || 0), 0);
  const rentalMonthlyExpenses = rentalProperties.reduce((sum, p) => sum + (p.monthly_expenses || 0), 0);
  const rentalNOI = rentalMonthlyIncome - rentalMonthlyExpenses;
  const rentalMargin = rentalMonthlyIncome > 0 ? (rentalNOI / rentalMonthlyIncome) * 100 : 0;

  const activeLoans = loans.filter((l) => l.status === "active");
  const loanDailyInterest = (principal: number, rate: number) => (principal * (rate / 100)) / 365;
  const loanMaturity = (startDate: string, termMonths: number | null) => {
    if (!termMonths) return null;
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + termMonths);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  // Balance Sheet and Net Worth still need a real cash/bank-balance data
  // source that doesn't exist anywhere in the schema yet — left on
  // placeholder figures until that's designed, same as the dedicated
  // /financials/balance-sheet and /financials/net-worth pages.
  const placeholderFinancials = {
    totalIncome: 125000,
    totalExpenses: 37500,
    rentalIncome: 60000,
    wholesaleProfits: 20000,
    flipSaleProceeds: 45000,
  };

  const incomeDrilldown: DrilldownItem = {
    name: "Total Income",
    amount: totalIncome,
    children: INCOME_CATEGORIES.map((c) =>
      drilldownFromRecords(
        c.name,
        income.filter((i) => i.category === c.id),
        properties,
      ),
    ).filter((c) => c.amount > 0),
  };

  const expenseDrilldown: DrilldownItem = {
    name: "Total Expenses",
    amount: totalExpenses,
    children: [
      ...EXPENSE_CATEGORIES.map((c) =>
        drilldownFromRecords(
          c.name,
          expenses.filter((e) => e.category === c.id),
          properties,
        ),
      ),
      drilldownFromRecords(
        "Renovation/Construction",
        renovationItems.map((r) => ({ propertyId: r.propertyId, amount: r.actualCost ?? r.estimatedCost })),
        properties,
      ),
    ].filter((c) => c.amount > 0),
  };

  if (loading) {
    return (
      <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </main>
    );
  }

  return (
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
              <FinancialDrilldown income={incomeDrilldown} expenses={expenseDrilldown} />
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
                      ${metrics.totalIncome.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Rental income + realized sale profit</p>
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
                      ${metrics.totalExpenses.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Annualized rental expenses</p>
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
                      ${metrics.grossProfit.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {metrics.grossProfit >= 0 ? "Positive" : "Negative"}
                    </p>
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
                      ${metrics.netProfit.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">After estimated taxes/other (30%)</p>
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
                      {derived.cashOnCash.toFixed(1)}%
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Annual cash flow / cash basis</p>
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
                      {metrics.averageROI.toFixed(1)}%
                    </div>
                    <Progress value={Math.min(100, Math.max(0, metrics.averageROI))} className="h-2" />
                  </CardContent>
                </Card>

                <Card variant="glass">
                  <CardHeader>
                    <CardTitle className="text-lg text-foreground">Return on Equity (ROE)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-success-light mb-2">
                      {derived.roe.toFixed(1)}%
                    </div>
                    <Progress value={Math.min(100, Math.max(0, derived.roe))} className="h-2" />
                  </CardContent>
                </Card>

                <Card variant="glass">
                  <CardHeader>
                    <CardTitle className="text-lg text-foreground">Profit Margin</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-accent mb-2">
                      {metrics.netProfitMargin.toFixed(1)}%
                    </div>
                    <Progress value={Math.min(100, Math.max(0, metrics.netProfitMargin))} className="h-2" />
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
                    {incomeChartData.length === 0 ? (
                      <div className="h-[300px] flex items-center justify-center text-sm text-muted-foreground">
                        No income recorded yet
                      </div>
                    ) : (
                      <ChartContainer config={{}} className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={incomeChartData}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              dataKey="value"
                              label={({ name, value }) => `${name}: $${value.toLocaleString()}`}
                            >
                              {incomeChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                              ))}
                            </Pie>
                            <ChartTooltip content={<ChartTooltipContent />} />
                          </PieChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    )}
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
                    {expenseBreakdown.every((e) => e.amount === 0) ? (
                      <div className="h-[350px] flex items-center justify-center text-sm text-muted-foreground">
                        No expenses recorded yet
                      </div>
                    ) : (
                      <ChartContainer config={{}} className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={expenseBreakdown
                                .filter((item) => item.amount > 0)
                                .map((item, index) => ({
                                  name: item.category,
                                  value: item.amount,
                                  fill: CHART_COLORS[index % CHART_COLORS.length],
                                }))}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              innerRadius={40}
                              dataKey="value"
                              stroke="white"
                              strokeWidth={2}
                            >
                              {expenseBreakdown
                                .filter((item) => item.amount > 0)
                                .map((_, index) => (
                                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                ))}
                            </Pie>
                            <ChartTooltip
                              content={<ChartTooltipContent />}
                              formatter={(value, name) => [`$${Number(value).toLocaleString()}`, name]}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    )}
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
                    {renovationByCategory.length === 0 ? (
                      <div className="h-[400px] flex items-center justify-center text-sm text-muted-foreground">
                        No renovation items recorded yet
                      </div>
                    ) : (
                      <ChartContainer config={{}} className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={renovationByCategory}
                              cx="50%"
                              cy="50%"
                              outerRadius={120}
                              innerRadius={0}
                              dataKey="value"
                              stroke="none"
                              label={({ name, value }) => `${name}: $${value.toLocaleString()}`}
                              labelLine={false}
                            >
                              {renovationByCategory.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                              ))}
                            </Pie>
                            <ChartTooltip
                              content={<ChartTooltipContent />}
                              formatter={(value, name) => [`$${Number(value).toLocaleString()}`, name]}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    )}
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
                    <div className="text-2xl font-bold text-success">${rentalMonthlyIncome.toLocaleString()}</div>
                    <p className="text-xs text-success mt-1">From {rentalProperties.length} propert{rentalProperties.length === 1 ? "y" : "ies"}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Monthly Expenses
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-destructive">${rentalMonthlyExpenses.toLocaleString()}</div>
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
                    <div className="text-2xl font-bold text-primary">${rentalNOI.toLocaleString()}</div>
                    <p className="text-xs text-success mt-1">
                      {rentalMonthlyIncome > 0 ? `${rentalMargin.toFixed(0)}% profit margin` : "No rental income yet"}
                    </p>
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
                  {loans.length === 0 ? (
                    <p className="text-muted-foreground text-sm py-8 text-center">No loans recorded yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {loans.map((loan) => {
                        const lender = lenders.find((l) => l.id === loan.lenderId);
                        const maturity = loanMaturity(loan.startDate, loan.termMonths);
                        return (
                          <div key={loan.id} className="p-4 border rounded-lg bg-card">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h3 className="font-semibold">{propertyLabel(loan.propertyId, properties)}</h3>
                                <p className="text-sm text-muted-foreground">{lender?.name || "Lender not set"}</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <Badge variant={loan.status === "active" ? "default" : "outline"}>
                                  {loan.status.replace("_", " ").toUpperCase()}
                                </Badge>
                                <div className="text-right">
                                  <div className="font-bold">${loan.principal.toLocaleString()}</div>
                                  <div className="text-sm text-muted-foreground">Principal</div>
                                </div>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <div className="text-muted-foreground">Interest Rate</div>
                                <div className="font-semibold">{loan.interestRate}%</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">Daily Interest</div>
                                <div className="font-semibold text-destructive">
                                  ${loanDailyInterest(loan.principal, loan.interestRate).toFixed(2)}
                                </div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">Maturity Date</div>
                                <div className="font-semibold">{maturity || "—"}</div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {activeLoans.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-4">
                      See the Lending page for LTV and monthly-payment detail per loan.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cash-position" className="space-y-6">
              <CashPosition />
            </TabsContent>

            <TabsContent value="cash-forecast" className="space-y-6">
              <CashFlowForecast />
            </TabsContent>

            <TabsContent value="balance-sheet" className="space-y-6">
              <BalanceSheet financialData={placeholderFinancials} />
            </TabsContent>

            <TabsContent value="profit-loss" className="space-y-6">
              <ProfitLoss
                income={{
                  rental: incomeByCategory("rental"),
                  flip: incomeByCategory("flip"),
                  wholesale: incomeByCategory("wholesale"),
                  other: incomeByCategory("other"),
                }}
                expenses={{
                  acquisition: expenseByCategory("acquisition"),
                  holding: expenseByCategory("holding"),
                  selling: expenseByCategory("selling"),
                  refinancing: expenseByCategory("refinancing"),
                  renovation: renovationTotal,
                  rentalOps: expenseByCategory("rentalOps"),
                }}
              />
            </TabsContent>

            <TabsContent value="net-worth" className="space-y-6">
              <NetWorth financialData={placeholderFinancials} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
  );
};

export default FinancialsPage;
