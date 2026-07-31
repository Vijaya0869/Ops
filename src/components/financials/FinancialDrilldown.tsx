import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, DollarSign, TrendingUp, TrendingDown } from "lucide-react";

interface DrilldownItem {
  name: string;
  amount: number;
  percentage?: number;
  children?: DrilldownItem[];
}

interface FinancialDrilldownProps {
  className?: string;
}

export function FinancialDrilldown({ className }: FinancialDrilldownProps) {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(["income", "expenses"]));

  const toggleSection = (sectionId: string) => {
    const newOpenSections = new Set(openSections);
    if (newOpenSections.has(sectionId)) {
      newOpenSections.delete(sectionId);
    } else {
      newOpenSections.add(sectionId);
    }
    setOpenSections(newOpenSections);
  };

  // Mock data - replace with real data
  const incomeData: DrilldownItem = {
    name: "Total Income",
    amount: 125000,
    children: [
      {
        name: "Sales Income",
        amount: 65000,
        children: [
          { name: "Property Sale Proceeds", amount: 45000 },
          { name: "Assignment Fees (Wholesales)", amount: 20000 }
        ]
      },
      {
        name: "Flip Income",
        amount: 25000,
        children: [
          { name: "Flip Proceeds", amount: 25000 }
        ]
      },
      {
        name: "Wholesale Income",
        amount: 15000,
        children: [
          { name: "Wholesale Fees", amount: 15000 }
        ]
      },
      {
        name: "Rental Income",
        amount: 18000,
        children: [
          { name: "Monthly Rent Collected", amount: 15000 },
          { name: "Late Fees / Misc Rent Income", amount: 1500 },
          { name: "Tenant Fees", amount: 1000 },
          { name: "Property Management Income", amount: 500 }
        ]
      },
      {
        name: "Other Income",
        amount: 2000,
        children: [
          { name: "Consulting", amount: 1200 },
          { name: "JV Splits", amount: 500 },
          { name: "Miscellaneous", amount: 300 }
        ]
      }
    ]
  };

  const expenseData: DrilldownItem = {
    name: "Total Expenses",
    amount: 87500,
    children: [
      {
        name: "Acquisition Costs",
        amount: 15000,
        children: [
          { name: "Lender Fees", amount: 5000 },
          { name: "Wholesale Fees", amount: 3000 },
          { name: "Closing Costs", amount: 4500 },
          { name: "Title Costs", amount: 2500 }
        ]
      },
      {
        name: "Holding Costs",
        amount: 12000,
        children: [
          { name: "Debt Service", amount: 6000 },
          { name: "Insurance", amount: 2000 },
          { name: "Property Taxes", amount: 2500 },
          { name: "Utilities", amount: 1200 },
          { name: "Miscellaneous", amount: 300 }
        ]
      },
      {
        name: "Rehab / Construction Costs",
        amount: 25000,
        children: [
          { name: "Materials", amount: 15000 },
          { name: "Labor / Subcontractor Payments", amount: 8000 },
          { name: "Permits & Inspections", amount: 1500 },
          { name: "Contingency", amount: 500 }
        ]
      },
      {
        name: "Selling Costs",
        amount: 8000,
        children: [
          { name: "Staging Costs", amount: 2000 },
          { name: "Agent Commissions", amount: 4000 },
          { name: "Buyer Incentives", amount: 1500 },
          { name: "Marketing & Advertising", amount: 500 }
        ]
      },
      {
        name: "Refinancing Costs",
        amount: 4000,
        children: [
          { name: "Appraisal Fees", amount: 500 },
          { name: "Lender Points & Origination", amount: 2000 },
          { name: "Lender Fees", amount: 800 },
          { name: "Closing Costs", amount: 500 },
          { name: "Title Costs", amount: 200 }
        ]
      },
      {
        name: "Franchise Costs",
        amount: 3000,
        children: [
          { name: "Franchise Fees / Royalties", amount: 2000 },
          { name: "Marketing Fund Contributions", amount: 700 },
          { name: "Technology / Back-Office Fees", amount: 300 }
        ]
      },
      {
        name: "Rental-Related Costs",
        amount: 9500,
        children: [
          { name: "Property Management Fees", amount: 2000 },
          { name: "Maintenance & Repairs", amount: 3000 },
          { name: "Tenant Turnover", amount: 1500 },
          { name: "Vacancy Costs", amount: 1200 },
          { name: "Leasing Costs", amount: 1000 },
          { name: "HOA Fees", amount: 500 },
          { name: "Misc Rental Expenses", amount: 300 }
        ]
      },
      {
        name: "Operations / Admin",
        amount: 11000,
        children: [
          { name: "Payroll / Contractors", amount: 6000 },
          { name: "Office / Software / Tools", amount: 2500 },
          { name: "Travel & Vehicle", amount: 1500 },
          { name: "Miscellaneous G&A", amount: 1000 }
        ]
      }
    ]
  };

  const renderDrilldownItem = (item: DrilldownItem, level: number = 0, parentKey: string = "") => {
    const key = `${parentKey}-${item.name.replace(/\s+/g, '-').toLowerCase()}`;
    const isOpen = openSections.has(key);
    const hasChildren = item.children && item.children.length > 0;
    
    const indentClass = level === 0 ? "" : level === 1 ? "ml-4" : "ml-8";
    const textSize = level === 0 ? "text-lg font-bold" : level === 1 ? "text-base font-semibold" : "text-sm";
    
    return (
      <div key={key} className={indentClass}>
        {hasChildren ? (
          <Collapsible open={isOpen} onOpenChange={() => toggleSection(key)}>
            <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-left hover:bg-accent/50 rounded px-2">
              <div className="flex items-center gap-2">
                {isOpen ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
                <span className={textSize}>{item.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`${textSize} ${level === 0 ? 'text-primary' : 'text-foreground'}`}>
                  ${item.amount.toLocaleString()}
                </span>
                {item.percentage && (
                  <span className={`text-xs ${item.percentage > 0 ? 'text-success' : 'text-destructive'}`}>
                    {item.percentage > 0 ? '+' : ''}{item.percentage}%
                  </span>
                )}
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1">
              {item.children?.map((child) => renderDrilldownItem(child, level + 1, key))}
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <div className="flex items-center justify-between py-2 px-2 hover:bg-accent/30 rounded">
            <div className="flex items-center gap-6">
              <div className="w-4" /> {/* Spacer for alignment */}
              <span className={textSize}>{item.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={textSize}>
                ${item.amount.toLocaleString()}
              </span>
              {item.percentage && (
                <span className={`text-xs ${item.percentage > 0 ? 'text-success' : 'text-destructive'}`}>
                  {item.percentage > 0 ? '+' : ''}{item.percentage}%
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const netIncome = incomeData.amount - expenseData.amount;

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Financial Drilldown
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Detailed breakdown of income and expenses at project and portfolio level
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Net Income Summary */}
          <div className="bg-accent/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {netIncome > 0 ? (
                  <TrendingUp className="h-5 w-5 text-success" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-destructive" />
                )}
                <span className="text-lg font-bold">Net Income</span>
              </div>
              <span className={`text-xl font-bold ${netIncome > 0 ? 'text-success' : 'text-destructive'}`}>
                ${netIncome.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Income Drilldown */}
          <div>
            {renderDrilldownItem(incomeData, 0, "income")}
          </div>

          {/* Separator */}
          <hr className="border-border" />

          {/* Expenses Drilldown */}
          <div>
            {renderDrilldownItem(expenseData, 0, "expenses")}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}