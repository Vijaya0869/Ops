import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, TrendingDown } from "lucide-react";

interface ProfitLossProps {
  financialData: {
    totalIncome: number;
    totalExpenses: number;
    rentalIncome: number;
    wholesaleProfits: number;
    flipSaleProceeds: number;
  };
}

export function ProfitLoss({ financialData }: ProfitLossProps) {
  // Income breakdown based on dashboard data
  const income = {
    wholesaleSales: financialData.wholesaleProfits,
    fixFlipSales: financialData.flipSaleProceeds,
    wholetailSales: 15000,
    rentalIncome: financialData.rentalIncome,
    refinanceValue: 15000,
    otherIncome: 2000,
  };

  // Expense breakdown
  const expenses = {
    acquisitionCosts: 25000,
    closingCosts: 12000,
    holdingCosts: 18000,
    sellingCosts: 15000,
    refinancingCosts: 8000,
    franchiseFees: 5000,
    generalAdminExpenses: 12000,
    marketingExpenses: 3000,
  };

  const totalIncome = Object.values(income).reduce((sum, val) => sum + val, 0);
  const totalExpenses = Object.values(expenses).reduce((sum, val) => sum + val, 0);
  const grossProfit = totalIncome - totalExpenses;
  const netIncome = grossProfit; // Assuming no additional taxes for simplicity

  const downloadProfitLoss = () => {
    const data = `R&R Grandeur Properties LLC - Profit & Loss Statement
For the Period Ending ${new Date().toLocaleDateString()}

INCOME:
- Wholesale Sales: $${income.wholesaleSales.toLocaleString()}
- Fix & Flip Sales: $${income.fixFlipSales.toLocaleString()}
- Wholetail Sales: $${income.wholetailSales.toLocaleString()}
- Rental Income: $${income.rentalIncome.toLocaleString()}
- Refinance Value: $${income.refinanceValue.toLocaleString()}
- Other Income: $${income.otherIncome.toLocaleString()}
Total Income: $${totalIncome.toLocaleString()}

EXPENSES:
- Acquisition Costs: $${expenses.acquisitionCosts.toLocaleString()}
- Closing Costs: $${expenses.closingCosts.toLocaleString()}
- Holding Costs: $${expenses.holdingCosts.toLocaleString()}
- Selling Costs: $${expenses.sellingCosts.toLocaleString()}
- Refinancing Costs: $${expenses.refinancingCosts.toLocaleString()}
- Franchise Fees: $${expenses.franchiseFees.toLocaleString()}
- General & Admin Expenses: $${expenses.generalAdminExpenses.toLocaleString()}
- Marketing Expenses: $${expenses.marketingExpenses.toLocaleString()}
Total Expenses: $${totalExpenses.toLocaleString()}

Gross Profit: $${grossProfit.toLocaleString()}
Net Income: $${netIncome.toLocaleString()}

Profit Margin: ${((netIncome / totalIncome) * 100).toFixed(1)}%`;

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
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Wholesale Sales</span>
                <span className="font-medium text-accent">${income.wholesaleSales.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Fix & Flip Sales</span>
                <span className="font-medium text-accent">${income.fixFlipSales.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Wholetail Sales</span>
                <span className="font-medium text-accent">${income.wholetailSales.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Rental Income</span>
                <span className="font-medium text-accent">${income.rentalIncome.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Refinance Value</span>
                <span className="font-medium text-accent">${income.refinanceValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Other Income</span>
                <span className="font-medium text-accent">${income.otherIncome.toLocaleString()}</span>
              </div>
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
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Acquisition Costs</span>
                <span className="font-medium text-destructive">${expenses.acquisitionCosts.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Closing Costs</span>
                <span className="font-medium text-destructive">${expenses.closingCosts.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Holding Costs</span>
                <span className="font-medium text-destructive">${expenses.holdingCosts.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Selling Costs</span>
                <span className="font-medium text-destructive">${expenses.sellingCosts.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Refinancing Costs</span>
                <span className="font-medium text-destructive">${expenses.refinancingCosts.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Franchise Fees</span>
                <span className="font-medium text-destructive">${expenses.franchiseFees.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">General & Admin</span>
                <span className="font-medium text-destructive">${expenses.generalAdminExpenses.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Marketing Expenses</span>
                <span className="font-medium text-destructive">${expenses.marketingExpenses.toLocaleString()}</span>
              </div>
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
              Profit Margin: <span className="text-accent">{((netIncome / totalIncome) * 100).toFixed(1)}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}