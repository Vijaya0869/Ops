import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { DecisionMatrix } from "@/components/deals/DecisionMatrix";
import { DealPipeline } from "@/components/dashboard/DealPipeline";
import { TimePeriod } from "@/components/ui/time-period-dropdown";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ShoppingCart, 
  Users, 
  FileText, 
  CheckCircle, 
  DollarSign,
  TrendingUp,
  Target,
  Calendar,
  Building
} from "lucide-react";

interface AcquisitionsSectionProps {
  timePeriod: TimePeriod;
}

export function AcquisitionsSection({ timePeriod }: AcquisitionsSectionProps) {
  const { metrics, deals, loading } = useDashboardData();

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

  // Count deals by source
  const dealsBySource = deals.reduce((acc, deal) => {
    const source = deal.source || 'Other';
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalDeals = deals.length;

  return (
    <div className="space-y-6">
      {/* Acquisitions Overview KPIs */}
      <div>
        <h3 className="text-xl font-bold text-foreground mb-4">Acquisitions Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Acquisitions"
            value={metrics.totalAcquisitions}
            icon={ShoppingCart}
            change={metrics.totalAcquisitions > 0 ? "Properties acquired" : "None yet"}
            changeType={metrics.totalAcquisitions > 0 ? "positive" : "neutral"}
          />
          <MetricCard
            title="Total Leads"
            value={metrics.totalLeads}
            icon={Users}
            change={metrics.totalLeads > 0 ? "Active leads" : "Add deals"}
            changeType={metrics.totalLeads > 0 ? "positive" : "neutral"}
          />
          <MetricCard
            title="Under Contract"
            value={metrics.underContract}
            icon={FileText}
            change={metrics.underContract > 0 ? "In progress" : "None pending"}
            changeType={metrics.underContract > 0 ? "positive" : "neutral"}
          />
          <MetricCard
            title="Closed Deals"
            value={metrics.closedDeals}
            icon={CheckCircle}
            change={metrics.closedDeals > 0 ? "Successfully closed" : "None closed"}
            changeType={metrics.closedDeals > 0 ? "positive" : "neutral"}
          />
        </div>
      </div>

      {/* Acquisition Sources */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="text-foreground">Acquisition Sources</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(dealsBySource).length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(dealsBySource).map(([source, count]) => (
                <div key={source} className="text-center p-4 border border-border rounded-lg bg-panel">
                  <h4 className="font-semibold text-foreground">{source}</h4>
                  <p className="text-2xl font-bold text-accent">{count}</p>
                  <p className="text-sm text-muted-foreground">
                    {totalDeals > 0 ? `${((count / totalDeals) * 100).toFixed(0)}%` : '0%'} of total
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Building className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No deal sources tracked yet</p>
              <p className="text-sm">Add deals with sources to see breakdown</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Average Spread"
          value={formatCurrency(metrics.avgSpread)}
          icon={DollarSign}
          change={metrics.avgSpread > 0 ? "Per deal" : "No data yet"}
          changeType={metrics.avgSpread > 0 ? "positive" : "neutral"}
        />
        <MetricCard
          title="Purchase Volume"
          value={formatCurrency(metrics.purchaseVolume)}
          icon={TrendingUp}
          change={metrics.purchaseVolume > 0 ? "Total invested" : "No purchases"}
          changeType={metrics.purchaseVolume > 0 ? "positive" : "neutral"}
        />
        <MetricCard
          title="Average ARV"
          value={formatCurrency(metrics.avgARV)}
          icon={Target}
          change={metrics.avgARV > 0 ? "After repair value" : "No ARV data"}
          changeType={metrics.avgARV > 0 ? "positive" : "neutral"}
        />
        <MetricCard
          title="Avg Rehab Budget"
          value={formatCurrency(metrics.avgRehabBudget)}
          icon={Calendar}
          change={metrics.avgRehabBudget > 0 ? "Per project" : "No estimates"}
          changeType={metrics.avgRehabBudget > 0 ? "positive" : "neutral"}
        />
      </div>

      {/* LTV Analysis */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="text-foreground">Loan-to-Value (LTV) Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <MetricCard
              title="Average LTV"
              value={`${metrics.avgLTV.toFixed(1)}%`}
              icon={Target}
              change={metrics.avgLTV > 0 && metrics.avgLTV <= 75 ? "Within target" : "Monitor closely"}
              changeType={metrics.avgLTV <= 75 ? "positive" : "neutral"}
            />
          </div>
          
          {metrics.recentAcquisitions.length > 0 ? (
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground mb-4">Recent Acquisitions</h4>
              {metrics.recentAcquisitions.map((property) => {
                const totalCost = (property.purchase_price || 0) + (property.actual_rehab_cost || property.rehab_budget || 0);
                const arv = property.arv || property.purchase_price || 1;
                const ltv = (totalCost / arv) * 100;
                return (
                  <div key={property.id} className="flex items-center justify-between p-4 border border-border rounded-lg bg-panel">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{property.address}</h4>
                      <p className="text-sm text-muted-foreground">{property.property_type || 'Property'}</p>
                    </div>
                    <div className="flex-1 text-center">
                      <p className="font-semibold text-foreground">{formatCurrency(property.purchase_price || 0)}</p>
                      <p className="text-sm text-muted-foreground">Purchase</p>
                    </div>
                    <div className="flex-1 text-center">
                      <p className="font-semibold text-foreground">{formatCurrency(property.rehab_budget || 0)}</p>
                      <p className="text-sm text-muted-foreground">Rehab</p>
                    </div>
                    <div className="flex-1 text-center">
                      <p className="font-semibold text-accent">{formatCurrency(arv)}</p>
                      <p className="text-sm text-muted-foreground">ARV</p>
                    </div>
                    <div className="flex-1 text-center">
                      <p className={`font-semibold text-lg ${ltv <= 70 ? 'text-success' : ltv <= 80 ? 'text-warning' : 'text-destructive'}`}>
                        {ltv.toFixed(1)}%
                      </p>
                      <p className="text-sm text-muted-foreground">LTV</p>
                    </div>
                    <div className="flex-1 text-right">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        property.status === 'sold' 
                          ? 'bg-success/15 text-success' 
                          : 'bg-accent/15 text-accent'
                      }`}>
                        {property.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Building className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No acquisitions data yet</p>
              <p className="text-sm">Add properties to see LTV analysis</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Decision Matrix */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="text-foreground">Decision Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <DecisionMatrix />
        </CardContent>
      </Card>

      {/* Deal Pipeline */}
      <DealPipeline />
    </div>
  );
}