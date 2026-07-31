import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TimePeriod } from "@/components/ui/time-period-dropdown";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";

interface FinancialDetailsProps {
  timePeriod: TimePeriod;
}

export function FinancialDetails({ timePeriod }: FinancialDetailsProps) {
  const financialData = {
    totalIncome: 425000,
    totalExpenses: 285000,
    grossProfit: 140000,
    netProfit: 95000
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">Financial Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Income"
            value={`$${(financialData.totalIncome / 1000).toFixed(0)}K`}
            icon={DollarSign}
            change="+18% vs last quarter"
            changeType="positive"
          />
          <MetricCard
            title="Total Expenses"
            value={`$${(financialData.totalExpenses / 1000).toFixed(0)}K`}
            icon={TrendingDown}
            change="+5% vs last quarter"
            changeType="neutral"
          />
          <MetricCard
            title="Gross Profit"
            value={`$${(financialData.grossProfit / 1000).toFixed(0)}K`}
            icon={TrendingUp}
            change="+25% vs last quarter"
            changeType="positive"
          />
          <MetricCard
            title="Net Profit"
            value={`$${(financialData.netProfit / 1000).toFixed(0)}K`}
            icon={DollarSign}
            change="+32% vs last quarter"
            changeType="positive"
          />
        </div>
      </div>
    </div>
  );
}