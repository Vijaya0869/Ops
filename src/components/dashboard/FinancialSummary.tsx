import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Percent, PiggyBank, Wallet } from "lucide-react";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Skeleton } from "@/components/ui/skeleton";

export function FinancialSummary() {
  const { metrics, loading } = useDashboardData();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-32 bg-panel" />
        ))}
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toFixed(0)}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <Card variant="glass">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Income
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-accent">
            {formatCurrency(metrics.totalIncome)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Annual projected income
          </p>
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
            {formatCurrency(metrics.totalExpenses)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Annual operating expenses
          </p>
        </CardContent>
      </Card>

      <Card variant="glass">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Net Profit
          </CardTitle>
          <DollarSign className="h-4 w-4 text-success" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${metrics.netProfit >= 0 ? 'text-success' : 'text-destructive'}`}>
            {formatCurrency(metrics.netProfit)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            After estimated taxes
          </p>
        </CardContent>
      </Card>

      <Card variant="glass">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Profit Margin
          </CardTitle>
          <Percent className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-muted-foreground">
            {metrics.grossProfitMargin.toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Gross profit margin
          </p>
        </CardContent>
      </Card>

      <Card variant="glass">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Monthly Cash Flow
          </CardTitle>
          <Wallet className="h-4 w-4 text-accent" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${metrics.cashFlow >= 0 ? 'text-accent' : 'text-destructive'}`}>
            {formatCurrency(metrics.cashFlow)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Net rental cash flow
          </p>
        </CardContent>
      </Card>

      <Card variant="glass">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Portfolio ROI
          </CardTitle>
          <Percent className="h-4 w-4 text-success" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-success">
            {metrics.averageROI.toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Average return on investment
          </p>
        </CardContent>
      </Card>

      <Card variant="glass">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Equity
          </CardTitle>
          <PiggyBank className="h-4 w-4 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-accent">
            {formatCurrency(metrics.totalEquity)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Portfolio value minus loans
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
