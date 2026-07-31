import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { DealPipeline } from "@/components/dashboard/DealPipeline";
import { PortfolioOverview } from "@/components/dashboard/PortfolioOverview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TimePeriodDropdown, TimePeriod } from "@/components/ui/time-period-dropdown";
import { PropertyFormDialog } from "@/components/properties/PropertyFormDialog";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useProperties } from "@/hooks/useProperties";
import { PropertyFormData } from "@/types/property";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Building, 
  DollarSign, 
  TrendingUp, 
  Download,
  Percent,
  Plus
} from "lucide-react";

const Index = () => {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("1month");
  const [isPropertyFormOpen, setIsPropertyFormOpen] = useState(false);
  const { metrics, loading } = useDashboardData();
  const { addProperty } = useProperties();

  const handleDownload = () => {
    const reportContent = `Financial Overview Report - ${timePeriod}
==========================================

Generated on: ${new Date().toLocaleDateString()}
Time Period: ${timePeriod}

Portfolio Summary:
- Total Properties: ${metrics.totalProperties}
- Portfolio Value: $${metrics.portfolioValue.toLocaleString()}
- Total Equity: $${metrics.totalEquity.toLocaleString()}
- Monthly Cash Flow: $${metrics.cashFlow.toLocaleString()}
- Average ROI: ${metrics.averageROI.toFixed(1)}%

Operations:
- Active Rentals: ${metrics.activeRentals}
- Construction Projects: ${metrics.constructionProjects}
- Total Acquisitions: ${metrics.totalAcquisitions}
- Total Dispositions: ${metrics.totalDispositions}

Deals:
- Active Leads: ${metrics.totalLeads}
- Under Contract: ${metrics.underContract}
- Closed Deals: ${metrics.closedDeals}
`;
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-overview-${timePeriod}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAddProperty = async (data: Partial<PropertyFormData>) => {
    return await addProperty(data);
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toFixed(0)}`;
  };

  return (
    <div className="flex min-h-screen">
      <Navigation />
      
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Real Estate Investment Dashboard</h1>
              <p className="text-muted-foreground">Monitor your portfolio performance, track deals, and manage projects</p>
            </div>
            <div className="flex gap-3">
              <Button variant="gold" onClick={() => setIsPropertyFormOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Property
              </Button>
              <TimePeriodDropdown 
                value={timePeriod} 
                onValueChange={setTimePeriod} 
              />
              <Button onClick={handleDownload} variant="glass-outline" className="gap-2">
                <Download className="h-4 w-4" />
                Download Report
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-32 bg-panel" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricCard
                title="Total Equity"
                value={formatCurrency(metrics.totalEquity)}
                icon={DollarSign}
                change={metrics.totalEquity > 0 ? "Portfolio equity" : "Add properties to build equity"}
                changeType={metrics.totalEquity > 0 ? "positive" : "neutral"}
              />
              <MetricCard
                title="Average ROI"
                value={`${metrics.averageROI.toFixed(1)}%`}
                icon={TrendingUp}
                change={metrics.averageROI > 0 ? "From sold properties" : "No sales yet"}
                changeType={metrics.averageROI > 0 ? "positive" : "neutral"}
              />
              <MetricCard
                title="Total Properties"
                value={metrics.totalProperties.toString()}
                icon={Building}
                change={`${metrics.activeRentals} rentals, ${metrics.constructionProjects} in rehab`}
                changeType="positive"
              />
              <MetricCard
                title="Portfolio Value"
                value={formatCurrency(metrics.portfolioValue)}
                icon={Percent}
                change={metrics.portfolioValue > 0 ? "Total ARV" : "Add properties"}
                changeType={metrics.portfolioValue > 0 ? "positive" : "neutral"}
              />
            </div>
          )}

          {/* Detailed Financial Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="text-foreground">Income Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Portfolio Value</span>
                  <span className="font-semibold text-accent">{formatCurrency(metrics.portfolioValue)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Loan Amount</span>
                  <span className="font-semibold text-foreground">{formatCurrency(metrics.totalLoanAmount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Monthly Cash Flow</span>
                  <span className={`font-semibold ${metrics.cashFlow >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {formatCurrency(metrics.cashFlow)}
                  </span>
                </div>
                <hr className="border-border" />
                <div className="flex justify-between items-center font-semibold">
                  <span className="text-foreground">Total Equity</span>
                  <span className="text-accent">{formatCurrency(metrics.totalEquity)}</span>
                </div>
              </CardContent>
            </Card>

            <Card variant="glass">
              <CardHeader>
                <CardTitle className="text-foreground">Deal Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Active Leads</span>
                  <span className="font-semibold text-foreground">{metrics.totalLeads}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Under Contract</span>
                  <span className="font-semibold text-accent">{metrics.underContract}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Closed Deals</span>
                  <span className="font-semibold text-success">{metrics.closedDeals}</span>
                </div>
                <hr className="border-border" />
                <div className="flex justify-between items-center font-semibold">
                  <span className="text-foreground">Average Spread</span>
                  <span className="text-accent">{formatCurrency(metrics.avgSpread)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Deal Pipeline */}
          <DealPipeline />

          {/* Portfolio Overview */}
          <PortfolioOverview />
        </div>
      </main>

      <PropertyFormDialog
        open={isPropertyFormOpen}
        onOpenChange={setIsPropertyFormOpen}
        onSubmit={handleAddProperty}
      />
    </div>
  );
};

export default Index;
