import { BalanceSheet } from "@/components/financials/BalanceSheet";

export default function BalanceSheetPage() {
  // Mock financial data - will be replaced with real data connections
  const financialData = {
    totalIncome: 125000,
    totalExpenses: 37500,
    rentalIncome: 60000,
    wholesaleProfits: 20000,
    flipSaleProceeds: 45000
  };

  return (
    <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">Balance Sheet</h1>
            <p className="text-muted-foreground">Assets, liabilities, and equity statement</p>
          </div>

          <BalanceSheet financialData={financialData} />
        </div>
      </main>
  );
}