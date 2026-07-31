import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { TimePeriod } from "@/components/ui/time-period-dropdown";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { Shield, AlertTriangle, TrendingDown, MapPin } from "lucide-react";

interface RiskAnalyticsProps {
  timePeriod: TimePeriod;
}

export function RiskAnalytics({ timePeriod }: RiskAnalyticsProps) {
  const ltvDistribution = [
    { range: "0-50%", count: 3, percentage: 18.8 },
    { range: "50-60%", count: 4, percentage: 25.0 },
    { range: "60-70%", count: 6, percentage: 37.5 },
    { range: "70-80%", count: 2, percentage: 12.5 },
    { range: "80%+", count: 1, percentage: 6.3 }
  ];

  const cashFlowStress = [
    { scenario: "Current", cashFlow: 11200 },
    { scenario: "-10% Rent", cashFlow: 9680 },
    { scenario: "-20% Rent", cashFlow: 8160 },
    { scenario: "+20% Expenses", cashFlow: 8960 },
    { scenario: "Vacancy (1 mo)", cashFlow: 9333 }
  ];

  const riskFactors = [
    { factor: "Market Risk", score: 85, fullMark: 100 },
    { factor: "Liquidity Risk", score: 70, fullMark: 100 },
    { factor: "Credit Risk", score: 90, fullMark: 100 },
    { factor: "Concentration Risk", score: 65, fullMark: 100 },
    { factor: "Interest Rate Risk", score: 75, fullMark: 100 },
    { factor: "Operational Risk", score: 80, fullMark: 100 }
  ];

  const geographicExposure = [
    { area: "Downtown", exposure: 35, riskLevel: "Medium" },
    { area: "Riverside", exposure: 28, riskLevel: "Low" },
    { area: "Hillside", exposure: 22, riskLevel: "Low" },
    { area: "Industrial", exposure: 15, riskLevel: "High" }
  ];

  const riskMetrics = {
    avgLTV: 62.4,
    portfolioVaR: 8.2,
    concentrationRisk: 35,
    stressTestScore: 78
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Average LTV"
          value={`${riskMetrics.avgLTV}%`}
          icon={Shield}
          change="Within safe range"
          changeType="positive"
        />
        <MetricCard
          title="Portfolio VaR (95%)"
          value={`${riskMetrics.portfolioVaR}%`}
          icon={AlertTriangle}
          change="Low risk exposure"
          changeType="positive"
        />
        <MetricCard
          title="Concentration Risk"
          value={`${riskMetrics.concentrationRisk}%`}
          icon={MapPin}
          change="Moderate concentration"
          changeType="neutral"
        />
        <MetricCard
          title="Stress Test Score"
          value={`${riskMetrics.stressTestScore}/100`}
          icon={TrendingDown}
          change="Good resilience"
          changeType="positive"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-foreground">LTV Distribution</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-foreground">Cash Flow Stress Testing</CardTitle>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-foreground">Risk Factor Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={riskFactors}>
                <PolarGrid stroke="rgba(148,163,184,0.25)" />
                <PolarAngleAxis dataKey="factor" stroke="#94A3B8" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#64748B" />
                <Radar name="Score" dataKey="score" stroke="#3B82F6" fill="rgba(59,130,246,0.20)" />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-foreground">Geographic Risk Exposure</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {geographicExposure.map((geo, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg bg-panel">
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{geo.area}</h4>
                    <p className="text-sm text-muted-foreground">{geo.exposure}% of portfolio</p>
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
            <div className="mt-4 p-3 bg-panel rounded-lg border-l-4 border-accent">
              <p className="text-sm text-muted-foreground mb-1">Risk Assessment</p>
              <p className="font-semibold text-foreground">
                Portfolio shows moderate concentration with balanced geographic distribution
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}