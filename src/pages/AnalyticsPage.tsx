import { useState } from "react";
import { TimePeriodDropdown, TimePeriod } from "@/components/ui/time-period-dropdown";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PortfolioPerformance } from "@/components/analytics/PortfolioPerformance";
import { DealFlowAnalytics } from "@/components/analytics/DealFlowAnalytics";
import { MarketAnalytics } from "@/components/analytics/MarketAnalytics";
import { RiskAnalytics } from "@/components/analytics/RiskAnalytics";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const AnalyticsPage = () => {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("1month");

  const handleDownload = () => {
    const reportContent = `Analytics Report - ${timePeriod}
==========================================

Generated on: ${new Date().toLocaleDateString()}
Time Period: ${timePeriod}

This comprehensive analytics report includes:
- Portfolio Performance Analysis
- Deal Flow and Conversion Metrics
- Market Performance Comparison
- Risk Assessment and Stress Testing
`;
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-report-${timePeriod}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
              <p className="text-muted-foreground">Comprehensive performance analysis and insights</p>
            </div>
            <div className="flex gap-3">
              <TimePeriodDropdown 
                value={timePeriod} 
                onValueChange={setTimePeriod} 
              />
              <Button onClick={handleDownload} variant="glass-outline" className="gap-2">
                <Download className="h-4 w-4" />
                Download Report
              </Button>
            </div>
          </div>

          {/* Analytics Tabs */}
          <Tabs defaultValue="portfolio" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 glass-card">
              <TabsTrigger value="portfolio" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground text-muted-foreground">Portfolio Performance</TabsTrigger>
              <TabsTrigger value="deals" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground text-muted-foreground">Deal Flow</TabsTrigger>
              <TabsTrigger value="market" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground text-muted-foreground">Market Analysis</TabsTrigger>
              <TabsTrigger value="risk" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground text-muted-foreground">Risk Assessment</TabsTrigger>
            </TabsList>

            <TabsContent value="portfolio" className="space-y-6">
              <PortfolioPerformance timePeriod={timePeriod} />
            </TabsContent>

            <TabsContent value="deals" className="space-y-6">
              <DealFlowAnalytics timePeriod={timePeriod} />
            </TabsContent>

            <TabsContent value="market" className="space-y-6">
              <MarketAnalytics timePeriod={timePeriod} />
            </TabsContent>

            <TabsContent value="risk" className="space-y-6">
              <RiskAnalytics timePeriod={timePeriod} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
  );
};

export default AnalyticsPage;