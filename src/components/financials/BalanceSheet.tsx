import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Building2, Banknote, CreditCard } from "lucide-react";

interface BalanceSheetProps {
  financialData: {
    totalIncome: number;
    totalExpenses: number;
    rentalIncome: number;
    wholesaleProfits: number;
    flipSaleProceeds: number;
  };
}

export function BalanceSheet({ financialData }: BalanceSheetProps) {
  // Calculate balance sheet items based on dashboard data
  const currentAssets = {
    checkingAccount: 45000,
    pettyCash: 2500,
    depositsReceivable: 8000,
    rentEscrow: financialData.rentalIncome * 0.1, // 10% of rental income
  };

  const fixedAssets = {
    buildings: 850000,
    closingCosts: 25000,
    holdingCosts: 18000,
    purchaseCosts: 650000,
    rehabCapEx: 120000,
    longTermInvestments: 75000,
  };

  const currentLiabilities = {
    creditCards: 12000,
    mortgagesBonds: 450000,
    loanFromOthers: 95000,
    payrollLiabilities: 8500,
  };

  const longTermLiabilities = {
    propertyLoans: 520000,
  };

  const equity = {
    appraisalValueReserve: 150000,
    openingBalanceEquity: 200000,
    retainedEarnings: financialData.totalIncome - financialData.totalExpenses,
    shareholdersEquity: 100000,
    netIncome: financialData.totalIncome - financialData.totalExpenses,
  };

  const totalCurrentAssets = Object.values(currentAssets).reduce((sum, val) => sum + val, 0);
  const totalFixedAssets = Object.values(fixedAssets).reduce((sum, val) => sum + val, 0);
  const totalAssets = totalCurrentAssets + totalFixedAssets;

  const totalCurrentLiabilities = Object.values(currentLiabilities).reduce((sum, val) => sum + val, 0);
  const totalLongTermLiabilities = Object.values(longTermLiabilities).reduce((sum, val) => sum + val, 0);
  const totalLiabilities = totalCurrentLiabilities + totalLongTermLiabilities;

  const totalEquity = Object.values(equity).reduce((sum, val) => sum + val, 0);

  const downloadBalanceSheet = () => {
    const data = `R&R Grandeur Properties LLC - Balance Sheet
As of ${new Date().toLocaleDateString()}

ASSETS
Current Assets:
- Bank Accounts: $${currentAssets.checkingAccount.toLocaleString()}
- Petty Cash: $${currentAssets.pettyCash.toLocaleString()}
- Deposits Receivable: $${currentAssets.depositsReceivable.toLocaleString()}
- Rent Escrow: $${currentAssets.rentEscrow.toLocaleString()}
Total Current Assets: $${totalCurrentAssets.toLocaleString()}

Fixed Assets:
- Buildings: $${fixedAssets.buildings.toLocaleString()}
- Closing Costs: $${fixedAssets.closingCosts.toLocaleString()}
- Holding Costs: $${fixedAssets.holdingCosts.toLocaleString()}
- Purchase Costs: $${fixedAssets.purchaseCosts.toLocaleString()}
- Rehab/CapEx: $${fixedAssets.rehabCapEx.toLocaleString()}
- Long-term Investments: $${fixedAssets.longTermInvestments.toLocaleString()}
Total Fixed Assets: $${totalFixedAssets.toLocaleString()}

TOTAL ASSETS: $${totalAssets.toLocaleString()}

LIABILITIES AND EQUITY
Current Liabilities:
- Credit Cards: $${currentLiabilities.creditCards.toLocaleString()}
- Mortgages/Bonds: $${currentLiabilities.mortgagesBonds.toLocaleString()}
- Loan from Others: $${currentLiabilities.loanFromOthers.toLocaleString()}
- Payroll Liabilities: $${currentLiabilities.payrollLiabilities.toLocaleString()}
Total Current Liabilities: $${totalCurrentLiabilities.toLocaleString()}

Long-Term Liabilities:
- Property Loans: $${longTermLiabilities.propertyLoans.toLocaleString()}
Total Long-Term Liabilities: $${totalLongTermLiabilities.toLocaleString()}

Total Liabilities: $${totalLiabilities.toLocaleString()}

Equity:
- Appraisal Value Reserve: $${equity.appraisalValueReserve.toLocaleString()}
- Opening Balance Equity: $${equity.openingBalanceEquity.toLocaleString()}
- Retained Earnings: $${equity.retainedEarnings.toLocaleString()}
- Shareholders' Equity: $${equity.shareholdersEquity.toLocaleString()}
- Net Income: $${equity.netIncome.toLocaleString()}
Total Equity: $${totalEquity.toLocaleString()}

TOTAL LIABILITIES AND EQUITY: $${(totalLiabilities + totalEquity).toLocaleString()}`;

    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'balance-sheet.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Balance Sheet</h2>
          <p className="text-muted-foreground">As of {new Date().toLocaleDateString()}</p>
        </div>
        <Button onClick={downloadBalanceSheet} className="flex items-center gap-2 bg-accent hover:bg-accent/15 text-accent-foreground">
          <Download className="h-4 w-4" />
          Download
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assets */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-accent">
              <Building2 className="h-5 w-5" />
              Assets
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-foreground mb-3">Current Assets</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bank Accounts</span>
                  <span className="font-medium text-foreground">${currentAssets.checkingAccount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Petty Cash</span>
                  <span className="font-medium text-foreground">${currentAssets.pettyCash.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Deposits Receivable</span>
                  <span className="font-medium text-foreground">${currentAssets.depositsReceivable.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rent Escrow</span>
                  <span className="font-medium text-foreground">${currentAssets.rentEscrow.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2 font-semibold">
                  <span className="text-foreground">Total Current Assets</span>
                  <span className="text-accent">${totalCurrentAssets.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-3">Fixed Assets</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Buildings</span>
                  <span className="font-medium text-foreground">${fixedAssets.buildings.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Closing Costs</span>
                  <span className="font-medium text-foreground">${fixedAssets.closingCosts.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Holding Costs</span>
                  <span className="font-medium text-foreground">${fixedAssets.holdingCosts.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Purchase Costs</span>
                  <span className="font-medium text-foreground">${fixedAssets.purchaseCosts.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rehab/CapEx</span>
                  <span className="font-medium text-foreground">${fixedAssets.rehabCapEx.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Long-term Investments</span>
                  <span className="font-medium text-foreground">${fixedAssets.longTermInvestments.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2 font-semibold">
                  <span className="text-foreground">Total Fixed Assets</span>
                  <span className="text-accent">${totalFixedAssets.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-accent/15 p-3 rounded-lg border border-accent/40">
              <div className="flex justify-between text-lg font-bold">
                <span className="text-foreground">TOTAL ASSETS</span>
                <span className="text-accent">${totalAssets.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liabilities & Equity */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-muted-foreground">
              <CreditCard className="h-5 w-5" />
              Liabilities & Equity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-foreground mb-3">Current Liabilities</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Credit Cards</span>
                  <span className="font-medium text-destructive">${currentLiabilities.creditCards.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mortgages/Bonds</span>
                  <span className="font-medium text-destructive">${currentLiabilities.mortgagesBonds.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Loan from Others</span>
                  <span className="font-medium text-destructive">${currentLiabilities.loanFromOthers.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payroll Liabilities</span>
                  <span className="font-medium text-destructive">${currentLiabilities.payrollLiabilities.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2 font-semibold">
                  <span className="text-foreground">Total Current Liabilities</span>
                  <span className="text-destructive">${totalCurrentLiabilities.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-3">Long-Term Liabilities</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Property Loans</span>
                  <span className="font-medium text-destructive">${longTermLiabilities.propertyLoans.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2 font-semibold">
                  <span className="text-foreground">Total Long-Term Liabilities</span>
                  <span className="text-destructive">${totalLongTermLiabilities.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-3">Equity</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Appraisal Value Reserve</span>
                  <span className="font-medium text-success">${equity.appraisalValueReserve.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Opening Balance Equity</span>
                  <span className="font-medium text-success">${equity.openingBalanceEquity.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Retained Earnings</span>
                  <span className="font-medium text-success">${equity.retainedEarnings.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shareholders' Equity</span>
                  <span className="font-medium text-success">${equity.shareholdersEquity.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Net Income</span>
                  <span className="font-medium text-success">${equity.netIncome.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2 font-semibold">
                  <span className="text-foreground">Total Equity</span>
                  <span className="text-success">${totalEquity.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-secondary p-3 rounded-lg border border-border">
              <div className="flex justify-between text-lg font-bold">
                <span className="text-foreground">TOTAL LIABILITIES & EQUITY</span>
                <span className="text-muted-foreground">${(totalLiabilities + totalEquity).toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}