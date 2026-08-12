import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { TimePeriod } from "@/components/ui/time-period-dropdown";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp, DollarSign, Target, Percent, Loader2 } from "lucide-react";
import { usePortfolioReturns } from "@/hooks/usePortfolioReturns";
import { useIncome } from "@/hooks/useIncome";
import { useExpenses } from "@/hooks/useExpenses";
import { currentDebtForProperty } from "@/lib/loan-utils";

interface PortfolioPerformanceProps {
  timePeriod: TimePeriod;
}

const OWNED_STATUSES = ["owned", "in_rehab", "listed", "rental"];

function lastSixMonths(): { key: string; label: string }[] {
  const months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label: d.toLocaleDateString("en-US", { month: "short" }) });
  }
  return months;
}

export function PortfolioPerformance({ timePeriod }: PortfolioPerformanceProps) {
  const { metrics, properties, loans, derived, loading: dashboardLoading } = usePortfolioReturns();
  const { income, loading: incomeLoading } = useIncome();
  const { expenses, loading: expensesLoading } = useExpenses();

  const loading = dashboardLoading || incomeLoading || expensesLoading;

  const { monthlyTrend, propertyPerformance } = useMemo(() => {
    const months = lastSixMonths();
    const monthlyTrend = months.map(({ key, label }) => {
      const [year, month] = key.split("-").map(Number);
      const monthIncome = income
        .filter((i) => {
          const d = new Date(i.incomeDate);
          return d.getFullYear() === year && d.getMonth() === month;
        })
        .reduce((sum, i) => sum + i.amount, 0);
      const monthExpenses = expenses
        .filter((e) => {
          const d = new Date(e.expenseDate);
          return d.getFullYear() === year && d.getMonth() === month;
        })
        .reduce((sum, e) => sum + e.amount, 0);
      return { month: label, cashFlow: monthIncome - monthExpenses };
    });

    const ownedProperties = properties.filter((p) => OWNED_STATUSES.includes(p.status || ""));
    const typeGroups = new Map<string, typeof ownedProperties>();
    ownedProperties.forEach((p) => {
      const type = p.property_type || "Unspecified";
      typeGroups.set(type, [...(typeGroups.get(type) || []), p]);
    });

    const propertyPerformance = Array.from(typeGroups.entries()).map(([type, props]) => {
      const cashFlow = props.reduce((sum, p) => sum + ((p.monthly_rent || 0) - (p.monthly_expenses || 0)), 0);
      const annualCashFlow = cashFlow * 12;
      const cashBasis = props.reduce((sum, p) => {
        const debt = currentDebtForProperty(p.id, loans, p.loan_amount || 0);
        return sum + Math.max(0, (p.purchase_price || 0) - debt);
      }, 0);
      const avgCashOnCash = cashBasis > 0 ? (annualCashFlow / cashBasis) * 100 : 0;
      return { type, count: props.length, avgCashOnCash, cashFlow };
    });

    return { monthlyTrend, propertyPerformance };
  }, [properties, loans, income, expenses]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Avg ROI (Sold Properties)"
          value={`${metrics.averageROI.toFixed(1)}%`}
          icon={TrendingUp}
          change={metrics.averageROI > 0 ? "From sold properties" : "No sales yet"}
          changeType={metrics.averageROI > 0 ? "positive" : "neutral"}
        />
        <MetricCard
          title="Cash-on-Cash Return"
          value={`${derived.cashOnCash.toFixed(1)}%`}
          icon={Percent}
          change="Annual cash flow / cash basis"
          changeType="neutral"
        />
        <MetricCard
          title="Return on Equity"
          value={`${derived.roe.toFixed(1)}%`}
          icon={Target}
          change="Annual cash flow / equity"
          changeType="neutral"
        />
        <MetricCard
          title="Net Profit"
          value={`$${(metrics.netProfit / 1000).toFixed(0)}K`}
          icon={DollarSign}
          change="After estimated taxes/other (30%)"
          changeType={metrics.netProfit >= 0 ? "positive" : "negative"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-foreground">Monthly Cash Flow Trend</CardTitle>
            <p className="text-xs text-muted-foreground">
              Real income minus expenses by month — a true multi-year ROI/IRR trend would need
              return history this app doesn't track yet
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
                <XAxis dataKey="month" stroke="#94A3B8" />
                <YAxis stroke="#94A3B8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#131C2E',
                    border: '1px solid #1E293B',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, "Cash Flow"]}
                />
                <Line type="monotone" dataKey="cashFlow" stroke="#3B82F6" strokeWidth={2} name="Cash Flow ($)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-foreground">Performance by Property Type</CardTitle>
          </CardHeader>
          <CardContent>
            {propertyPerformance.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-sm text-muted-foreground">
                No owned properties yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={propertyPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
                  <XAxis dataKey="type" stroke="#94A3B8" />
                  <YAxis stroke="#94A3B8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#131C2E',
                      border: '1px solid #1E293B',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                    formatter={(value: number) => [`${value.toFixed(1)}%`, "Avg Cash-on-Cash"]}
                  />
                  <Bar dataKey="avgCashOnCash" fill="#3B82F6" name="Avg Cash-on-Cash %" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <Card variant="glass">
        <CardHeader>
          <CardTitle className="text-foreground">Property Type Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          {propertyPerformance.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No owned properties yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {propertyPerformance.map((property, index) => (
                <div key={index} className="p-4 border border-border rounded-lg bg-panel">
                  <h4 className="font-semibold text-foreground mb-2">{property.type}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Properties:</span>
                      <span className="font-medium text-foreground">{property.count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Avg Cash-on-Cash:</span>
                      <span className="font-medium text-accent">{property.avgCashOnCash.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Cash Flow:</span>
                      <span className="font-medium text-foreground">${property.cashFlow.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
