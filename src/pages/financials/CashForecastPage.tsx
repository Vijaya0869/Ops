import { CashFlowForecast } from "@/components/financials/CashFlowForecast";

export default function CashForecastPage() {
  // Mock financial data - will be replaced with real data connections
  const existingFinancials = {
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
            <h1 className="text-3xl font-bold text-foreground">Cash Flow Forecast</h1>
            <p className="text-muted-foreground">12-month cash flow projections and analysis</p>
          </div>

          <CashFlowForecast existingFinancials={existingFinancials} />
        </div>
      </main>
  );
}