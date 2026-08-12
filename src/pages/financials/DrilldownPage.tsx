import { Navigation } from "@/components/Navigation";
import { FinancialDrilldown, type DrilldownItem } from "@/components/financials/FinancialDrilldown";
import { useIncome } from "@/hooks/useIncome";
import { useExpenses } from "@/hooks/useExpenses";
import { useRenovationItems } from "@/hooks/useRenovationItems";
import { useProperties } from "@/hooks/useProperties";
import { Loader2 } from "lucide-react";
import type { Property } from "@/types/property";

const INCOME_CATEGORIES = [
  { id: "rental", name: "Rental Income" },
  { id: "flip", name: "Flip Income" },
  { id: "wholesale", name: "Wholesale Income" },
  { id: "other", name: "Other Income" },
];

const EXPENSE_CATEGORIES = [
  { id: "acquisition", name: "Acquisition Costs" },
  { id: "holding", name: "Holding Costs" },
  { id: "selling", name: "Selling Costs" },
  { id: "refinancing", name: "Refinancing Costs" },
  { id: "rentalOps", name: "Rental Ops Costs" },
];

function drilldownFromRecords(
  name: string,
  records: { propertyId: string; amount: number }[],
  properties: Property[],
): DrilldownItem {
  const byProperty = new Map<string, number>();
  records.forEach((r) => byProperty.set(r.propertyId, (byProperty.get(r.propertyId) || 0) + r.amount));
  const children = Array.from(byProperty.entries()).map(([propertyId, amount]) => ({
    name: properties.find((p) => p.id === propertyId)?.address || "Unknown property",
    amount,
  }));
  const amount = children.reduce((sum, c) => sum + c.amount, 0);
  return { name, amount, children: children.length ? children : undefined };
}

const DrilldownPage = () => {
  const { income, loading: incomeLoading } = useIncome();
  const { expenses, loading: expensesLoading } = useExpenses();
  const { renovationItems, loading: renovationLoading } = useRenovationItems();
  const { properties, loading: propertiesLoading } = useProperties();

  const loading = incomeLoading || expensesLoading || renovationLoading || propertiesLoading;

  const incomeChildren = INCOME_CATEGORIES.map((c) =>
    drilldownFromRecords(c.name, income.filter((i) => i.category === c.id), properties),
  ).filter((c) => c.amount > 0);

  const expenseChildren = [
    ...EXPENSE_CATEGORIES.map((c) =>
      drilldownFromRecords(c.name, expenses.filter((e) => e.category === c.id), properties),
    ),
    drilldownFromRecords(
      "Renovation/Construction",
      renovationItems.map((r) => ({ propertyId: r.propertyId, amount: r.actualCost ?? r.estimatedCost })),
      properties,
    ),
  ].filter((c) => c.amount > 0);

  const incomeDrilldown: DrilldownItem = {
    name: "Total Income",
    amount: incomeChildren.reduce((sum, c) => sum + c.amount, 0),
    children: incomeChildren,
  };

  const expenseDrilldown: DrilldownItem = {
    name: "Total Expenses",
    amount: expenseChildren.reduce((sum, c) => sum + c.amount, 0),
    children: expenseChildren,
  };

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

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <FinancialDrilldown income={incomeDrilldown} expenses={expenseDrilldown} />
          )}
        </div>
      </main>
    </div>
  );
};

export default DrilldownPage;
