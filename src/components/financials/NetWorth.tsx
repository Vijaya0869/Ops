import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, Building, Wallet } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface NetWorthProps {
  financialData: {
    totalIncome: number;
    totalExpenses: number;
    rentalIncome: number;
    wholesaleProfits: number;
    flipSaleProceeds: number;
  };
}

export function NetWorth({ financialData }: NetWorthProps) {
  // Assets calculation based on dashboard data
  const assets = {
    realEstate: 850000, // Property values
    cashAndBankAccounts: 47500,
    investments: 75000,
    vehiclesAndEquipment: 45000,
    accountsReceivable: financialData.rentalIncome * 0.1, // 10% of rental income
    inventory: 25000, // Properties under rehab
    otherAssets: 15000,
  };

  // Liabilities calculation
  const liabilities = {
    mortgages: 520000,
    creditCards: 12000,
    linesOfCredit: 95000,
    hardMoneyLoans: 185000,
    accountsPayable: 8500,
    otherDebts: 25000,
  };

  const totalAssets = Object.values(assets).reduce((sum, val) => sum + val, 0);
  const totalLiabilities = Object.values(liabilities).reduce((sum, val) => sum + val, 0);
  const netWorth = totalAssets - totalLiabilities;

  // Data for pie charts with gold/purple theme
  const assetData = [
    { name: "Real Estate", value: assets.realEstate, fill: "#3B82F6" },
    { name: "Cash & Banks", value: assets.cashAndBankAccounts, fill: "#10B981" },
    { name: "Investments", value: assets.investments, fill: "#f59e0b" },
    { name: "Vehicles & Equipment", value: assets.vehiclesAndEquipment, fill: "#818CF8" },
    { name: "Other Assets", value: assets.accountsReceivable + assets.inventory + assets.otherAssets, fill: "#6366F1" },
  ];

  const liabilityData = [
    { name: "Mortgages", value: liabilities.mortgages, fill: "#F43F5E" },
    { name: "Hard Money Loans", value: liabilities.hardMoneyLoans, fill: "#FB7185" },
    { name: "Lines of Credit", value: liabilities.linesOfCredit, fill: "#fb923c" },
    { name: "Other Debts", value: liabilities.creditCards + liabilities.accountsPayable + liabilities.otherDebts, fill: "#F59E0B" },
  ];

  const downloadNetWorth = () => {
    const data = `R&R Grandeur Properties LLC - Net Worth Statement
As of ${new Date().toLocaleDateString()}

ASSETS:
- Real Estate Properties: $${assets.realEstate.toLocaleString()}
- Cash & Bank Accounts: $${assets.cashAndBankAccounts.toLocaleString()}
- Investments: $${assets.investments.toLocaleString()}
- Vehicles & Equipment: $${assets.vehiclesAndEquipment.toLocaleString()}
- Accounts Receivable: $${assets.accountsReceivable.toLocaleString()}
- Inventory (Properties): $${assets.inventory.toLocaleString()}
- Other Assets: $${assets.otherAssets.toLocaleString()}
Total Assets: $${totalAssets.toLocaleString()}

LIABILITIES:
- Mortgages: $${liabilities.mortgages.toLocaleString()}
- Credit Cards: $${liabilities.creditCards.toLocaleString()}
- Lines of Credit: $${liabilities.linesOfCredit.toLocaleString()}
- Hard Money Loans: $${liabilities.hardMoneyLoans.toLocaleString()}
- Accounts Payable: $${liabilities.accountsPayable.toLocaleString()}
- Other Debts: $${liabilities.otherDebts.toLocaleString()}
Total Liabilities: $${totalLiabilities.toLocaleString()}

NET WORTH: $${netWorth.toLocaleString()}

Asset-to-Liability Ratio: ${(totalAssets / totalLiabilities).toFixed(2)}:1
Debt-to-Asset Ratio: ${((totalLiabilities / totalAssets) * 100).toFixed(1)}%`;

    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'net-worth-statement.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Net Worth Statement</h2>
          <p className="text-muted-foreground">As of {new Date().toLocaleDateString()}</p>
        </div>
        <Button onClick={downloadNetWorth} className="flex items-center gap-2 bg-accent hover:bg-accent/15 text-accent-foreground">
          <Download className="h-4 w-4" />
          Download
        </Button>
      </div>

      {/* Net Worth Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card variant="glass">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Assets
            </CardTitle>
            <Building className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              ${totalAssets.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Liabilities
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              ${totalLiabilities.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Net Worth
            </CardTitle>
            <Wallet className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              ${netWorth.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Asset-to-Debt Ratio
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">
              {(totalAssets / totalLiabilities).toFixed(2)}:1
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assets and Liabilities Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assets Breakdown */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-accent">
              <Building className="h-5 w-5" />
              Assets Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Real Estate</span>
                  <span className="font-medium text-accent">${assets.realEstate.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Cash & Banks</span>
                  <span className="font-medium text-accent">${assets.cashAndBankAccounts.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Investments</span>
                  <span className="font-medium text-accent">${assets.investments.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Vehicles & Equipment</span>
                  <span className="font-medium text-accent">${assets.vehiclesAndEquipment.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Accounts Receivable</span>
                  <span className="font-medium text-accent">${assets.accountsReceivable.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Inventory</span>
                  <span className="font-medium text-accent">${assets.inventory.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Other Assets</span>
                  <span className="font-medium text-accent">${assets.otherAssets.toLocaleString()}</span>
                </div>
              </div>
              <ChartContainer
                config={{}}
                className="h-[200px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={assetData}
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      dataKey="value"
                    >
                      {assetData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip 
                      content={<ChartTooltipContent />}
                      formatter={(value, name) => [`$${value.toLocaleString()}`, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Liabilities Breakdown */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <TrendingUp className="h-5 w-5" />
              Liabilities Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Mortgages</span>
                  <span className="font-medium text-destructive">${liabilities.mortgages.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Credit Cards</span>
                  <span className="font-medium text-destructive">${liabilities.creditCards.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Lines of Credit</span>
                  <span className="font-medium text-destructive">${liabilities.linesOfCredit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Hard Money Loans</span>
                  <span className="font-medium text-destructive">${liabilities.hardMoneyLoans.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Accounts Payable</span>
                  <span className="font-medium text-destructive">${liabilities.accountsPayable.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Other Debts</span>
                  <span className="font-medium text-destructive">${liabilities.otherDebts.toLocaleString()}</span>
                </div>
              </div>
              <ChartContainer
                config={{}}
                className="h-[200px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={liabilityData}
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      dataKey="value"
                    >
                      {liabilityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip 
                      content={<ChartTooltipContent />}
                      formatter={(value, name) => [`$${value.toLocaleString()}`, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}