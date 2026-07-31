import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { TimePeriodDropdown, TimePeriod } from "@/components/ui/time-period-dropdown";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download } from "lucide-react";

// Import section components
import { AcquisitionsSection } from "@/components/operations/AcquisitionsSection";
import { DispositionSection } from "@/components/operations/DispositionSection";
import { RentalsSection } from "@/components/operations/RentalsSection";
import { ConstructionSection } from "@/components/operations/ConstructionSection";
import { AdminSection } from "@/components/operations/AdminSection";
import { LenderManagement } from "@/components/dashboard/LenderManagement";

const OperationsPage = () => {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("1month");

  const handleDownload = () => {
    const reportContent = `Operations Report - ${timePeriod}
==========================================

Generated on: ${new Date().toLocaleDateString()}
Time Period: ${timePeriod}

This report includes all operations metrics and performance data.
`;
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `operations-report-${timePeriod}-${Date.now()}.txt`;
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
              <h1 className="text-3xl font-bold text-foreground">Operations Management</h1>
              <p className="text-muted-foreground">Comprehensive view of all operational activities and performance metrics</p>
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

          {/* Operations Tabs */}
          <Tabs defaultValue="acquisitions" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6 glass-card">
              <TabsTrigger value="acquisitions" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground text-muted-foreground">Acquisitions</TabsTrigger>
              <TabsTrigger value="disposition" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground text-muted-foreground">Disposition</TabsTrigger>
              <TabsTrigger value="rentals" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground text-muted-foreground">Rentals</TabsTrigger>
              <TabsTrigger value="construction" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground text-muted-foreground">Construction</TabsTrigger>
              <TabsTrigger value="admin" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground text-muted-foreground">Admin & Others</TabsTrigger>
              <TabsTrigger value="lender-mgmt" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground text-muted-foreground">Lender Management</TabsTrigger>
            </TabsList>

            <TabsContent value="acquisitions" className="space-y-6">
              <AcquisitionsSection timePeriod={timePeriod} />
            </TabsContent>

            <TabsContent value="disposition" className="space-y-6">
              <DispositionSection timePeriod={timePeriod} />
            </TabsContent>

            <TabsContent value="rentals" className="space-y-6">
              <RentalsSection timePeriod={timePeriod} />
            </TabsContent>

            <TabsContent value="construction" className="space-y-6">
              <ConstructionSection timePeriod={timePeriod} />
            </TabsContent>

            <TabsContent value="admin" className="space-y-6">
              <AdminSection timePeriod={timePeriod} />
            </TabsContent>

            <TabsContent value="lender-mgmt" className="space-y-6">
              <LenderManagement timePeriod={timePeriod} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default OperationsPage;