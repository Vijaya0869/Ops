import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { TimePeriod } from "@/components/ui/time-period-dropdown";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, DollarSign, Calendar, FileText, Building, TrendingUp } from "lucide-react";

interface AdminHRDashboardProps {
  timePeriod: TimePeriod;
}

export function AdminHRDashboard({ timePeriod }: AdminHRDashboardProps) {
  const { metrics, loading } = useDashboardData();

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground mb-4">Admin & HR Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 bg-panel" />
          ))}
        </div>
      </div>
    );
  }

  // Calculate admin metrics based on portfolio data
  const estimatedSalaries = Math.max(metrics.totalProperties * 2000, 8000); // Estimate based on portfolio size
  const estimatedOfficeExpenses = Math.max(metrics.totalProperties * 500, 2000);
  const estimatedSubscriptions = 1500 + (metrics.totalProperties * 100);
  const estimatedSupplies = 500 + (metrics.totalProperties * 50);

  const formatCurrency = (value: number) => {
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
    return `$${value.toFixed(0)}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">Admin & HR Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Est. Salaries"
            value={formatCurrency(estimatedSalaries)}
            icon={Users}
            change={`Based on ${metrics.totalProperties} properties`}
            changeType="neutral"
          />
          <MetricCard
            title="Office Expenses"
            value={formatCurrency(estimatedOfficeExpenses)}
            icon={DollarSign}
            change="Monthly estimate"
            changeType="neutral"
          />
          <MetricCard
            title="Subscriptions"
            value={formatCurrency(estimatedSubscriptions)}
            icon={Calendar}
            change="Software & services"
            changeType="neutral"
          />
          <MetricCard
            title="Office Supplies"
            value={formatCurrency(estimatedSupplies)}
            icon={FileText}
            change="Monthly spend"
            changeType="neutral"
          />
        </div>
      </div>

      {/* Portfolio Summary */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Building className="h-5 w-5 text-accent" />
            Portfolio Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-panel rounded-lg border border-border">
              <div className="text-muted-foreground text-sm">Total Properties</div>
              <div className="text-2xl font-bold text-foreground">{metrics.totalProperties}</div>
              <div className="text-xs text-muted-foreground mt-1">In portfolio</div>
            </div>
            <div className="p-4 bg-panel rounded-lg border border-border">
              <div className="text-muted-foreground text-sm">Active Rentals</div>
              <div className="text-2xl font-bold text-accent">{metrics.activeRentals}</div>
              <div className="text-xs text-muted-foreground mt-1">Generating income</div>
            </div>
            <div className="p-4 bg-panel rounded-lg border border-border">
              <div className="text-muted-foreground text-sm">Construction Projects</div>
              <div className="text-2xl font-bold text-muted-foreground">{metrics.constructionProjects}</div>
              <div className="text-xs text-muted-foreground mt-1">In progress</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deal Activity */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            Deal Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-4 bg-panel rounded-lg border border-border">
              <div className="text-muted-foreground text-sm">Active Leads</div>
              <div className="text-2xl font-bold text-foreground">{metrics.totalLeads}</div>
            </div>
            <div className="p-4 bg-panel rounded-lg border border-border">
              <div className="text-muted-foreground text-sm">Under Contract</div>
              <div className="text-2xl font-bold text-accent">{metrics.underContract}</div>
            </div>
            <div className="p-4 bg-panel rounded-lg border border-border">
              <div className="text-muted-foreground text-sm">Closed Deals</div>
              <div className="text-2xl font-bold text-success">{metrics.closedDeals}</div>
            </div>
            <div className="p-4 bg-panel rounded-lg border border-border">
              <div className="text-muted-foreground text-sm">Avg Spread</div>
              <div className="text-2xl font-bold text-muted-foreground">
                ${metrics.avgSpread > 0 ? metrics.avgSpread.toLocaleString() : '0'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
