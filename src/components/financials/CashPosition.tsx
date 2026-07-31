import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface CashPositionProps {
  existingFinancials?: {
    totalIncome: number;
    totalExpenses: number;
    rentalIncome: number;
    wholesaleProfits: number;
    flipSaleProceeds: number;
  };
}

export function CashPosition({ existingFinancials }: CashPositionProps) {
  // Use existing data or fallback to defaults
  const baseRentalIncome = existingFinancials?.rentalIncome || 18000;
  const baseWholesale = existingFinancials?.wholesaleProfits || 12000;
  const baseFlipProceeds = existingFinancials?.flipSaleProceeds || 85000;
  
  // Calculate reasonable projections based on existing data
  const initialCashData = {
    inflows: {
      rentalIncome: { 
        current: baseRentalIncome * 2.5, // Monthly estimate from annual 
        next: baseRentalIncome * 2.6, 
        quarter: baseRentalIncome * 7.5 
      },
      wholesaleProfits: { 
        current: baseWholesale, 
        next: baseWholesale * 0.7, 
        quarter: baseWholesale * 2.9 
      },
      flipSaleProceeds: { 
        current: baseFlipProceeds, 
        next: 0, 
        quarter: baseFlipProceeds * 2 
      },
      capitalRaise: { current: 150000, next: 0, quarter: 300000 },
      otherIncome: { current: 3000, next: 2500, quarter: 8000 }
    },
    outflows: {
      debtService: { 
        current: Math.round(existingFinancials?.totalExpenses * 0.25) || 25000, 
        next: Math.round(existingFinancials?.totalExpenses * 0.25) || 25000, 
        quarter: Math.round(existingFinancials?.totalExpenses * 0.75) || 75000 
      },
      operatingExpenses: { 
        current: Math.round(existingFinancials?.totalExpenses * 0.18) || 18000, 
        next: Math.round(existingFinancials?.totalExpenses * 0.19) || 19000, 
        quarter: Math.round(existingFinancials?.totalExpenses * 0.56) || 55000 
      },
      renovationCapex: { current: 65000, next: 45000, quarter: 180000 },
      payrollAdmin: { current: 12000, next: 12000, quarter: 36000 },
      franchiseRoyalties: { current: 4500, next: 4500, quarter: 13500 },
      investorDistributions: { current: 8000, next: 8000, quarter: 24000 },
      otherExpenses: { current: 5000, next: 3000, quarter: 12000 }
    },
    cashPosition: {
      startingBalance: 125000
    }
  };

  const [cashData, setCashData] = useState(initialCashData);

  const calculateTotals = () => {
    const totalInflowsCurrent = Object.values(cashData.inflows).reduce((sum, item) => sum + item.current, 0);
    const totalInflowsNext = Object.values(cashData.inflows).reduce((sum, item) => sum + item.next, 0);
    const totalInflowsQuarter = Object.values(cashData.inflows).reduce((sum, item) => sum + item.quarter, 0);

    const totalOutflowsCurrent = Object.values(cashData.outflows).reduce((sum, item) => sum + item.current, 0);
    const totalOutflowsNext = Object.values(cashData.outflows).reduce((sum, item) => sum + item.next, 0);
    const totalOutflowsQuarter = Object.values(cashData.outflows).reduce((sum, item) => sum + item.quarter, 0);

    const netCashFlowCurrent = totalInflowsCurrent - totalOutflowsCurrent;
    const netCashFlowNext = totalInflowsNext - totalOutflowsNext;
    const netCashFlowQuarter = totalInflowsQuarter - totalOutflowsQuarter;

    const endingBalanceCurrent = cashData.cashPosition.startingBalance + netCashFlowCurrent;
    const endingBalanceNext = endingBalanceCurrent + netCashFlowNext;
    const endingBalanceQuarter = cashData.cashPosition.startingBalance + netCashFlowQuarter;

    const fixedMonthlyCosts = 25000 + 18000 + 12000 + 4500; // Debt + Operating + Payroll + Franchise
    const liquidityBuffer = endingBalanceCurrent / fixedMonthlyCosts;

    return {
      totalInflowsCurrent,
      totalInflowsNext,
      totalInflowsQuarter,
      totalOutflowsCurrent,
      totalOutflowsNext,
      totalOutflowsQuarter,
      netCashFlowCurrent,
      netCashFlowNext,
      netCashFlowQuarter,
      endingBalanceCurrent,
      endingBalanceNext,
      endingBalanceQuarter,
      liquidityBuffer
    };
  };

  const totals = calculateTotals();

  const getDecisionFlag = (buffer: number) => {
    if (buffer < 3) return { label: "Critical", variant: "destructive" as const };
    if (buffer < 5) return { label: "Review", variant: "secondary" as const };
    return { label: "OK", variant: "default" as const };
  };

  const decisionFlag = getDecisionFlag(totals.liquidityBuffer);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cash Inflows */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-accent">Cash Inflows</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-4 gap-2 text-sm font-medium text-muted-foreground">
              <div>Category</div>
              <div>Current Month</div>
              <div>Next Month</div>
              <div>Quarter</div>
            </div>
            
            <div className="space-y-3">
              <div className="grid grid-cols-4 gap-2 items-center">
                <Label className="text-sm text-muted-foreground">Rental Income</Label>
                <span className="text-sm font-medium text-accent">{formatCurrency(cashData.inflows.rentalIncome.current)}</span>
                <span className="text-sm font-medium text-foreground">{formatCurrency(cashData.inflows.rentalIncome.next)}</span>
                <span className="text-sm font-medium text-foreground">{formatCurrency(cashData.inflows.rentalIncome.quarter)}</span>
              </div>
              
              <div className="grid grid-cols-4 gap-2 items-center">
                <Label className="text-sm text-muted-foreground">Wholesale Profits</Label>
                <span className="text-sm font-medium text-accent">{formatCurrency(cashData.inflows.wholesaleProfits.current)}</span>
                <span className="text-sm font-medium text-foreground">{formatCurrency(cashData.inflows.wholesaleProfits.next)}</span>
                <span className="text-sm font-medium text-foreground">{formatCurrency(cashData.inflows.wholesaleProfits.quarter)}</span>
              </div>
              
              <div className="grid grid-cols-4 gap-2 items-center">
                <Label className="text-sm text-muted-foreground">Flip Sale Proceeds</Label>
                <span className="text-sm font-medium text-accent">{formatCurrency(cashData.inflows.flipSaleProceeds.current)}</span>
                <span className="text-sm font-medium text-foreground">{formatCurrency(cashData.inflows.flipSaleProceeds.next)}</span>
                <span className="text-sm font-medium text-foreground">{formatCurrency(cashData.inflows.flipSaleProceeds.quarter)}</span>
              </div>
              
              <div className="grid grid-cols-4 gap-2 items-center">
                <Label className="text-sm text-muted-foreground">Capital Raise</Label>
                <span className="text-sm font-medium text-accent">{formatCurrency(cashData.inflows.capitalRaise.current)}</span>
                <span className="text-sm font-medium text-foreground">{formatCurrency(cashData.inflows.capitalRaise.next)}</span>
                <span className="text-sm font-medium text-foreground">{formatCurrency(cashData.inflows.capitalRaise.quarter)}</span>
              </div>
              
              <div className="grid grid-cols-4 gap-2 items-center">
                <Label className="text-sm text-muted-foreground">Other Income</Label>
                <span className="text-sm font-medium text-accent">{formatCurrency(cashData.inflows.otherIncome.current)}</span>
                <span className="text-sm font-medium text-foreground">{formatCurrency(cashData.inflows.otherIncome.next)}</span>
                <span className="text-sm font-medium text-foreground">{formatCurrency(cashData.inflows.otherIncome.quarter)}</span>
              </div>
            </div>
            
            <div className="border-t border-border pt-3">
              <div className="grid grid-cols-4 gap-2 items-center font-semibold">
                <Label className="text-foreground">Total Inflows</Label>
                <span className="text-accent">{formatCurrency(totals.totalInflowsCurrent)}</span>
                <span className="text-accent">{formatCurrency(totals.totalInflowsNext)}</span>
                <span className="text-accent">{formatCurrency(totals.totalInflowsQuarter)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cash Outflows */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-destructive">Cash Outflows</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-4 gap-2 text-sm font-medium text-muted-foreground">
              <div>Category</div>
              <div>Current Month</div>
              <div>Next Month</div>
              <div>Quarter</div>
            </div>
            
            <div className="space-y-3">
              <div className="grid grid-cols-4 gap-2 items-center">
                <Label className="text-sm text-muted-foreground">Debt Service</Label>
                <span className="text-sm font-medium text-destructive">{formatCurrency(cashData.outflows.debtService.current)}</span>
                <span className="text-sm font-medium text-foreground">{formatCurrency(cashData.outflows.debtService.next)}</span>
                <span className="text-sm font-medium text-foreground">{formatCurrency(cashData.outflows.debtService.quarter)}</span>
              </div>
              
              <div className="grid grid-cols-4 gap-2 items-center">
                <Label className="text-sm text-muted-foreground">Operating Expenses</Label>
                <span className="text-sm font-medium text-destructive">{formatCurrency(cashData.outflows.operatingExpenses.current)}</span>
                <span className="text-sm font-medium text-foreground">{formatCurrency(cashData.outflows.operatingExpenses.next)}</span>
                <span className="text-sm font-medium text-foreground">{formatCurrency(cashData.outflows.operatingExpenses.quarter)}</span>
              </div>
              
              <div className="grid grid-cols-4 gap-2 items-center">
                <Label className="text-sm text-muted-foreground">Renovation/CapEx</Label>
                <span className="text-sm font-medium text-destructive">{formatCurrency(cashData.outflows.renovationCapex.current)}</span>
                <span className="text-sm font-medium text-foreground">{formatCurrency(cashData.outflows.renovationCapex.next)}</span>
                <span className="text-sm font-medium text-foreground">{formatCurrency(cashData.outflows.renovationCapex.quarter)}</span>
              </div>
              
              <div className="grid grid-cols-4 gap-2 items-center">
                <Label className="text-sm text-muted-foreground">Payroll/Admin</Label>
                <span className="text-sm font-medium text-destructive">{formatCurrency(cashData.outflows.payrollAdmin.current)}</span>
                <span className="text-sm font-medium text-foreground">{formatCurrency(cashData.outflows.payrollAdmin.next)}</span>
                <span className="text-sm font-medium text-foreground">{formatCurrency(cashData.outflows.payrollAdmin.quarter)}</span>
              </div>
              
              <div className="grid grid-cols-4 gap-2 items-center">
                <Label className="text-sm text-muted-foreground">Franchise/Royalties</Label>
                <span className="text-sm font-medium text-destructive">{formatCurrency(cashData.outflows.franchiseRoyalties.current)}</span>
                <span className="text-sm font-medium text-foreground">{formatCurrency(cashData.outflows.franchiseRoyalties.next)}</span>
                <span className="text-sm font-medium text-foreground">{formatCurrency(cashData.outflows.franchiseRoyalties.quarter)}</span>
              </div>
              
              <div className="grid grid-cols-4 gap-2 items-center">
                <Label className="text-sm text-muted-foreground">Investor Distributions</Label>
                <span className="text-sm font-medium text-destructive">{formatCurrency(cashData.outflows.investorDistributions.current)}</span>
                <span className="text-sm font-medium text-foreground">{formatCurrency(cashData.outflows.investorDistributions.next)}</span>
                <span className="text-sm font-medium text-foreground">{formatCurrency(cashData.outflows.investorDistributions.quarter)}</span>
              </div>
              
              <div className="grid grid-cols-4 gap-2 items-center">
                <Label className="text-sm text-muted-foreground">Other Expenses</Label>
                <span className="text-sm font-medium text-destructive">{formatCurrency(cashData.outflows.otherExpenses.current)}</span>
                <span className="text-sm font-medium text-foreground">{formatCurrency(cashData.outflows.otherExpenses.next)}</span>
                <span className="text-sm font-medium text-foreground">{formatCurrency(cashData.outflows.otherExpenses.quarter)}</span>
              </div>
            </div>
            
            <div className="border-t border-border pt-3">
              <div className="grid grid-cols-4 gap-2 items-center font-semibold">
                <Label className="text-foreground">Total Outflows</Label>
                <span className="text-destructive">{formatCurrency(totals.totalOutflowsCurrent)}</span>
                <span className="text-destructive">{formatCurrency(totals.totalOutflowsNext)}</span>
                <span className="text-destructive">{formatCurrency(totals.totalOutflowsQuarter)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Metrics */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">Cash Position Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Net Cash Flow (Current)</Label>
              <div className={`text-2xl font-bold ${totals.netCashFlowCurrent >= 0 ? 'text-success' : 'text-destructive'}`}>
                {formatCurrency(totals.netCashFlowCurrent)}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Ending Cash Position</Label>
              <div className="text-2xl font-bold text-accent">
                {formatCurrency(totals.endingBalanceCurrent)}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Liquidity Buffer</Label>
              <div className="text-2xl font-bold text-foreground">
                {totals.liquidityBuffer.toFixed(1)} months
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Decision Flag</Label>
              <Badge variant={decisionFlag.variant} className="text-sm font-semibold">
                {decisionFlag.label}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}