import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts";

interface CashFlowForecastProps {
  existingFinancials?: {
    totalIncome: number;
    totalExpenses: number;
    rentalIncome: number;
    wholesaleProfits: number;
    flipSaleProceeds: number;
  };
}

export function CashFlowForecast({ existingFinancials }: CashFlowForecastProps) {
  // Use existing data to create realistic 6-month projections
  const baseRental = existingFinancials?.rentalIncome || 18000;
  const baseWholesale = existingFinancials?.wholesaleProfits || 12000;
  const baseFlip = existingFinancials?.flipSaleProceeds || 85000;
  const baseExpenses = existingFinancials?.totalExpenses || 98000;

  // 6-month forecast based on existing financials
  const forecastData = [
    {
      month: "M1",
      rentalIncome: Math.round(baseRental * 2.5), // Monthly projection
      wholesaleProfits: baseWholesale,
      flipSaleProceeds: baseFlip,
      capitalRaise: 150000,
      otherIncome: 3000,
      debtService: Math.round(baseExpenses * 0.25),
      operatingExpenses: Math.round(baseExpenses * 0.18),
      renovationCapex: 65000,
      payrollAdmin: 12000,
      franchiseRoyalties: 4500,
      investorDistributions: 8000,
      otherExpenses: 5000
    },
    {
      month: "M2",
      rentalIncome: Math.round(baseRental * 2.6),
      wholesaleProfits: Math.round(baseWholesale * 0.7),
      flipSaleProceeds: 0,
      capitalRaise: 0,
      otherIncome: 2500,
      debtService: Math.round(baseExpenses * 0.25),
      operatingExpenses: Math.round(baseExpenses * 0.19),
      renovationCapex: 45000,
      payrollAdmin: 12000,
      franchiseRoyalties: 4500,
      investorDistributions: 8000,
      otherExpenses: 3000
    },
    {
      month: "M3",
      rentalIncome: Math.round(baseRental * 2.6),
      wholesaleProfits: Math.round(baseWholesale * 1.25),
      flipSaleProceeds: baseFlip,
      capitalRaise: 150000,
      otherIncome: 2500,
      debtService: Math.round(baseExpenses * 0.25),
      operatingExpenses: Math.round(baseExpenses * 0.19),
      renovationCapex: 70000,
      payrollAdmin: 12000,
      franchiseRoyalties: 4500,
      investorDistributions: 8000,
      otherExpenses: 4000
    },
    {
      month: "M4",
      rentalIncome: Math.round(baseRental * 2.7),
      wholesaleProfits: Math.round(baseWholesale * 0.8),
      flipSaleProceeds: 0,
      capitalRaise: 0,
      otherIncome: 3000,
      debtService: Math.round(baseExpenses * 0.25),
      operatingExpenses: Math.round(baseExpenses * 0.20),
      renovationCapex: 55000,
      payrollAdmin: 12000,
      franchiseRoyalties: 4500,
      investorDistributions: 8000,
      otherExpenses: 3500
    },
    {
      month: "M5",
      rentalIncome: Math.round(baseRental * 2.7),
      wholesaleProfits: Math.round(baseWholesale * 1.5),
      flipSaleProceeds: Math.round(baseFlip * 1.06),
      capitalRaise: 0,
      otherIncome: 3500,
      debtService: Math.round(baseExpenses * 0.25),
      operatingExpenses: Math.round(baseExpenses * 0.20),
      renovationCapex: 60000,
      payrollAdmin: 12000,
      franchiseRoyalties: 4500,
      investorDistributions: 8000,
      otherExpenses: 4500
    },
    {
      month: "M6",
      rentalIncome: Math.round(baseRental * 2.8),
      wholesaleProfits: baseWholesale,
      flipSaleProceeds: Math.round(baseFlip * 1.12),
      capitalRaise: 200000,
      otherIncome: 4000,
      debtService: Math.round(baseExpenses * 0.25),
      operatingExpenses: Math.round(baseExpenses * 0.21),
      renovationCapex: 75000,
      payrollAdmin: 12000,
      franchiseRoyalties: 4500,
      investorDistributions: 8000,
      otherExpenses: 5000
    }
  ];

  // Calculate cumulative data
  const processedData = forecastData.map((month, index) => {
    const totalIncome = month.rentalIncome + month.wholesaleProfits + month.flipSaleProceeds + month.capitalRaise + month.otherIncome;
    const totalExpenses = month.debtService + month.operatingExpenses + month.renovationCapex + month.payrollAdmin + month.franchiseRoyalties + month.investorDistributions + month.otherExpenses;
    const netCashFlow = totalIncome - totalExpenses;
    
    const startingCash = 125000;
    const cumulativeCashPosition = index === 0 
      ? startingCash + netCashFlow
      : forecastData.slice(0, index + 1).reduce((sum, m, i) => {
          const income = m.rentalIncome + m.wholesaleProfits + m.flipSaleProceeds + m.capitalRaise + m.otherIncome;
          const expenses = m.debtService + m.operatingExpenses + m.renovationCapex + m.payrollAdmin + m.franchiseRoyalties + m.investorDistributions + m.otherExpenses;
          return i === 0 ? startingCash + (income - expenses) : sum + (income - expenses);
        }, 0);

    const fixedMonthlyCosts = month.debtService + month.operatingExpenses + month.payrollAdmin + month.franchiseRoyalties;
    const liquidityBuffer = cumulativeCashPosition / fixedMonthlyCosts;
    
    const getDecisionFlag = (buffer: number) => {
      if (buffer < 3) return "Critical";
      if (buffer < 5) return "Review";
      return "OK";
    };

    return {
      ...month,
      totalIncome,
      totalExpenses,
      netCashFlow,
      cumulativeCashPosition,
      liquidityBuffer,
      decisionFlag: getDecisionFlag(liquidityBuffer)
    };
  });

  const chartConfig = {
    totalIncome: {
      label: "Total Income",
      color: "#3B82F6",
    },
    totalExpenses: {
      label: "Total Expenses",
      color: "#F43F5E",
    },
    netCashFlow: {
      label: "Net Cash Flow",
      color: "#818CF8",
    },
    cumulativeCashPosition: {
      label: "Cash Position",
      color: "#3B82F6",
    },
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getDecisionBadgeVariant = (flag: string) => {
    switch (flag) {
      case "Critical": return "destructive" as const;
      case "Review": return "secondary" as const;
      default: return "default" as const;
    }
  };

  return (
    <div className="space-y-6">
      {/* Cash Flow Chart */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="text-foreground">6-Month Cash Flow Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={processedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
                <XAxis dataKey="month" stroke="#E2E8F0" tick={{ fill: '#E2E8F0' }} />
                <YAxis tickFormatter={(value) => formatCurrency(value)} stroke="#E2E8F0" tick={{ fill: '#E2E8F0' }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="totalIncome" fill="#3B82F6" name="Total Income" radius={[4, 4, 0, 0]} />
                <Bar dataKey="totalExpenses" fill="#F43F5E" name="Total Expenses" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Cumulative Cash Position */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="text-foreground">Cumulative Cash Position</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={processedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
                <XAxis dataKey="month" stroke="#E2E8F0" tick={{ fill: '#E2E8F0' }} />
                <YAxis tickFormatter={(value) => formatCurrency(value)} stroke="#E2E8F0" tick={{ fill: '#E2E8F0' }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="cumulativeCashPosition" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  name="Cash Position"
                  dot={{ fill: '#3B82F6', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: '#93C5FD' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Monthly Summary Table */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="text-foreground">Monthly Summary & Liquidity Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-2 text-muted-foreground">Month</th>
                  <th className="text-right p-2 text-muted-foreground">Total Income</th>
                  <th className="text-right p-2 text-muted-foreground">Total Expenses</th>
                  <th className="text-right p-2 text-muted-foreground">Net Cash Flow</th>
                  <th className="text-right p-2 text-muted-foreground">Cash Position</th>
                  <th className="text-center p-2 text-muted-foreground">Liquidity Buffer</th>
                  <th className="text-center p-2 text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {processedData.map((month) => (
                  <tr key={month.month} className="border-b border-border">
                    <td className="p-2 font-medium text-foreground">{month.month}</td>
                    <td className="text-right p-2 text-accent font-medium">
                      {formatCurrency(month.totalIncome)}
                    </td>
                    <td className="text-right p-2 text-destructive font-medium">
                      {formatCurrency(month.totalExpenses)}
                    </td>
                    <td className={`text-right p-2 font-medium ${month.netCashFlow >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {formatCurrency(month.netCashFlow)}
                    </td>
                    <td className="text-right p-2 font-medium text-foreground">
                      {formatCurrency(month.cumulativeCashPosition)}
                    </td>
                    <td className="text-center p-2 text-muted-foreground">
                      {month.liquidityBuffer.toFixed(1)} months
                    </td>
                    <td className="text-center p-2">
                      <Badge variant={getDecisionBadgeVariant(month.decisionFlag)}>
                        {month.decisionFlag}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="text-foreground">Key Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-accent">Average Monthly Income</h4>
              <div className="text-2xl font-bold text-foreground">
                {formatCurrency(processedData.reduce((sum, m) => sum + m.totalIncome, 0) / processedData.length)}
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-destructive">Average Monthly Expenses</h4>
              <div className="text-2xl font-bold text-foreground">
                {formatCurrency(processedData.reduce((sum, m) => sum + m.totalExpenses, 0) / processedData.length)}
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-muted-foreground">Lowest Cash Position</h4>
              <div className="text-2xl font-bold text-foreground">
                {formatCurrency(Math.min(...processedData.map(m => m.cumulativeCashPosition)))}
              </div>
              <div className="text-sm text-muted-foreground">
                Occurs in {processedData.find(m => m.cumulativeCashPosition === Math.min(...processedData.map(p => p.cumulativeCashPosition)))?.month}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}