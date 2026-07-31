import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { CashPosition } from "@/components/financials/CashPosition";
import { TimePeriodDropdown, TimePeriod } from "@/components/ui/time-period-dropdown";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function CashPositionPage() {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("1month");
  // Mock financial data - will be replaced with real data connections
  const existingFinancials = {
    totalIncome: 125000,
    totalExpenses: 37500,
    rentalIncome: 60000,
    wholesaleProfits: 20000,
    flipSaleProceeds: 45000
  };

  return (
    <div className="flex h-screen bg-background">
      <Navigation />
      
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Cash Position</h1>
              <p className="text-muted-foreground">Current and projected cash inflows and outflows</p>
            </div>
            <div className="flex gap-3">
              <TimePeriodDropdown 
                value={timePeriod} 
                onValueChange={setTimePeriod} 
              />
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Download Report
              </Button>
            </div>
          </div>

          <CashPosition existingFinancials={existingFinancials} />
        </div>
      </main>
    </div>
  );
}