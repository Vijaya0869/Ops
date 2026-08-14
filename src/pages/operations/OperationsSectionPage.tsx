import { useState, type ComponentType } from "react";
import { TimePeriodDropdown, TimePeriod } from "@/components/ui/time-period-dropdown";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface OperationsSectionPageProps {
  title: string;
  subtitle: string;
  reportLabel: string;
  reportSlug: string;
  Section: ComponentType<{ timePeriod: TimePeriod }>;
}

// All 6 operations pages (Acquisitions, Disposition, Rentals, Construction,
// Admin, Lender Management) were identical 60-line wrappers differing only
// in title/subtitle and which section component they rendered.
export function OperationsSectionPage({ title, subtitle, reportLabel, reportSlug, Section }: OperationsSectionPageProps) {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("1month");

  const handleDownload = () => {
    const reportContent = `${reportLabel} Report - ${timePeriod}
==========================================

Generated on: ${new Date().toLocaleDateString()}
Time Period: ${timePeriod}

This report includes all ${reportLabel.toLowerCase()} metrics and performance data.
`;
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportSlug}-report-${timePeriod}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="flex-1 p-6 overflow-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{title}</h1>
            <p className="text-muted-foreground">{subtitle}</p>
          </div>
          <div className="flex gap-3">
            <TimePeriodDropdown value={timePeriod} onValueChange={setTimePeriod} />
            <Button onClick={handleDownload} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Download Report
            </Button>
          </div>
        </div>

        <Section timePeriod={timePeriod} />
      </div>
    </main>
  );
}
