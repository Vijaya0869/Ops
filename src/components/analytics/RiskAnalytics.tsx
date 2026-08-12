import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { TimePeriod } from "@/components/ui/time-period-dropdown";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Shield, AlertTriangle, TrendingDown, MapPin, Loader2 } from "lucide-react";
import { usePortfolioReturns } from "@/hooks/usePortfolioReturns";
import { currentDebtForProperty } from "@/lib/loan-utils";

interface RiskAnalyticsProps {
  timePeriod: TimePeriod;
}

const OWNED_STATUSES = ["owned", "in_rehab", "listed", "rental"];
const LTV_BUCKETS = [
  { range: "0-50%", min: 0, max: 50 },
  { range: "50-60%", min: 50, max: 60 },
  { range: "60-70%", min: 60, max: 70 },
  { range: "70-80%", min: 70, max: 80 },
  { range: "80%+", min: 80, max: Infinity },
];

export function RiskAnalytics({ timePeriod }: RiskAnalyticsProps) {
  const { metrics, properties, loans, derived, loading } = usePortfolioReturns();

  const { ltvDistribution, cashFlowStress, geographicExposure, highLtvCount, maxConcentration } = useMemo(() => {
    const ownedProperties = properties.filter((p) => OWNED_STATUSES.includes(p.status || ""));

    const propertyLtvs = ownedProperties.map((p) => {
      const value = p.arv || p.purchase_price || 0;
      const debt = currentDebtForProperty(p.id, loans, p.loan_amount || 0);
      return value > 0 ? (debt / value) * 100 : 0;
    });

    const ltvDistribution = LTV_BUCKETS.map((bucket) => {
      const count = propertyLtvs.filter((ltv) => ltv >= bucket.min && ltv < bucket.max).length;
      return {
        range: bucket.range,
        count,
        percentage: propertyLtvs.length > 0 ? (count / propertyLtvs.length) * 100 : 0,
      };
    }).filter((b) => b.count > 0);

    const highLtvCount = propertyLtvs.filter((ltv) => ltv >= 80).length;

    // Stress test: real percentage shocks applied to the actual current
    // rental income/expense split, not hypothetical figures.
    const rentalProperties = properties.filter((p) => p.status === "rental");
    const rentalIncome = rentalProperties.reduce((sum, p) => sum + (p.monthly_rent || 0), 0);
    const rentalExpenses = rentalProperties.reduce((sum, p) => sum + (p.monthly_expenses || 0), 0);
    const cashFlowStress = [
      { scenario: "Current", cashFlow: rentalIncome - rentalExpenses },
      { scenario: "-10% Rent", cashFlow: rentalIncome * 0.9 - rentalExpenses },
      { scenario: "-20% Rent", cashFlow: rentalIncome * 0.8 - rentalExpenses },
      { scenario: "+20% Expenses", cashFlow: rentalIncome - rentalExpenses * 1.2 },
      { scenario: "1 Month Vacancy*", cashFlow: rentalIncome * (11 / 12) - rentalExpenses },
    ];

    // Geographic concentration: real exposure by city, with a disclosed
    // (not invented) threshold rule for the risk label.
    const byArea = new Map<string, number>();
    ownedProperties.forEach((p) => {
      const area = [p.city, p.state].filter(Boolean).join(", ") || "Unknown";
      const value = p.arv || p.purchase_price || 0;
      byArea.set(area, (byArea.get(area) || 0) + value);
    });
    const totalValue = Array.from(byArea.values()).reduce((sum, v) => sum + v, 0);
    const geographicExposure = Array.from(byArea.entries())
      .map(([area, value]) => {
        const exposure = totalValue > 0 ? (value / totalValue) * 100 : 0;
        const riskLevel = exposure >= 40 ? "High" : exposure >= 20 ? "Medium" : "Low";
        return { area, exposure, riskLevel };
      })
      .sort((a, b) => b.exposure - a.exposure);

    const maxConcentration = geographicExposure[0]?.exposure ?? 0;

    return { ltvDistribution, cashFlowStress, geographicExposure, highLtvCount, maxConcentration };
  }, [properties, loans]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Average LTV"
          value={`${metrics.avgLTV.toFixed(1)}%`}
          icon={Shield}
          change={metrics.avgLTV < 70 ? "Within typical safe range" : "Elevated"}
          changeType={metrics.avgLTV < 70 ? "positive" : "neutral"}
        />
        <MetricCard
          title="Properties Over 80% LTV"
          value={highLtvCount}
          icon={AlertTriangle}
          change="High-leverage properties"
          changeType={highLtvCount > 0 ? "neutral" : "positive"}
        />
        <MetricCard
          title="Max Geographic Concentration"
          value={`${maxConcentration.toFixed(0)}%`}
          icon={MapPin}
          change={geographicExposure[0]?.area || "No owned properties yet"}
          changeType="neutral"
        />
        <MetricCard
          title="Debt Service Coverage"
          value={derived.dscr !== null ? `${derived.dscr.toFixed(2)}x` : "No debt service"}
          icon={TrendingDown}
          change="NOI / annual debt payments"
          changeType={derived.dscr === null || derived.dscr >= 1.25 ? "positive" : "neutral"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-foreground">LTV Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {ltvDistribution.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-sm text-muted-foreground">
                No owned properties yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ltvDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
                  <XAxis dataKey="range" stroke="#94A3B8" />
                  <YAxis stroke="#94A3B8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#131C2E',
                      border: '1px solid #1E293B',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Bar dataKey="count" fill="#3B82F6" name="Properties" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-foreground">Cash Flow Stress Testing</CardTitle>
            <p className="text-xs text-muted-foreground">
              *Vacancy scenario spreads one lost month of rent across the year
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cashFlowStress}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
                <XAxis dataKey="scenario" stroke="#94A3B8" />
                <YAxis stroke="#94A3B8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#131C2E',
                    border: '1px solid #1E293B',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  formatter={(value: number) => [`$${value.toFixed(0)}`, "Monthly Cash Flow"]}
                />
                <Bar
                  dataKey="cashFlow"
                  fill="#E2E8F0"
                  name="Cash Flow ($)"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card variant="glass">
        <CardHeader>
          <CardTitle className="text-foreground">Geographic Risk Exposure</CardTitle>
          <p className="text-sm text-muted-foreground">
            Share of portfolio value by city — 40%+ in one area is flagged High, 20%+ Medium
          </p>
        </CardHeader>
        <CardContent>
          {geographicExposure.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No owned properties yet</p>
          ) : (
            <div className="space-y-4">
              {geographicExposure.map((geo, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg bg-panel">
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{geo.area}</h4>
                    <p className="text-sm text-muted-foreground">{geo.exposure.toFixed(0)}% of portfolio</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      geo.riskLevel === 'Low'
                        ? 'bg-success/20 text-success-light'
                        : geo.riskLevel === 'Medium'
                        ? 'bg-accent/15 text-accent'
                        : 'bg-destructive/20 text-destructive'
                    }`}>
                      {geo.riskLevel} Risk
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
