import { ProfitLoss } from "@/components/financials/ProfitLoss";
import { useIncome } from "@/hooks/useIncome";
import { useExpenses } from "@/hooks/useExpenses";
import { useRenovationItems } from "@/hooks/useRenovationItems";
import { Loader2 } from "lucide-react";

export default function ProfitLossPage() {
  const { income, loading: incomeLoading } = useIncome();
  const { expenses, loading: expensesLoading } = useExpenses();
  const { renovationItems, loading: renovationLoading } = useRenovationItems();

  const loading = incomeLoading || expensesLoading || renovationLoading;

  const incomeByCategory = (category: string) =>
    income.filter((i) => i.category === category).reduce((sum, i) => sum + i.amount, 0);

  const expenseByCategory = (category: string) =>
    expenses.filter((e) => e.category === category).reduce((sum, e) => sum + e.amount, 0);

  const renovationTotal = renovationItems.reduce((sum, r) => sum + (r.actualCost ?? r.estimatedCost), 0);

  const incomeData = {
    rental: incomeByCategory("rental"),
    flip: incomeByCategory("flip"),
    wholesale: incomeByCategory("wholesale"),
    other: incomeByCategory("other"),
  };

  const expenseData = {
    acquisition: expenseByCategory("acquisition"),
    holding: expenseByCategory("holding"),
    selling: expenseByCategory("selling"),
    refinancing: expenseByCategory("refinancing"),
    renovation: renovationTotal,
    rentalOps: expenseByCategory("rentalOps"),
  };

  return (
    <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">Profit & Loss Statement</h1>
            <p className="text-muted-foreground">Comprehensive income and expense analysis</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <ProfitLoss income={incomeData} expenses={expenseData} />
          )}
        </div>
      </main>
  );
}
