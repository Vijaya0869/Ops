import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { TimePeriod } from "@/components/ui/time-period-dropdown";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Users, Clock, CheckCircle, Target } from "lucide-react";

interface DealFlowAnalyticsProps {
  timePeriod: TimePeriod;
}

export function DealFlowAnalytics({ timePeriod }: DealFlowAnalyticsProps) {
  const conversionData = [
    { source: "MLS", leads: 45, converted: 4, rate: 8.9 },
    { source: "Direct Sellers", leads: 32, converted: 5, rate: 15.6 },
    { source: "Wholesalers", leads: 28, converted: 2, rate: 7.1 },
    { source: "Networking", leads: 15, converted: 1, rate: 6.7 },
    { source: "Online Marketing", leads: 38, converted: 3, rate: 7.9 }
  ];

  const pipelineData = [
    { name: "Leads", value: 158, color: "#3B82F6" },
    { name: "Qualified", value: 42, color: "#E2E8F0" },
    { name: "Under Contract", value: 8, color: "#3B82F6" },
    { name: "Closed", value: 15, color: "#1D4ED8" }
  ];

  const timelineData = [
    { stage: "Lead to Qualified", avgDays: 3.2 },
    { stage: "Qualified to Offer", avgDays: 5.8 },
    { stage: "Offer to Contract", avgDays: 12.5 },
    { stage: "Contract to Close", avgDays: 28.3 }
  ];

  const dealMetrics = {
    totalLeads: 158,
    conversionRate: 9.5,
    avgDaysToClose: 49.8,
    dealsThisMonth: 15
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Leads"
          value={dealMetrics.totalLeads}
          icon={Users}
          change="+12% vs last month"
          changeType="positive"
        />
        <MetricCard
          title="Conversion Rate"
          value={`${dealMetrics.conversionRate}%`}
          icon={Target}
          change="+0.8% vs last month"
          changeType="positive"
        />
        <MetricCard
          title="Avg Days to Close"
          value={`${dealMetrics.avgDaysToClose} days`}
          icon={Clock}
          change="-3.2 days vs last month"
          changeType="positive"
        />
        <MetricCard
          title="Deals Closed"
          value={dealMetrics.dealsThisMonth}
          icon={CheckCircle}
          change="+3 vs last month"
          changeType="positive"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-foreground">Lead Conversion by Source</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={conversionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
                <XAxis dataKey="source" stroke="#94A3B8" />
                <YAxis stroke="#94A3B8" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#131C2E', 
                    border: '1px solid #1E293B',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Bar dataKey="rate" fill="#3B82F6" name="Conversion Rate %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-foreground">Deal Pipeline Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pipelineData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#3B82F6"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                  stroke="rgba(148,163,184,0.25)"
                >
                  {pipelineData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#131C2E', 
                    border: '1px solid #1E293B',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-foreground">Lead Source Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {conversionData.map((source, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg bg-panel">
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{source.source}</h4>
                    <p className="text-sm text-muted-foreground">{source.leads} leads</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-foreground">{source.converted}</p>
                    <p className="text-sm text-muted-foreground">converted</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${source.rate > 10 ? 'text-accent' : source.rate > 7 ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {source.rate}%
                    </p>
                    <p className="text-sm text-muted-foreground">rate</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-foreground">Deal Timeline Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {timelineData.map((timeline, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg bg-panel">
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{timeline.stage}</h4>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-accent">{timeline.avgDays} days</p>
                    <p className="text-sm text-muted-foreground">average</p>
                  </div>
                </div>
              ))}
              <div className="mt-4 p-3 bg-accent/15 rounded-lg border-l-4 border-accent">
                <p className="font-semibold text-foreground">Total Average Timeline</p>
                <p className="text-2xl font-bold text-accent">
                  {timelineData.reduce((sum, item) => sum + item.avgDays, 0).toFixed(1)} days
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}