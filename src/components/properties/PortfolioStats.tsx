import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { fetchPropertiesSummary } from "@/services/properties.service";
import { fetchLoans } from "@/services/loans.service";
import { currentDebtForProperty } from "@/lib/loan-utils";
import { Building2, DollarSign, TrendingUp, Home } from "lucide-react";
import { StatTileSkeleton } from "@/components/ui/loading-skeletons";

interface PortfolioStatsData {
  totalProperties: number;
  totalValue: number;
  averageARV: number;
  totalEquity: number;
  rentalProperties: number;
  monthlyIncome: number;
}

export function PortfolioStats() {
  const [stats, setStats] = useState<PortfolioStatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [properties, loans] = await Promise.all([
        fetchPropertiesSummary(),
        fetchLoans(),
      ]);
      const ownedStatuses = ["owned", "in_rehab", "listed", "rental"];
      const ownedProperties = properties.filter((p) =>
        ownedStatuses.includes(p.status || "")
      );

      const totalValue = ownedProperties.reduce(
        (sum, p) => sum + (p.arv || p.purchase_price || 0),
        0
      );
      const totalLoans = ownedProperties.reduce(
        (sum, p) => sum + currentDebtForProperty(p.id, loans, p.loan_amount || 0),
        0
      );
      const arvValues = properties.filter((p) => p.arv).map((p) => p.arv!);
      const averageARV =
        arvValues.length > 0
          ? arvValues.reduce((a, b) => a + b, 0) / arvValues.length
          : 0;

      const rentalProperties = properties.filter((p) => p.status === "rental");
      const monthlyIncome = rentalProperties.reduce(
        (sum, p) => sum + (p.monthly_rent || 0),
        0
      );

      setStats({
        totalProperties: properties.length,
        totalValue,
        averageARV,
        totalEquity: totalValue - totalLoans,
        rentalProperties: rentalProperties.length,
        monthlyIncome,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {[...Array(6)].map((_, i) => (
          <StatTileSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      label: "Total Properties",
      value: stats.totalProperties,
      icon: Building2,
      format: "number",
    },
    {
      label: "Portfolio Value",
      value: stats.totalValue,
      icon: DollarSign,
      format: "currency",
    },
    {
      label: "Total Equity",
      value: stats.totalEquity,
      icon: TrendingUp,
      format: "currency",
    },
    {
      label: "Average ARV",
      value: stats.averageARV,
      icon: TrendingUp,
      format: "currency",
    },
    {
      label: "Rentals",
      value: stats.rentalProperties,
      icon: Home,
      format: "number",
    },
    {
      label: "Monthly Income",
      value: stats.monthlyIncome,
      icon: DollarSign,
      format: "currency",
    },
  ];

  const formatValue = (value: number, format: string) => {
    if (format === "currency") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    }
    return value.toString();
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6 animate-in fade-in duration-300">
      {statCards.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <stat.icon className="h-4 w-4" />
              <span className="text-xs">{stat.label}</span>
            </div>
            <div className="text-xl font-bold text-foreground">
              {formatValue(stat.value, stat.format)}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
