import { Navigation } from "@/components/Navigation";
import { NetWorth } from "@/components/financials/NetWorth";
import { Button } from "@/components/ui/button";
import { TimePeriodDropdown } from "@/components/ui/time-period-dropdown";
import { useTimePeriod, formatTimePeriodForDisplay } from "@/contexts/TimePeriodContext";
import { Download, Calendar } from "lucide-react";

export default function NetWorthPage() {
  const { timePeriod, setTimePeriod } = useTimePeriod();
  
  // Mock financial data - will be replaced with real data connections
  const financialData = {
    totalIncome: 125000,
    totalExpenses: 37500,
    rentalIncome: 60000,
    wholesaleProfits: 20000,
    flipSaleProceeds: 45000
  };

  const handleDownload = () => {
    const reportContent = `Net Worth Statement - ${timePeriod}
==========================================

Generated on: ${new Date().toLocaleDateString()}
Time Period: ${formatTimePeriodForDisplay(timePeriod)}

FINANCIAL SUMMARY
-----------------
Total Income: $${financialData.totalIncome.toLocaleString()}
Total Expenses: $${financialData.totalExpenses.toLocaleString()}
Net Income: $${(financialData.totalIncome - financialData.totalExpenses).toLocaleString()}

INCOME BREAKDOWN
----------------
Rental Income: $${financialData.rentalIncome.toLocaleString()}
Wholesale Profits: $${financialData.wholesaleProfits.toLocaleString()}
Flip Sale Proceeds: $${financialData.flipSaleProceeds.toLocaleString()}

Report generated for period: ${formatTimePeriodForDisplay(timePeriod)}
`;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `net-worth-statement-${timePeriod}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen bg-background">
      <Navigation />
      
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Net Worth Statement</h1>
              <p className="text-muted-foreground">
                Total assets minus liabilities calculation - {formatTimePeriodForDisplay(timePeriod)}
              </p>
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

          <NetWorth financialData={financialData} />
        </div>
      </main>
    </div>
  );
}