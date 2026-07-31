import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { RenovationExpenses } from "@/components/financials/RenovationExpenses";
import { TimePeriodDropdown, TimePeriod } from "@/components/ui/time-period-dropdown";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function RenovationsPage() {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("1month");

  const downloadRenovationReport = () => {
    // Mock report generation - replace with actual implementation
    const reportData = `Renovation Expenses Report - ${new Date().toLocaleDateString()}
    
Time Period: ${timePeriod}

SUMMARY
-------
Total Projected Costs: $88,000
Total Actual Costs: $41,700
Budget Variance: -52.6%
Active Projects: 1

PROJECT BREAKDOWN
-----------------
Kitchen Renovation - 123 Main St
Status: Completed
Projected: $25,000 | Actual: $27,500 (+10.0%)
Timeline: 31 days (est.) | 36 days (actual) (+16.1%)

Bathroom Remodel - 456 Oak Ave  
Status: In Progress
Projected: $18,000 | Actual: $14,200 (20 days elapsed)
Timeline: 29 days (est.) | 20 days (current)

Full Rehab - 789 Pine St
Status: Planning
Projected: $45,000 | Actual: $0 (not started)
Timeline: 61 days (est.)

LABOR VS MATERIALS
------------------
Kitchen Renovation:
- Labor: $15,000 (proj.) | $16,800 (actual)
- Materials: $10,000 (proj.) | $10,700 (actual)

Bathroom Remodel:
- Labor: $12,000 (proj.) | $9,500 (actual to date)
- Materials: $6,000 (proj.) | $4,700 (actual to date)

Report generated on ${new Date().toLocaleString()}
    `;

    const blob = new Blob([reportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `renovation-expenses-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen bg-background">
      <Navigation />
      
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Renovation Expenses</h1>
              <p className="text-muted-foreground">Track projected vs actual costs, labor/materials breakdown, and timeline performance</p>
            </div>
            <div className="flex gap-3">
              <TimePeriodDropdown 
                value={timePeriod} 
                onValueChange={setTimePeriod} 
              />
              <Button variant="outline" className="gap-2" onClick={downloadRenovationReport}>
                <Download className="h-4 w-4" />
                Download Report
              </Button>
            </div>
          </div>

          <RenovationExpenses />
        </div>
      </main>
    </div>
  );
}