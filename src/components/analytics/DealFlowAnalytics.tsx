import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { TimePeriod } from "@/components/ui/time-period-dropdown";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Users, Clock, CheckCircle, Target, Loader2 } from "lucide-react";
import { useDeals } from "@/hooks/useDeals";

interface DealFlowAnalyticsProps {
  timePeriod: TimePeriod;
}

const STAGE_LABELS: Record<string, string> = {
  lead: "Lead",
  analyzing: "Analyzing",
  offer_made: "Offer Made",
  under_contract: "Under Contract",
  due_diligence: "Due Diligence",
  closed: "Closed",
  dead: "Dead",
};

const STAGE_COLORS: Record<string, string> = {
  lead: "#94A3B8",
  analyzing: "#3B82F6",
  offer_made: "#F59E0B",
  under_contract: "#F97316",
  due_diligence: "#8B5CF6",
  closed: "#22C55E",
  dead: "#EF4444",
};

function daysBetween(a: Date, b: Date) {
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

export function DealFlowAnalytics({ timePeriod }: DealFlowAnalyticsProps) {
  const { deals, isLoading } = useDeals();

  const { pipelineData, conversionData, stageAgeData, dealMetrics } = useMemo(() => {
    const stages = Object.keys(STAGE_LABELS);
    const pipelineData = stages
      .map((stage) => ({
        name: STAGE_LABELS[stage],
        value: deals.filter((d) => d.stage === stage).length,
        color: STAGE_COLORS[stage],
      }))
      .filter((s) => s.value > 0);

    const sourceGroups = new Map<string, { leads: number; converted: number }>();
    deals.forEach((d) => {
      const source = d.source || "Unknown";
      const entry = sourceGroups.get(source) || { leads: 0, converted: 0 };
      entry.leads += 1;
      if (d.stage === "closed") entry.converted += 1;
      sourceGroups.set(source, entry);
    });
    const conversionData = Array.from(sourceGroups.entries()).map(([source, { leads, converted }]) => ({
      source,
      leads,
      converted,
      rate: leads > 0 ? (converted / leads) * 100 : 0,
    }));

    // How long deals currently sitting in each stage have been there — a
    // real, computable proxy. True stage-to-stage transition time would
    // need history this app doesn't record.
    const now = new Date();
    const stageAgeData = stages
      .map((stage) => {
        const inStage = deals.filter((d) => d.stage === stage);
        const avgDays =
          inStage.length > 0
            ? inStage.reduce((sum, d) => sum + daysBetween(new Date(d.created_at), now), 0) / inStage.length
            : 0;
        return { stage: STAGE_LABELS[stage], avgDays, count: inStage.length };
      })
      .filter((s) => s.count > 0);

    const closedDeals = deals.filter((d) => d.stage === "closed");
    const avgDaysToClose =
      closedDeals.length > 0
        ? closedDeals.reduce((sum, d) => sum + daysBetween(new Date(d.created_at), new Date(d.updated_at)), 0) /
          closedDeals.length
        : 0;

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const dealsThisMonth = closedDeals.filter((d) => new Date(d.updated_at) >= startOfMonth).length;

    const dealMetrics = {
      totalLeads: deals.length,
      conversionRate: deals.length > 0 ? (closedDeals.length / deals.length) * 100 : 0,
      avgDaysToClose,
      dealsThisMonth,
    };

    return { pipelineData, conversionData, stageAgeData, dealMetrics };
  }, [deals]);

  if (isLoading) {
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
          title="Total Deals"
          value={dealMetrics.totalLeads}
          icon={Users}
          change="All time"
          changeType="neutral"
        />
        <MetricCard
          title="Conversion Rate"
          value={`${dealMetrics.conversionRate.toFixed(1)}%`}
          icon={Target}
          change="Closed / total deals"
          changeType="neutral"
        />
        <MetricCard
          title="Avg Days to Close"
          value={dealMetrics.avgDaysToClose > 0 ? `${dealMetrics.avgDaysToClose.toFixed(0)} days` : "No closed deals yet"}
          icon={Clock}
          change="Created to closed"
          changeType="neutral"
        />
        <MetricCard
          title="Deals Closed This Month"
          value={dealMetrics.dealsThisMonth}
          icon={CheckCircle}
          change="Since the 1st"
          changeType="neutral"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-foreground">Lead Conversion by Source</CardTitle>
          </CardHeader>
          <CardContent>
            {conversionData.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-sm text-muted-foreground">
                No deals recorded yet
              </div>
            ) : (
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
                    formatter={(value: number) => [`${value.toFixed(1)}%`, "Conversion Rate"]}
                  />
                  <Bar dataKey="rate" fill="#3B82F6" name="Conversion Rate %" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-foreground">Deal Pipeline Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {pipelineData.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-sm text-muted-foreground">
                No deals recorded yet
              </div>
            ) : (
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
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-foreground">Lead Source Performance</CardTitle>
          </CardHeader>
          <CardContent>
            {conversionData.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No deals recorded yet</p>
            ) : (
              <div className="space-y-4">
                {conversionData.map((source, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg bg-panel">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{source.source}</h4>
                      <p className="text-sm text-muted-foreground">{source.leads} deals</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-foreground">{source.converted}</p>
                      <p className="text-sm text-muted-foreground">converted</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${source.rate > 10 ? 'text-accent' : source.rate > 7 ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {source.rate.toFixed(1)}%
                      </p>
                      <p className="text-sm text-muted-foreground">rate</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-foreground">Time in Current Stage</CardTitle>
            <p className="text-sm text-muted-foreground">
              How long deals sitting in each stage right now have been there
            </p>
          </CardHeader>
          <CardContent>
            {stageAgeData.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No deals recorded yet</p>
            ) : (
              <div className="space-y-4">
                {stageAgeData.map((stage, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg bg-panel">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{stage.stage}</h4>
                      <p className="text-sm text-muted-foreground">{stage.count} deal{stage.count === 1 ? "" : "s"}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-accent">{stage.avgDays.toFixed(0)} days</p>
                      <p className="text-sm text-muted-foreground">average</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
