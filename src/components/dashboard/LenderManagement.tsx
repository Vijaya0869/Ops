import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { TimePeriod } from "@/components/ui/time-period-dropdown";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  DollarSign, 
  FileText, 
  Clock, 
  CheckCircle,
  Building,
  Calendar,
  TrendingUp,
  AlertCircle,
  Target
} from "lucide-react";

interface LenderManagementProps {
  timePeriod: TimePeriod;
}

export function LenderManagement({ timePeriod }: LenderManagementProps) {
  const { metrics, properties, loading } = useDashboardData();

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

  // Filter properties with loans
  const propertiesWithLoans = properties.filter(p => p.loan_amount && p.loan_amount > 0);
  const activeLoans = propertiesWithLoans.filter(p => 
    ['owned', 'in_rehab', 'listed', 'rental'].includes(p.status || '')
  );

  // Group by lender
  const lenderGroups = propertiesWithLoans.reduce((acc, p) => {
    const lender = p.lender_name || 'Unknown Lender';
    if (!acc[lender]) {
      acc[lender] = { count: 0, amount: 0, totalRate: 0, properties: [] as string[] };
    }
    acc[lender].count++;
    acc[lender].amount += p.loan_amount || 0;
    acc[lender].totalRate += p.interest_rate || 0;
    acc[lender].properties.push(p.address);
    return acc;
  }, {} as Record<string, { count: number; amount: number; totalRate: number; properties: string[] }>);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Lender Management</h2>
        <p className="text-muted-foreground">Overview of lending activities and property financing</p>
      </div>

      {/* Overview KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Loan Portfolio"
          value={formatCurrency(metrics.totalLoanAmount)}
          icon={DollarSign}
          change={metrics.totalLoanAmount > 0 ? "Outstanding debt" : "No loans"}
          changeType={metrics.totalLoanAmount > 0 ? "positive" : "neutral"}
        />
        <MetricCard
          title="Active Loans"
          value={activeLoans.length}
          icon={FileText}
          change={activeLoans.length > 0 ? "Properties financed" : "None"}
          changeType={activeLoans.length > 0 ? "positive" : "neutral"}
        />
        <MetricCard
          title="Avg Interest Rate"
          value={`${metrics.avgInterestRate.toFixed(1)}%`}
          icon={TrendingUp}
          change={metrics.avgInterestRate > 0 ? "Weighted average" : "No data"}
          changeType="neutral"
        />
        <MetricCard
          title="Avg LTV"
          value={`${metrics.avgLTV.toFixed(1)}%`}
          icon={Target}
          change={metrics.avgLTV <= 75 ? "Healthy leverage" : "Monitor closely"}
          changeType={metrics.avgLTV <= 75 ? "positive" : "neutral"}
        />
      </div>

      {/* Loan Types Breakdown */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="text-foreground">Lenders Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(lenderGroups).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(lenderGroups).map(([lender, data]) => (
                <div key={lender} className="p-4 border border-border rounded-lg bg-panel">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-foreground">{lender}</h4>
                    <span className="text-sm font-medium text-accent">{data.count} loans</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Amount</span>
                      <span className="font-semibold text-foreground">{formatCurrency(data.amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avg Rate</span>
                      <span className="font-semibold text-foreground">{(data.totalRate / data.count).toFixed(1)}%</span>
                    </div>
                    <div className="mt-3">
                      <p className="text-sm text-muted-foreground mb-1">Properties:</p>
                      {data.properties.slice(0, 3).map((property, idx) => (
                        <p key={idx} className="text-xs text-muted-foreground">{property}</p>
                      ))}
                      {data.properties.length > 3 && (
                        <p className="text-xs text-muted-foreground">+{data.properties.length - 3} more</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Building className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No lenders tracked yet</p>
              <p className="text-sm">Add loan information to properties to see lender breakdown</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Property Loan Status */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="text-foreground">Property Loan Status</CardTitle>
        </CardHeader>
        <CardContent>
          {propertiesWithLoans.length > 0 ? (
            <div className="space-y-4">
              {propertiesWithLoans.map((property) => {
                const ltv = property.arv ? ((property.loan_amount || 0) / property.arv * 100) : 0;
                return (
                  <div key={property.id} className="p-4 border border-border rounded-lg bg-panel">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                      <div>
                        <h4 className="font-semibold text-foreground">{property.address}</h4>
                        <p className="text-sm text-muted-foreground">{property.status}</p>
                        <p className="text-xs text-muted-foreground mt-1">{property.lender_name || 'Unknown Lender'}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-accent">{formatCurrency(property.loan_amount || 0)}</p>
                        <p className="text-sm text-muted-foreground">Loan Amount</p>
                        <p className="text-xs text-muted-foreground">{property.interest_rate || 0}% • {ltv.toFixed(0)}% LTV</p>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{formatCurrency(property.arv || 0)}</p>
                        <p className="text-sm text-muted-foreground">ARV</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Status</p>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            property.status === 'sold' 
                              ? 'bg-success/15 text-success' 
                              : property.status === 'in_rehab'
                              ? 'bg-yellow-500/20 text-warning'
                              : 'bg-accent/15 text-accent'
                          }`}>
                            {property.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No property loans recorded</p>
              <p className="text-sm">Add loan amounts to properties to track them here</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lender Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-foreground">Portfolio Leverage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Portfolio Value</span>
                <span className="font-semibold text-foreground">{formatCurrency(metrics.portfolioValue)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Debt</span>
                <span className="font-semibold text-destructive">{formatCurrency(metrics.totalLoanAmount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Equity</span>
                <span className="font-semibold text-success">{formatCurrency(metrics.totalEquity)}</span>
              </div>
              <hr className="border-border" />
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Overall LTV</span>
                <span className="font-semibold text-accent">{metrics.avgLTV.toFixed(1)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-foreground">Lender Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Active Lenders</span>
                <span className="font-semibold text-foreground">{Object.keys(lenderGroups).length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Properties Financed</span>
                <span className="font-semibold text-accent">{propertiesWithLoans.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Avg Rate</span>
                <span className="font-semibold text-foreground">{metrics.avgInterestRate.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Avg Loan Amount</span>
                <span className="font-semibold text-success">
                  {formatCurrency(propertiesWithLoans.length > 0 ? metrics.totalLoanAmount / propertiesWithLoans.length : 0)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}