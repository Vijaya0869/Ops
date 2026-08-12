import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, DollarSign, TrendingUp, TrendingDown } from "lucide-react";

export interface DrilldownItem {
  name: string;
  amount: number;
  percentage?: number;
  children?: DrilldownItem[];
}

interface FinancialDrilldownProps {
  income: DrilldownItem;
  expenses: DrilldownItem;
  className?: string;
}

export function FinancialDrilldown({ income: incomeData, expenses: expenseData, className }: FinancialDrilldownProps) {
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