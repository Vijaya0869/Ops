import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { TimePeriod } from "@/components/ui/time-period-dropdown";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  TrendingUp, 
  Calendar, 
  Target, 
  DollarSign,
  CheckCircle,
  Briefcase,
  BarChart3,
  Building
} from "lucide-react";

interface DispositionSectionProps {
  timePeriod: TimePeriod;
}

export function DispositionSection({ timePeriod }: DispositionSectionProps) {
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

  // Calculate total profit from sales
  const totalSalesProfit = metrics.recentSales.reduce((sum, p) => {
    const profit = (p.sale_price || 0) - (p.purchase_price || 0) - (p.actual_rehab_cost || p.rehab_budget || 0);
    return sum + profit;
  }, 0);

  const avgSalePrice = metrics.recentSales.length > 0
    ? metrics.recentSales.reduce((sum, p) => sum + (p.sale_price || 0), 0) / metrics.recentSales.length
    : 0;

  const profitMargin = avgSalePrice > 0
    ? (totalSalesProfit / (avgSalePrice * metrics.recentSales.length)) * 100
    : 0;

  return (
    <div className="space-y-6">
      {/* Disposition Overview KPIs */}
      <div>
        <h3 className="text-xl font-bold text-foreground mb-4">Disposition Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Properties Sold"
            value={metrics.totalDispositions}
            icon={CheckCircle}
            change={metrics.totalDispositions > 0 ? "Successfully sold" : "None sold yet"}
            changeType={metrics.totalDispositions > 0 ? "positive" : "neutral"}
          />
          <MetricCard
            title="Total Sales Profit"
            value={formatCurrency(totalSalesProfit)}
            icon={DollarSign}
            change={totalSalesProfit > 0 ? "Net profit" : "No sales yet"}
            changeType={totalSalesProfit > 0 ? "positive" : "neutral"}
          />
          <MetricCard
            title="Profit Margin"
            value={`${profitMargin.toFixed(1)}%`}
            icon={Target}
            change={profitMargin > 20 ? "Strong margin" : "Building"}
            changeType={profitMargin > 0 ? "positive" : "neutral"}
          />
          <MetricCard
            title="Avg Sale Price"
            value={formatCurrency(avgSalePrice)}
            icon={TrendingUp}
            change={avgSalePrice > 0 ? "Per property" : "No data"}
            changeType={avgSalePrice > 0 ? "positive" : "neutral"}
          />
        </div>
      </div>

      {/* Scope IQ Process */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="text-foreground">Disposition Process</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border border-border rounded-lg bg-panel">
              <Briefcase className="h-8 w-8 mx-auto mb-2 text-accent" />
              <h4 className="font-semibold text-foreground">Assessment</h4>
              <p className="text-sm text-muted-foreground">Property evaluation & scope definition</p>
            </div>
            <div className="text-center p-4 border border-border rounded-lg bg-panel">
              <BarChart3 className="h-8 w-8 mx-auto mb-2 text-accent" />
              <h4 className="font-semibold text-foreground">Analysis</h4>
              <p className="text-sm text-muted-foreground">Market data & profit projections</p>
            </div>
            <div className="text-center p-4 border border-border rounded-lg bg-panel">
              <Target className="h-8 w-8 mx-auto mb-2 text-accent" />
              <h4 className="font-semibold text-foreground">Strategy</h4>
              <p className="text-sm text-muted-foreground">Pricing & marketing approach</p>
            </div>
            <div className="text-center p-4 border border-border rounded-lg bg-panel">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-accent" />
              <h4 className="font-semibold text-foreground">Execution</h4>
              <p className="text-sm text-muted-foreground">Sales process & closing</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-foreground">Profit Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Sales Profit</span>
                <span className={`font-semibold ${totalSalesProfit >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {formatCurrency(totalSalesProfit)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Properties Sold</span>
                <span className="font-semibold text-foreground">{metrics.totalDispositions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Profit Margin</span>
                <span className="font-semibold text-accent">{profitMargin.toFixed(1)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-foreground">Market Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Avg Sale Price</span>
                <span className="font-semibold text-foreground">{formatCurrency(avgSalePrice)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Volume</span>
                <span className="font-semibold text-success">
                  {formatCurrency(metrics.recentSales.reduce((sum, p) => sum + (p.sale_price || 0), 0))}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Average ROI</span>
                <span className="font-semibold text-foreground">{metrics.averageROI.toFixed(1)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-foreground">Portfolio Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Properties Listed</span>
                <span className="font-semibold text-foreground">{metrics.totalProperties - metrics.totalDispositions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Properties Sold</span>
                <span className="font-semibold text-foreground">{metrics.totalDispositions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Success Rate</span>
                <span className="font-semibold text-success">
                  {metrics.totalProperties > 0 ? ((metrics.totalDispositions / metrics.totalProperties) * 100).toFixed(0) : 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sales */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="text-foreground">Recent Sales</CardTitle>
        </CardHeader>
        <CardContent>
          {metrics.recentSales.length > 0 ? (
            <div className="space-y-4">
              {metrics.recentSales.map((sale) => {
                const profit = (sale.sale_price || 0) - (sale.purchase_price || 0) - (sale.actual_rehab_cost || sale.rehab_budget || 0);
                return (
                  <div key={sale.id} className="flex items-center justify-between p-4 border border-border rounded-lg bg-panel">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{sale.address}</h4>
                      <p className="text-sm text-muted-foreground">{sale.property_type || 'Property'}</p>
                    </div>
                    <div className="flex-1 text-center">
                      <p className="font-semibold text-accent">{formatCurrency(sale.sale_price || 0)}</p>
                      <p className="text-sm text-muted-foreground">Sale Price</p>
                    </div>
                    <div className="flex-1 text-center">
                      <p className="font-semibold text-muted-foreground">{formatCurrency(sale.purchase_price || 0)}</p>
                      <p className="text-sm text-muted-foreground">Purchase Price</p>
                    </div>
                    <div className="flex-1 text-center">
                      <p className={`font-semibold ${profit >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {formatCurrency(profit)}
                      </p>
                      <p className="text-sm text-muted-foreground">Profit</p>
                    </div>
                    <div className="flex-1 text-right">
                      <span className="px-2 py-1 text-xs rounded-full bg-success/15 text-success">
                        Sold
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Building className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No sales recorded yet</p>
              <p className="text-sm">Mark properties as sold to see them here</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}