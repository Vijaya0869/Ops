import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, TrendingDown } from "lucide-react";

interface ProfitLossProps {
  income: {
    rental: number;
    flip: number;
    wholesale: number;
    other: number;
  };
  expenses: {
    acquisition: number;
    holding: number;
    selling: number;
    refinancing: number;
    renovation: number;
    rentalOps: number;
  };
}

const INCOME_LABELS: Record<keyof ProfitLossProps["income"], string> = {
  rental: "Rental Income",
  flip: "Flip Income",
  wholesale: "Wholesale Income",
  other: "Other Income",
};

const EXPENSE_LABELS: Record<keyof ProfitLossProps["expenses"], string> = {
  acquisition: "Acquisition Costs",
  holding: "Holding Costs",
  selling: "Selling Costs",
  refinancing: "Refinancing Costs",
  renovation: "Renovation/Construction",
  rentalOps: "Rental Ops Costs",
};

export function ProfitLoss({ income, expenses }: ProfitLossProps) {
  const totalIncome = Object.values(income).reduce((sum, val) => sum + val, 0);
  const totalExpenses = Object.values(expenses).reduce((sum, val) => sum + val, 0);
  const netIncome = totalIncome - totalExpenses;
  const profitMargin = totalIncome > 0 ? (netIncome / totalIncome) * 100 : 0;

  const downloadProfitLoss = () => {
    const data = `Profit & Loss Statement
For the Period Ending ${new Date().toLocaleDateString()}

INCOME:
${(Object.keys(income) as (keyof typeof income)[])
  .map((key) => `- ${INCOME_LABELS[key]}: $${income[key].toLocaleString()}`)
  .join("\n")}
Total Income: $${totalIncome.toLocaleString()}

EXPENSES:
${(Object.keys(expenses) as (keyof typeof expenses)[])
  .map((key) => `- ${EXPENSE_LABELS[key]}: $${expenses[key].toLocaleString()}`)
  .join("\n")}
Total Expenses: $${totalExpenses.toLocaleString()}

Net Income: $${netIncome.toLocaleString()}

Profit Margin: ${profitMargin.toFixed(1)}%`;

    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'profit-loss-statement.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Profit & Loss Statement</h2>
          <p className="text-muted-foreground">For the Period Ending {new Date().toLocaleDateString()}</p>
        </div>
        <Button onClick={downloadProfitLoss} className="flex items-center gap-2 bg-accent hover:bg-accent/15 text-accent-foreground">
          <Download className="h-4 w-4" />
          Download
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-success">
              <TrendingUp className="h-5 w-5" />
              Income
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {(Object.keys(income) as (keyof typeof income)[]).map((key) => (
                <div key={key} className="flex justify-between py-2">
                  <span className="text-muted-foreground">{INCOME_LABELS[key]}</span>
                  <span className="font-medium text-accent">${income[key].toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between border-t border-border pt-3 text-lg font-bold">
                <span className="text-foreground">Total Income</span>
                <span className="text-accent">${totalIncome.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expenses */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <TrendingDown className="h-5 w-5" />
              Expenses
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {(Object.keys(expenses) as (keyof typeof expenses)[]).map((key) => (
                <div key={key} className="flex justify-between py-2">
                  <span className="text-muted-foreground">{EXPENSE_LABELS[key]}</span>
                  <span className="font-medium text-destructive">${expenses[key].toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between border-t border-border pt-3 text-lg font-bold">
                <span className="text-foreground">Total Expenses</span>
                <span className="text-destructive">${totalExpenses.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="text-foreground">Financial Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-accent/15 rounded-lg border border-accent/40">
              <div className="text-2xl font-bold text-accent">${totalIncome.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Income</div>
            </div>
            <div className="text-center p-4 bg-destructive/15 rounded-lg border border-destructive/40">
              <div className="text-2xl font-bold text-destructive">${totalExpenses.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Expenses</div>
            </div>
            <div className="text-center p-4 bg-success/15 rounded-lg border border-success/40">
              <div className="text-2xl font-bold text-success">${netIncome.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Net Income</div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <div className="text-lg font-semibold text-foreground">
              Profit Margin: <span className="text-accent">{profitMargin.toFixed(1)}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
