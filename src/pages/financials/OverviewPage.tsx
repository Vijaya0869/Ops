import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/dashboard/MetricCard";

import { TimePeriodDropdown } from "@/components/ui/time-period-dropdown";
import { useTimePeriod, formatTimePeriodForDisplay } from "@/contexts/TimePeriodContext";
import { DollarSign, TrendingUp, Building, Percent, Download, TrendingDown, PiggyBank, Target, BarChart3, Calculator } from "lucide-react";

export default function OverviewPage() {
  const { timePeriod, setTimePeriod } = useTimePeriod();

  const handleDownload = () => {
    const reportContent = `Financial Overview Report - ${timePeriod}
==========================================

Generated on: ${new Date().toLocaleDateString()}
Time Period: ${formatTimePeriodForDisplay(timePeriod)}
`;
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-overview-${timePeriod}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Mock data - will be replaced with real data connections
  const financialData = {
    totalIncome: 425000,
    totalExpenses: 285000,
    grossProfit: 140000,
    netProfit: 95000,
    grossProfitMargin: 32.9,
    netProfitMargin: 22.4,
    portfolioValue: 2500000,
    totalEquity: 1200000,
    roi: 18.5,
    roe: 24.2,
    cashFlow: 15500,
    debtServiceCoverage: 2.1
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

          {/* Primary Financial KPIs */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Financial Health Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricCard
                title="Total Income"
                value={`$${(financialData.totalIncome / 1000).toFixed(0)}K`}
                icon={DollarSign}
                change="+18% vs last quarter"
                changeType="positive"
              />
              <MetricCard
                title="Total Expenses"
                value={`$${(financialData.totalExpenses / 1000).toFixed(0)}K`}
                icon={TrendingDown}
                change="+5% vs last quarter"
                changeType="neutral"
              />
              <MetricCard
                title="Gross Profit"
                value={`$${(financialData.grossProfit / 1000).toFixed(0)}K`}
                icon={TrendingUp}
                change="+25% vs last quarter"
                changeType="positive"
              />
              <MetricCard
                title="Net Profit"
                value={`$${(financialData.netProfit / 1000).toFixed(0)}K`}
                icon={PiggyBank}
                change="+32% vs last quarter"
                changeType="positive"
              />
            </div>
          </div>

          {/* Profitability Metrics */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Profitability Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricCard
                title="Gross Profit Margin"
                value={`${financialData.grossProfitMargin}%`}
                icon={Percent}
                change="+3.2% vs target"
                changeType="positive"
              />
              <MetricCard
                title="Net Profit Margin"
                value={`${financialData.netProfitMargin}%`}
                icon={Calculator}
                change="+1.8% vs target"
                changeType="positive"
              />
              <MetricCard
                title="Return on Investment"
                value={`${financialData.roi}%`}
                icon={Target}
                change="Above 15% target"
                changeType="positive"
              />
              <MetricCard
                title="Return on Equity"
                value={`${financialData.roe}%`}
                icon={BarChart3}
                change="Excellent performance"
                changeType="positive"
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
                  <span className="font-semibold text-lg">${(financialData.portfolioValue / 1000000).toFixed(1)}M</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Equity</span>
                  <span className="font-semibold text-success">${(financialData.totalEquity / 1000000).toFixed(1)}M</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Debt</span>
                  <span className="font-semibold text-destructive">${((financialData.portfolioValue - financialData.totalEquity) / 1000000).toFixed(1)}M</span>
                </div>
                <hr className="border-border" />
                <div className="flex justify-between items-center font-semibold">
                  <span>Loan-to-Value Ratio</span>
                  <span>{(((financialData.portfolioValue - financialData.totalEquity) / financialData.portfolioValue) * 100).toFixed(1)}%</span>
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
                  <span className="font-semibold text-lg text-success">${financialData.cashFlow.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Annual Cash Flow</span>
                  <span className="font-semibold">${(financialData.cashFlow * 12).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Debt Service Coverage</span>
                  <span className="font-semibold">{financialData.debtServiceCoverage}x</span>
                </div>
                <hr className="border-border" />
                <div className="flex justify-between items-center font-semibold">
                  <span>Cash-on-Cash Return</span>
                  <span className="text-primary">{((financialData.cashFlow * 12) / 500000 * 100).toFixed(1)}%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}