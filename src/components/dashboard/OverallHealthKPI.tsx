import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { TimePeriod } from "@/components/ui/time-period-dropdown";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Building, 
  ShoppingCart, 
  TrendingUp, 
  Users,
  Hammer,
  DollarSign,
  Target,
  Calendar
} from "lucide-react";

interface OverallHealthKPIProps {
  timePeriod: TimePeriod;
}

export function OverallHealthKPI({ timePeriod }: OverallHealthKPIProps) {
  const { metrics, loading } = useDashboardData();

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

  return (
    <div className="space-y-6">
      {/* Operations Overview KPIs */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">Operations Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Acquisitions"
            value={metrics.totalAcquisitions}
            icon={ShoppingCart}
            change={metrics.totalAcquisitions > 0 ? "Active portfolio" : "No properties yet"}
            changeType={metrics.totalAcquisitions > 0 ? "positive" : "neutral"}
          />
          <MetricCard
            title="Total Dispositions"
            value={metrics.totalDispositions}
            icon={TrendingUp}
            change={metrics.totalDispositions > 0 ? "Properties sold" : "None sold yet"}
            changeType={metrics.totalDispositions > 0 ? "positive" : "neutral"}
          />
          <MetricCard
            title="Active Rentals"
            value={metrics.activeRentals}
            icon={Building}
            change={`${metrics.occupancyRate.toFixed(0)}% occupied`}
            changeType="positive"
          />
          <MetricCard
            title="Construction Projects"
            value={metrics.constructionProjects}
            icon={Hammer}
            change={`${metrics.projectsOnTime}/${metrics.constructionProjects} on schedule`}
            changeType="positive"
          />
        </div>
      </div>

      {/* Portfolio Summary */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">Total Portfolio</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <MetricCard
            title="Portfolio Value"
            value={formatCurrency(metrics.portfolioValue)}
            icon={DollarSign}
            change={metrics.portfolioValue > 0 ? "Current value" : "Add properties"}
            changeType={metrics.portfolioValue > 0 ? "positive" : "neutral"}
          />
          <MetricCard
            title="Total Properties"
            value={metrics.totalProperties}
            icon={Building}
            change={metrics.totalProperties > 0 ? "In portfolio" : "Start adding"}
            changeType={metrics.totalProperties > 0 ? "positive" : "neutral"}
          />
          <MetricCard
            title="Average ROI"
            value={`${metrics.averageROI.toFixed(1)}%`}
            icon={Target}
            change={metrics.averageROI > 15 ? "Above target" : "Building portfolio"}
            changeType={metrics.averageROI > 0 ? "positive" : "neutral"}
          />
          <MetricCard
            title="Occupancy Rate"
            value={`${metrics.occupancyRate.toFixed(0)}%`}
            icon={Users}
            change={metrics.occupancyRate >= 90 ? "Excellent" : "Room to grow"}
            changeType={metrics.occupancyRate >= 80 ? "positive" : "neutral"}
          />
        </div>

        {/* Portfolio Breakdown */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-foreground">Portfolio Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {metrics.propertyBreakdown.length > 0 ? (
              <div className="space-y-4">
                {metrics.propertyBreakdown.map((property, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg bg-panel hover:bg-panel-raised transition-all">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{property.type}</h3>
                      <p className="text-sm text-muted-foreground">{property.count} properties</p>
                    </div>
                    <div className="flex-1 text-center">
                      <p className="font-semibold text-accent">{formatCurrency(property.value)}</p>
                      <p className="text-sm text-muted-foreground">Total Value</p>
                    </div>
                    <div className="flex-1 text-right">
                      <p className="font-semibold text-foreground">
                        {property.avgRent > 0 ? `$${property.avgRent.toLocaleString()}` : 'N/A'}
                      </p>
                      <p className="text-sm text-muted-foreground">Avg Rent</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Building className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No properties in portfolio yet</p>
                <p className="text-sm">Add properties to see breakdown</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}