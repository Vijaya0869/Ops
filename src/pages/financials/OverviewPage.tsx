import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Loader2 } from "lucide-react";

import { TimePeriodDropdown } from "@/components/ui/time-period-dropdown";
import { useTimePeriod, formatTimePeriodForDisplay } from "@/contexts/TimePeriodContext";
import { usePortfolioReturns } from "@/hooks/usePortfolioReturns";
import { DollarSign, TrendingUp, Percent, Download, TrendingDown, PiggyBank, Target, BarChart3, Calculator } from "lucide-react";

export default function OverviewPage() {
  const { timePeriod, setTimePeriod } = useTimePeriod();
  const { metrics, derived, loading } = usePortfolioReturns();

  const handleDownload = () => {
    const reportContent = `Financial Overview Report - ${timePeriod}
==========================================

Generated on: ${new Date().toLocaleDateString()}
Time Period: ${formatTimePeriodForDisplay(timePeriod)}

Total Income: $${metrics.totalIncome.toLocaleString()}
Total Expenses: $${metrics.totalExpenses.toLocaleString()}
Gross Profit: $${metrics.grossProfit.toLocaleString()}
Net Profit: $${metrics.netProfit.toLocaleString()}
Portfolio Value: $${metrics.portfolioValue.toLocaleString()}
Total Equity: $${metrics.totalEquity.toLocaleString()}
`;
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-overview-${timePeriod}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen bg-background">
      <Navigation />

      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Financial Overview</h1>
              <p className="text-muted-foreground">Key performance indicators and financial summary</p>
            </div>
            <div className="flex gap-3">
              <TimePeriodDropdown
                value={timePeriod}
                onValueChange={setTimePeriod}
              />
              <Button onClick={handleDownload} variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Download Report
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              {/* Primary Financial KPIs */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Financial Health Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <MetricCard
                    title="Total Income"
                    value={`$${(metrics.totalIncome / 1000).toFixed(0)}K`}
                    icon={DollarSign}
                    change="Rental income + realized sale profit"
                    changeType="neutral"
                  />
                  <MetricCard
                    title="Total Expenses"
                    value={`$${(metrics.totalExpenses / 1000).toFixed(0)}K`}
                    icon={TrendingDown}
                    change="Annualized rental expenses"
                    changeType="neutral"
                  />
                  <MetricCard
                    title="Gross Profit"
                    value={`$${(metrics.grossProfit / 1000).toFixed(0)}K`}
                    icon={TrendingUp}
                    change={metrics.grossProfit >= 0 ? "Positive" : "Negative"}
                    changeType={metrics.grossProfit >= 0 ? "positive" : "negative"}
                  />
                  <MetricCard
                    title="Net Profit"
                    value={`$${(metrics.netProfit / 1000).toFixed(0)}K`}
                    icon={PiggyBank}
                    change="After estimated taxes/other (30%)"
                    changeType="neutral"
                  />
                </div>
              </div>

              {/* Profitability Metrics */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Profitability Metrics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <MetricCard
                    title="Gross Profit Margin"
                    value={`${metrics.grossProfitMargin.toFixed(1)}%`}
                    icon={Percent}
                    change="Gross profit / income"
                    changeType="neutral"
                  />
                  <MetricCard
                    title="Net Profit Margin"
                    value={`${metrics.netProfitMargin.toFixed(1)}%`}
                    icon={Calculator}
                    change="Net profit / income"
                    changeType="neutral"
                  />
                  <MetricCard
                    title="Return on Investment"
                    value={`${metrics.averageROI.toFixed(1)}%`}
                    icon={Target}
                    change={metrics.averageROI > 0 ? "From sold properties" : "No sales yet"}
                    changeType={metrics.averageROI > 0 ? "positive" : "neutral"}
                  />
                  <MetricCard
                    title="Return on Equity"
                    value={`${derived.roe.toFixed(1)}%`}
                    icon={BarChart3}
                    change="Annual cash flow / equity"
                    changeType="neutral"
                  />
                </div>
              </div>

              {/* Portfolio Value & Position */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Portfolio Valuation</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total Portfolio Value</span>
                      <span className="font-semibold text-lg">${(metrics.portfolioValue / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total Equity</span>
                      <span className="font-semibold text-success">${(metrics.totalEquity / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total Debt</span>
                      <span className="font-semibold text-destructive">${(derived.totalDebt / 1000000).toFixed(1)}M</span>
                    </div>
                    <hr className="border-border" />
                    <div className="flex justify-between items-center font-semibold">
                      <span>Loan-to-Value Ratio</span>
                      <span>{derived.ltv.toFixed(1)}%</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Cash Flow Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Monthly Cash Flow</span>
                      <span className="font-semibold text-lg text-success">${metrics.cashFlow.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Annual Cash Flow</span>
                      <span className="font-semibold">${derived.annualCashFlow.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Debt Service Coverage</span>
                      <span className="font-semibold">{derived.dscr !== null ? `${derived.dscr.toFixed(2)}x` : "No debt service"}</span>
                    </div>
                    <hr className="border-border" />
                    <div className="flex justify-between items-center font-semibold">
                      <span>Cash-on-Cash Return</span>
                      <span className="text-primary">{derived.cashOnCash.toFixed(1)}%</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
