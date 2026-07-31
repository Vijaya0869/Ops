import { Navigation } from "@/components/Navigation";
import { FinancialDrilldown } from "@/components/financials/FinancialDrilldown";

const DrilldownPage = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <Navigation />
      
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Financial Drilldown
            </h1>
            <p className="text-muted-foreground">
              Detailed breakdown of income and expenses at project and portfolio level
            </p>
          </div>

          <FinancialDrilldown />
        </div>
      </main>
    </div>
  );
};

export default DrilldownPage;