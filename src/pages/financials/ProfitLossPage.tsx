import { Navigation } from "@/components/Navigation";
import { ProfitLoss } from "@/components/financials/ProfitLoss";

export default function ProfitLossPage() {
  // Mock financial data - will be replaced with real data connections
  const financialData = {
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
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">Profit & Loss Statement</h1>
            <p className="text-muted-foreground">Comprehensive income and expense analysis</p>
          </div>

          <ProfitLoss financialData={financialData} />
        </div>
      </main>
    </div>
  );
}