import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { TimePeriod } from "@/components/ui/time-period-dropdown";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp, DollarSign, Target, Percent } from "lucide-react";

interface PortfolioPerformanceProps {
  timePeriod: TimePeriod;
}

export function PortfolioPerformance({ timePeriod }: PortfolioPerformanceProps) {
  const roiData = [
    { month: "Jan", roi: 12.5, cashFlow: 8500, irr: 15.2 },
    { month: "Feb", roi: 13.8, cashFlow: 9200, irr: 16.1 },
    { month: "Mar", roi: 15.2, cashFlow: 10100, irr: 17.3 },
    { month: "Apr", roi: 14.6, cashFlow: 9800, irr: 16.8 },
    { month: "May", roi: 16.1, cashFlow: 10500, irr: 18.2 },
    { month: "Jun", roi: 17.4, cashFlow: 11200, irr: 19.1 }
  ];

  const performanceMetrics = {
    totalROI: 16.8,
    avgCashOnCash: 14.2,
    portfolioIRR: 18.5,
    totalReturn: 142500
  };

  const propertyPerformance = [
    { type: "Single Family", count: 8, avgROI: 18.2, cashFlow: 6800 },
    { type: "Multi Family", count: 3, avgROI: 15.6, cashFlow: 4200 },
    { type: "Fix & Flip", count: 4, avgROI: 22.1, cashFlow: 0 },
    { type: "Commercial", count: 1, avgROI: 12.8, cashFlow: 2500 }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Portfolio ROI"
          value={`${performanceMetrics.totalROI}%`}
          icon={TrendingUp}
          change="+2.3% vs last quarter"
          changeType="positive"
        />
        <MetricCard
          title="Cash-on-Cash Return"
          value={`${performanceMetrics.avgCashOnCash}%`}
          icon={Percent}
          change="+1.8% vs last quarter"
          changeType="positive"
        />
        <MetricCard
          title="Portfolio IRR"
          value={`${performanceMetrics.portfolioIRR}%`}
          icon={Target}
          change="+3.1% vs last quarter"
          changeType="positive"
        />
        <MetricCard
          title="Total Return"
          value={`$${(performanceMetrics.totalReturn / 1000).toFixed(0)}K`}
          icon={DollarSign}
          change="+15% vs last quarter"
          changeType="positive"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-foreground">ROI & Cash Flow Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={roiData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
                <XAxis dataKey="month" stroke="#94A3B8" />
                <YAxis stroke="#94A3B8" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#131C2E', 
                    border: '1px solid #1E293B',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Line type="monotone" dataKey="roi" stroke="#3B82F6" strokeWidth={2} name="ROI %" />
                <Line type="monotone" dataKey="irr" stroke="#E2E8F0" strokeWidth={2} name="IRR %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-foreground">Performance by Property Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={propertyPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
                <XAxis dataKey="type" stroke="#94A3B8" />
                <YAxis stroke="#94A3B8" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#131C2E', 
                    border: '1px solid #1E293B',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Bar dataKey="avgROI" fill="#3B82F6" name="Avg ROI %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card variant="glass">
        <CardHeader>
          <CardTitle className="text-foreground">Property Type Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {propertyPerformance.map((property, index) => (
              <div key={index} className="p-4 border border-border rounded-lg bg-panel">
                <h4 className="font-semibold text-foreground mb-2">{property.type}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Properties:</span>
                    <span className="font-medium text-foreground">{property.count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Avg ROI:</span>
                    <span className="font-medium text-accent">{property.avgROI}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Cash Flow:</span>
                    <span className="font-medium text-foreground">${property.cashFlow.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}