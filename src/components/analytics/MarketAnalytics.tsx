import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { TimePeriod } from "@/components/ui/time-period-dropdown";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { TrendingUp, Home, MapPin, Percent } from "lucide-react";

interface MarketAnalyticsProps {
  timePeriod: TimePeriod;
}

export function MarketAnalytics({ timePeriod }: MarketAnalyticsProps) {
  const marketTrends = [
    { month: "Jan", appreciation: 2.1, rentYield: 8.2, capRate: 6.8, marketCap: 6.5 },
    { month: "Feb", appreciation: 2.3, rentYield: 8.4, capRate: 6.9, marketCap: 6.7 },
    { month: "Mar", appreciation: 2.8, rentYield: 8.1, capRate: 7.1, marketCap: 6.9 },
    { month: "Apr", appreciation: 3.2, rentYield: 8.3, capRate: 7.3, marketCap: 7.1 },
    { month: "May", appreciation: 3.5, rentYield: 8.6, capRate: 7.5, marketCap: 7.2 },
    { month: "Jun", appreciation: 3.8, rentYield: 8.8, capRate: 7.8, marketCap: 7.4 }
  ];

  const neighborhoodData = [
    { area: "Downtown", properties: 4, avgValue: 245000, appreciation: 4.2, rentYield: 9.1 },
    { area: "Riverside", properties: 6, avgValue: 185000, appreciation: 3.8, rentYield: 8.7 },
    { area: "Hillside", properties: 3, avgValue: 320000, appreciation: 2.9, rentYield: 7.2 },
    { area: "Industrial", properties: 3, avgValue: 150000, appreciation: 5.1, rentYield: 10.3 }
  ];

  const marketMetrics = {
    portfolioAppreciation: 3.8,
    avgRentYield: 8.6,
    portfolioCapRate: 7.5,
    marketOutperformance: 1.2
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Portfolio Appreciation"
          value={`${marketMetrics.portfolioAppreciation}%`}
          icon={TrendingUp}
          change="+0.5% vs market avg"
          changeType="positive"
        />
        <MetricCard
          title="Avg Rent Yield"
          value={`${marketMetrics.avgRentYield}%`}
          icon={Home}
          change="+1.2% vs market avg"
          changeType="positive"
        />
        <MetricCard
          title="Portfolio Cap Rate"
          value={`${marketMetrics.portfolioCapRate}%`}
          icon={Percent}
          change="Above market avg"
          changeType="positive"
        />
        <MetricCard
          title="Market Outperformance"
          value={`+${marketMetrics.marketOutperformance}%`}
          icon={MapPin}
          change="Beating market"
          changeType="positive"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-foreground">Market Performance vs Portfolio</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={marketTrends}>
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
                <Line type="monotone" dataKey="appreciation" stroke="#3B82F6" strokeWidth={2} name="Portfolio Appreciation %" />
                <Line type="monotone" dataKey="marketCap" stroke="#E2E8F0" strokeWidth={2} strokeDasharray="5 5" name="Market Cap Rate %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-foreground">Rent Yield Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={marketTrends}>
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
                <Area type="monotone" dataKey="rentYield" stroke="#3B82F6" fill="rgba(59,130,246,0.20)" name="Rent Yield %" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card variant="glass">
        <CardHeader>
          <CardTitle className="text-foreground">Neighborhood Performance Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {neighborhoodData.map((neighborhood, index) => (
              <div key={index} className="p-4 border border-border rounded-lg bg-panel">
                <h4 className="font-semibold text-foreground mb-3">{neighborhood.area}</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Properties</p>
                    <p className="text-xl font-bold text-foreground">{neighborhood.properties}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Value</p>
                    <p className="text-xl font-bold text-foreground">${(neighborhood.avgValue / 1000).toFixed(0)}K</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Appreciation</p>
                    <p className="text-xl font-bold text-success-light">{neighborhood.appreciation}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Rent Yield</p>
                    <p className="text-xl font-bold text-accent">{neighborhood.rentYield}%</p>
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