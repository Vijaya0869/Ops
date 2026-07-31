import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { TimePeriod } from "@/components/ui/time-period-dropdown";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Building, 
  UserCheck, 
  UserX,
  ClipboardCheck,
  DollarSign,
  TrendingUp,
  Home
} from "lucide-react";

interface RentalsSectionProps {
  timePeriod: TimePeriod;
}

export function RentalsSection({ timePeriod }: RentalsSectionProps) {
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

  // Calculate rental metrics
  const totalMonthlyRent = metrics.rentalProperties.reduce((sum, p) => sum + (p.monthly_rent || 0), 0);
  const totalMonthlyExpenses = metrics.rentalProperties.reduce((sum, p) => sum + (p.monthly_expenses || 0), 0);
  const netOperatingIncome = totalMonthlyRent - totalMonthlyExpenses;
  const occupiedUnits = metrics.rentalProperties.filter(p => p.monthly_rent && p.monthly_rent > 0).length;
  const vacantUnits = metrics.rentalProperties.length - occupiedUnits;

  return (
    <div className="space-y-6">
      {/* Rentals Overview KPIs */}
      <div>
        <h3 className="text-xl font-bold text-foreground mb-4">Rentals Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Rental Units"
            value={metrics.activeRentals}
            icon={Building}
            change={metrics.activeRentals > 0 ? "In portfolio" : "No rentals yet"}
            changeType={metrics.activeRentals > 0 ? "positive" : "neutral"}
          />
          <MetricCard
            title="Occupied Units"
            value={occupiedUnits}
            icon={UserCheck}
            change={`${metrics.occupancyRate.toFixed(0)}% occupancy`}
            changeType={metrics.occupancyRate >= 90 ? "positive" : "neutral"}
          />
          <MetricCard
            title="Vacant Units"
            value={vacantUnits}
            icon={UserX}
            change={vacantUnits === 0 ? "Fully occupied" : "Need tenants"}
            changeType={vacantUnits === 0 ? "positive" : "neutral"}
          />
          <MetricCard
            title="Monthly NOI"
            value={formatCurrency(netOperatingIncome)}
            icon={DollarSign}
            change={netOperatingIncome > 0 ? "Net operating income" : "No income"}
            changeType={netOperatingIncome > 0 ? "positive" : "neutral"}
          />
        </div>
      </div>

      {/* Financial Performance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-foreground">Income Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Monthly Rent Income</span>
                <span className="font-semibold text-success">{formatCurrency(totalMonthlyRent)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Annual Income</span>
                <span className="font-semibold text-foreground">{formatCurrency(totalMonthlyRent * 12)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Avg Rent/Unit</span>
                <span className="font-semibold text-accent">
                  {formatCurrency(metrics.activeRentals > 0 ? totalMonthlyRent / metrics.activeRentals : 0)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-foreground">Expense Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Monthly Expenses</span>
                <span className="font-semibold text-destructive">{formatCurrency(totalMonthlyExpenses)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Annual Expenses</span>
                <span className="font-semibold text-foreground">{formatCurrency(totalMonthlyExpenses * 12)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Expense Ratio</span>
                <span className="font-semibold text-accent">
                  {totalMonthlyRent > 0 ? ((totalMonthlyExpenses / totalMonthlyRent) * 100).toFixed(1) : 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-foreground">Cash Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Monthly Cash Flow</span>
                <span className={`font-semibold ${netOperatingIncome >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {formatCurrency(netOperatingIncome)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Annual Cash Flow</span>
                <span className="font-semibold text-foreground">{formatCurrency(netOperatingIncome * 12)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">NOI Margin</span>
                <span className="font-semibold text-accent">
                  {totalMonthlyRent > 0 ? ((netOperatingIncome / totalMonthlyRent) * 100).toFixed(1) : 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rental Properties List */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="text-foreground">Rental Properties</CardTitle>
        </CardHeader>
        <CardContent>
          {metrics.rentalProperties.length > 0 ? (
            <div className="space-y-4">
              {metrics.rentalProperties.map((property) => {
                const cashFlow = (property.monthly_rent || 0) - (property.monthly_expenses || 0);
                return (
                  <div key={property.id} className="flex items-center justify-between p-4 border border-border rounded-lg bg-panel">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{property.address}</h4>
                      <p className="text-sm text-muted-foreground">{property.city}, {property.state}</p>
                    </div>
                    <div className="flex-1 text-center">
                      <p className="font-semibold text-accent">{formatCurrency(property.monthly_rent || 0)}</p>
                      <p className="text-sm text-muted-foreground">Monthly Rent</p>
                    </div>
                    <div className="flex-1 text-center">
                      <p className="font-semibold text-muted-foreground">{formatCurrency(property.monthly_expenses || 0)}</p>
                      <p className="text-sm text-muted-foreground">Expenses</p>
                    </div>
                    <div className="flex-1 text-center">
                      <p className={`font-semibold ${cashFlow >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {formatCurrency(cashFlow)}
                      </p>
                      <p className="text-sm text-muted-foreground">Cash Flow</p>
                    </div>
                    <div className="flex-1 text-right">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        property.monthly_rent && property.monthly_rent > 0
                          ? 'bg-success/15 text-success'
                          : 'bg-yellow-500/20 text-warning'
                      }`}>
                        {property.monthly_rent && property.monthly_rent > 0 ? 'Occupied' : 'Vacant'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Home className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No rental properties yet</p>
              <p className="text-sm">Add properties with status "Rental" to see them here</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}