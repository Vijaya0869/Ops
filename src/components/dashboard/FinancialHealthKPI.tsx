import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { TimePeriod } from "@/components/ui/time-period-dropdown";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Percent,
  PiggyBank,
  Target,
  BarChart3,
  Calculator
} from "lucide-react";

interface FinancialHealthKPIProps {
  timePeriod: TimePeriod;
}

export function FinancialHealthKPI({ timePeriod }: FinancialHealthKPIProps) {
  const { metrics, loading } = useDashboardData(timePeriod);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 bg-panel" />
          ))}
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toFixed(0)}`;
  };

  // Calculate derived metrics
  const debtServiceCoverage = metrics.totalExpenses > 0 
    ? (metrics.totalIncome / metrics.totalExpenses).toFixed(1) 
    : 'N/A';
  
  const cashOnCashReturn = metrics.totalEquity > 0 
    ? ((metrics.cashFlow * 12) / metrics.totalEquity * 100).toFixed(1) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Primary Financial KPIs */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">Financial Health Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Income"
            value={formatCurrency(metrics.periodTotalIncome)}
            icon={DollarSign}
            change={metrics.periodTotalIncome > 0 ? "Income in period" : "No income yet"}
            changeType={metrics.periodTotalIncome > 0 ? "positive" : "neutral"}
          />
          <MetricCard
            title="Total Expenses"
            value={formatCurrency(metrics.periodTotalExpenses)}
            icon={TrendingDown}
            change={metrics.periodTotalExpenses > 0 ? "Expenses in period" : "No expenses"}
            changeType="neutral"
          />
          <MetricCard
            title="Gross Profit"
            value={formatCurrency(metrics.periodGrossProfit)}
            icon={TrendingUp}
            change={metrics.periodGrossProfit > 0 ? "Profitable" : "Building portfolio"}
            changeType={metrics.periodGrossProfit > 0 ? "positive" : "neutral"}
          />
          <MetricCard
            title="Net Profit"
            value={formatCurrency(metrics.periodNetProfit)}
            icon={PiggyBank}
            change={metrics.periodNetProfit > 0 ? "After taxes est." : "Building"}
            changeType={metrics.periodNetProfit > 0 ? "positive" : "neutral"}
          />
        </div>
      </div>

      {/* Profitability Metrics */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">Profitability Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Gross Profit Margin"
            value={`${metrics.periodGrossProfitMargin.toFixed(1)}%`}
            icon={Percent}
            change={metrics.periodGrossProfitMargin > 30 ? "Strong margin" : "Building"}
            changeType={metrics.periodGrossProfitMargin > 0 ? "positive" : "neutral"}
          />
          <MetricCard
            title="Net Profit Margin"
            value={`${metrics.periodNetProfitMargin.toFixed(1)}%`}
            icon={Calculator}
            change={metrics.periodNetProfitMargin > 20 ? "Excellent" : "Growing"}
            changeType={metrics.periodNetProfitMargin > 0 ? "positive" : "neutral"}
          />
          <MetricCard
            title="Return on Investment"
            value={`${metrics.periodAverageROI.toFixed(1)}%`}
            icon={Target}
            change={metrics.periodAverageROI > 15 ? "Above target" : "Building"}
            changeType={metrics.periodAverageROI > 0 ? "positive" : "neutral"}
          />
          <MetricCard
            title="Cash on Cash Return"
            value={`${cashOnCashReturn}%`}
            icon={BarChart3}
            change={Number(cashOnCashReturn) > 10 ? "Strong returns" : "Building equity"}
            changeType={Number(cashOnCashReturn) > 0 ? "positive" : "neutral"}
          />
        </div>
      </div>

      {/* Portfolio Value & Position */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-foreground">Portfolio Valuation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Portfolio Value</span>
              <span className="font-semibold text-lg text-foreground">{formatCurrency(metrics.portfolioValue)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Equity</span>
              <span className="font-semibold text-success">{formatCurrency(metrics.totalEquity)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Debt</span>
              <span className="font-semibold text-destructive">{formatCurrency(metrics.totalLoanAmount)}</span>
            </div>
            <hr className="border-border" />
            <div className="flex justify-between items-center font-semibold">
              <span className="text-foreground">Loan-to-Value Ratio</span>
              <span className="text-accent">{metrics.avgLTV.toFixed(1)}%</span>
            </div>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-foreground">Cash Flow Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Monthly Cash Flow</span>
              <span className={`font-semibold text-lg ${metrics.cashFlow >= 0 ? 'text-success' : 'text-destructive'}`}>
                {formatCurrency(metrics.cashFlow)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Annual Cash Flow</span>
              <span className="font-semibold text-foreground">{formatCurrency(metrics.cashFlow * 12)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Debt Service Coverage</span>
              <span className="font-semibold text-foreground">{debtServiceCoverage}x</span>
            </div>
            <hr className="border-border" />
            <div className="flex justify-between items-center font-semibold">
              <span className="text-foreground">Cash-on-Cash Return</span>
              <span className="text-accent">{cashOnCashReturn}%</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}