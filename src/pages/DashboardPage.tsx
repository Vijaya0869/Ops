import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { TimePeriodDropdown, TimePeriod } from "@/components/ui/time-period-dropdown";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download } from "lucide-react";

// Import section components
import { OverallHealthKPI } from "@/components/dashboard/OverallHealthKPI";
import { FinancialHealthKPI } from "@/components/dashboard/FinancialHealthKPI";
import { LenderManagement } from "@/components/dashboard/LenderManagement";

import { AdminHRDashboard } from "@/components/dashboard/AdminHRDashboard";
import { OperationalExcellence } from "@/components/dashboard/OperationalExcellence";

const DashboardPage = () => {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("1month");

  const handleDownload = () => {
    const reportContent = `Comprehensive Dashboard Report - ${timePeriod}
==========================================

Generated on: ${new Date().toLocaleDateString()}
Time Period: ${timePeriod}

This report includes all dashboard metrics and KPIs.
`;
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-report-${timePeriod}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex min-h-screen purple-gradient">
      <Navigation />
      
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Real Estate Investment Dashboard</h1>
              <p className="text-muted-foreground">Comprehensive overview of operations, financials, and performance metrics</p>
            </div>
            <div className="flex gap-3">
              <TimePeriodDropdown 
                value={timePeriod} 
                onValueChange={setTimePeriod} 
              />
              <Button onClick={handleDownload} variant="gold" className="gap-2">
                <Download className="h-4 w-4" />
                Download Report
              </Button>
            </div>
          </div>

          {/* Main Dashboard Tabs */}
          <Tabs defaultValue="overall-health" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 glass-card">
              <TabsTrigger value="overall-health" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground text-muted-foreground">Operations Health</TabsTrigger>
              <TabsTrigger value="financial-health" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground text-muted-foreground">Financial Health</TabsTrigger>
              <TabsTrigger value="lender-mgmt" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground text-muted-foreground">Lender Management</TabsTrigger>
              <TabsTrigger value="admin-hr" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground text-muted-foreground">Admin & HR</TabsTrigger>
              <TabsTrigger value="ops-excellence" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground text-muted-foreground">Operational Excellence</TabsTrigger>
            </TabsList>

            <TabsContent value="overall-health" className="space-y-6">
              <OverallHealthKPI timePeriod={timePeriod} />
            </TabsContent>

            <TabsContent value="financial-health" className="space-y-6">
              <FinancialHealthKPI timePeriod={timePeriod} />
            </TabsContent>

            <TabsContent value="lender-mgmt" className="space-y-6">
              <LenderManagement timePeriod={timePeriod} />
            </TabsContent>


            <TabsContent value="admin-hr" className="space-y-6">
              <AdminHRDashboard timePeriod={timePeriod} />
            </TabsContent>

            <TabsContent value="ops-excellence" className="space-y-6">
              <OperationalExcellence timePeriod={timePeriod} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;