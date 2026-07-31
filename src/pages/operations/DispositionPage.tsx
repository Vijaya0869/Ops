import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { TimePeriodDropdown, TimePeriod } from "@/components/ui/time-period-dropdown";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { DispositionSection } from "@/components/operations/DispositionSection";

const DispositionPage = () => {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("1month");

  const handleDownload = () => {
    const reportContent = `Disposition Report - ${timePeriod}
==========================================

Generated on: ${new Date().toLocaleDateString()}
Time Period: ${timePeriod}

This report includes all disposition metrics and performance data.
`;
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `disposition-report-${timePeriod}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Navigation />
      
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Disposition</h1>
              <p className="text-muted-foreground">Property sales tracking and Scope IQ process</p>
            </div>
            <div className="flex gap-3">
              <TimePeriodDropdown 
                value={timePeriod} 
                onValueChange={setTimePeriod} 
              />
              <Button onClick={handleDownload} variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Download Report
              </Button>
            </div>
          </div>

          <DispositionSection timePeriod={timePeriod} />
        </div>
      </main>
    </div>
  );
};

export default DispositionPage;