import { useMemo } from "react";
import { useProperties } from "./useProperties";
import { useDeals } from "./useDeals";
import { useLoans } from "./useLoans";
import { Property } from "@/types/property";
import { Deal } from "@/types/deal";
import { currentDebtForProperty } from "@/lib/loan-utils";
import { TimePeriod } from "@/components/ui/time-period-dropdown";
import { getDateRange, getPeriodYearFraction } from "@/contexts/TimePeriodContext";

export interface DashboardMetrics {
  // Operations
  totalAcquisitions: number;
  totalDispositions: number;
  activeRentals: number;
  constructionProjects: number;
  occupancyRate: number;
  projectsOnTime: number;
  
  // Portfolio
  portfolioValue: number;
  totalProperties: number;
  averageROI: number;
  totalEquity: number;
  
  // Financial
  totalIncome: number;
  totalExpenses: number;
  grossProfit: number;
  netProfit: number;
  grossProfitMargin: number;
  netProfitMargin: number;
  cashFlow: number;

  // Financial, scoped to the selected time period (same figures as above
  // when no period is passed in). Recurring rent/expenses are prorated to
  // the period length; sale profit and ROI are filtered to sales that
  // closed within the period.
  periodTotalIncome: number;
  periodTotalExpenses: number;
  periodGrossProfit: number;
  periodNetProfit: number;
  periodGrossProfitMargin: number;
  periodNetProfitMargin: number;
  periodAverageROI: number;
  periodTotalAcquisitions: number;
  periodTotalDispositions: number;

  // Deals
  totalLeads: number;
  underContract: number;
  closedDeals: number;
  avgSpread: number;
  purchaseVolume: number;
  avgARV: number;
  avgRehabBudget: number;
  
  // Lender
  totalLoanAmount: number;
  avgInterestRate: number;
  avgLTV: number;
  
  // Property breakdown
  propertyBreakdown: {
    type: string;
    count: number;
    value: number;
    avgRent: number;
  }[];
  
  // Recent acquisitions
  recentAcquisitions: Property[];
  recentSales: Property[];
  activeConstructionProperties: Property[];
  rentalProperties: Property[];
}

export function useDashboardData(timePeriod?: TimePeriod) {
  const { properties, loading: propertiesLoading } = useProperties();
  const { deals, isLoading: dealsLoading } = useDeals();
  const { loans, loading: loansLoading } = useLoans();

  const metrics = useMemo<DashboardMetrics>(() => {
    // Filter properties by status
    const ownedProperties = properties.filter(p => 
      ['owned', 'in_rehab', 'listed', 'rental'].includes(p.status || '')
    );
    const soldProperties = properties.filter(p => p.status === 'sold');
    const rentalProperties = properties.filter(p => p.status === 'rental');
    const constructionProperties = properties.filter(p => p.status === 'in_rehab');
    const acquisitions = properties.filter(p => 
      ['owned', 'in_rehab', 'listed', 'rental', 'sold'].includes(p.status || '')
    );

    // Calculate portfolio value
    const portfolioValue = ownedProperties.reduce((sum, p) => {
      const value = p.arv || p.purchase_price || 0;
      return sum + value;
    }, 0);

    // Calculate total loan amounts — amortized current balance from real Loan
    // records where they exist, falling back to the static loan_amount field
    // for properties that were only ever entered via the simple property form.
    const totalLoanAmount = ownedProperties.reduce((sum, p) => {
      return sum + currentDebtForProperty(p.id, loans, p.loan_amount || 0);
    }, 0);

    // Calculate equity
    const totalEquity = portfolioValue - totalLoanAmount;

    // Calculate financial metrics
    const monthlyRentIncome = rentalProperties.reduce((sum, p) => sum + (p.monthly_rent || 0), 0);
    const monthlyExpenses = rentalProperties.reduce((sum, p) => sum + (p.monthly_expenses || 0), 0);
    const annualIncome = monthlyRentIncome * 12;
    const annualExpenses = monthlyExpenses * 12;
    
    // Calculate profits from sold properties
    const salesProfit = soldProperties.reduce((sum, p) => {
      const profit = (p.sale_price || 0) - (p.purchase_price || 0) - (p.actual_rehab_cost || p.rehab_budget || 0) - (p.holding_costs || 0);
      return sum + profit;
    }, 0);

    const grossProfit = annualIncome - annualExpenses + salesProfit;
    const netProfit = grossProfit * 0.7; // Estimate after taxes etc.
    
    // Average interest rate
    const propertiesWithLoans = ownedProperties.filter(p => p.loan_amount && p.interest_rate);
    const avgInterestRate = propertiesWithLoans.length > 0
      ? propertiesWithLoans.reduce((sum, p) => sum + (p.interest_rate || 0), 0) / propertiesWithLoans.length
      : 0;

    // Average LTV
    const avgLTV = ownedProperties.length > 0
      ? ownedProperties.reduce((sum, p) => {
          const value = p.arv || p.purchase_price || 0;
          const loan = currentDebtForProperty(p.id, loans, p.loan_amount || 0);
          return value > 0 ? sum + (loan / value * 100) : sum;
        }, 0) / ownedProperties.length
      : 0;

    // Deal metrics
    const leadDeals = deals.filter(d => d.stage === 'lead');
    const analyzingDeals = deals.filter(d => d.stage === 'analyzing');
    const underContractDeals = deals.filter(d => ['under_contract', 'due_diligence'].includes(d.stage));
    const closedDeals = deals.filter(d => d.stage === 'closed');

    const avgSpread = closedDeals.length > 0
      ? closedDeals.reduce((sum, d) => sum + (d.expected_profit || 0), 0) / closedDeals.length
      : 0;

    const purchaseVolume = closedDeals.reduce((sum, d) => sum + (d.offer_price || d.asking_price || 0), 0);
    
    const dealsWithARV = deals.filter(d => d.arv);
    const avgARV = dealsWithARV.length > 0
      ? dealsWithARV.reduce((sum, d) => sum + (d.arv || 0), 0) / dealsWithARV.length
      : 0;

    const dealsWithRehab = deals.filter(d => d.rehab_estimate);
    const avgRehabBudget = dealsWithRehab.length > 0
      ? dealsWithRehab.reduce((sum, d) => sum + (d.rehab_estimate || 0), 0) / dealsWithRehab.length
      : 0;

    // Property breakdown by type
    const typeGroups = properties.reduce((acc, p) => {
      const type = p.property_type || 'Other';
      if (!acc[type]) {
        acc[type] = { count: 0, value: 0, rentSum: 0, rentCount: 0 };
      }
      acc[type].count++;
      acc[type].value += p.arv || p.purchase_price || 0;
      if (p.monthly_rent) {
        acc[type].rentSum += p.monthly_rent;
        acc[type].rentCount++;
      }
      return acc;
    }, {} as Record<string, { count: number; value: number; rentSum: number; rentCount: number }>);

    const propertyBreakdown = Object.entries(typeGroups).map(([type, data]) => ({
      type,
      count: data.count,
      value: data.value,
      avgRent: data.rentCount > 0 ? data.rentSum / data.rentCount : 0,
    }));

    // Occupancy rate
    const occupiedRentals = rentalProperties.filter(p => p.monthly_rent && p.monthly_rent > 0).length;
    const occupancyRate = rentalProperties.length > 0
      ? (occupiedRentals / rentalProperties.length) * 100
      : 0;

    // Average ROI calculation
    const propertiesWithROI = soldProperties.filter(p => p.purchase_price && p.sale_price);
    const averageROI = propertiesWithROI.length > 0
      ? propertiesWithROI.reduce((sum, p) => {
          const investment = (p.purchase_price || 0) + (p.actual_rehab_cost || p.rehab_budget || 0);
          const profit = (p.sale_price || 0) - investment;
          return investment > 0 ? sum + (profit / investment * 100) : sum;
        }, 0) / propertiesWithROI.length
      : 0;

    // Period-scoped figures: recurring rent/expenses are prorated to the
    // selected period's length (a week's worth vs a year's worth of the
    // same monthly rate); sale profit and ROI only count sales that
    // actually closed within the period, since those are lumpy, dated
    // events rather than a recurring rate. Falls back to the all-time
    // figures above when no period is given, so existing callers are
    // unaffected.
    const yearFraction = timePeriod ? getPeriodYearFraction(timePeriod) : 1;

    const periodIncome = monthlyRentIncome * 12 * yearFraction;
    const periodExpenses = monthlyExpenses * 12 * yearFraction;

    const isWithinPeriod = (dateStr: string | null | undefined) => {
      if (!timePeriod || !dateStr) return !timePeriod;
      const { startDate, endDate } = getDateRange(timePeriod);
      const d = new Date(dateStr);
      return d >= startDate && d <= endDate;
    };

    const periodSalesProfit = soldProperties
      .filter(p => isWithinPeriod(p.sale_date))
      .reduce((sum, p) => {
        const profit = (p.sale_price || 0) - (p.purchase_price || 0) - (p.actual_rehab_cost || p.rehab_budget || 0) - (p.holding_costs || 0);
        return sum + profit;
      }, 0);

    const periodTotalIncome = periodIncome + periodSalesProfit;
    const periodTotalExpenses = periodExpenses;
    const periodGrossProfit = periodTotalIncome - periodTotalExpenses;
    const periodNetProfit = periodGrossProfit * 0.7;
    const periodGrossProfitMargin = periodIncome > 0 ? (periodGrossProfit / periodIncome) * 100 : 0;
    const periodNetProfitMargin = periodIncome > 0 ? (periodNetProfit / periodIncome) * 100 : 0;

    const periodPropertiesWithROI = propertiesWithROI.filter(p => isWithinPeriod(p.sale_date));
    const periodAverageROI = periodPropertiesWithROI.length > 0
      ? periodPropertiesWithROI.reduce((sum, p) => {
          const investment = (p.purchase_price || 0) + (p.actual_rehab_cost || p.rehab_budget || 0);
          const profit = (p.sale_price || 0) - investment;
          return investment > 0 ? sum + (profit / investment * 100) : sum;
        }, 0) / periodPropertiesWithROI.length
      : 0;

    // Acquisitions/dispositions scoped to properties actually acquired or
    // sold within the period, vs. the all-time counts above.
    const periodTotalAcquisitions = acquisitions.filter(p => isWithinPeriod(p.acquisition_date)).length;
    const periodTotalDispositions = soldProperties.filter(p => isWithinPeriod(p.sale_date)).length;

    return {
      // Operations
      totalAcquisitions: acquisitions.length,
      totalDispositions: soldProperties.length,
      activeRentals: rentalProperties.length,
      constructionProjects: constructionProperties.length,
      occupancyRate: occupancyRate || 100,
      projectsOnTime: constructionProperties.length, // Assume all on time for now
      
      // Portfolio
      portfolioValue,
      totalProperties: properties.length,
      averageROI: averageROI || 0,
      totalEquity,
      
      // Financial
      totalIncome: annualIncome + salesProfit,
      totalExpenses: annualExpenses,
      grossProfit,
      netProfit,
      grossProfitMargin: annualIncome > 0 ? (grossProfit / annualIncome) * 100 : 0,
      netProfitMargin: annualIncome > 0 ? (netProfit / annualIncome) * 100 : 0,
      cashFlow: monthlyRentIncome - monthlyExpenses,

      periodTotalIncome,
      periodTotalExpenses,
      periodGrossProfit,
      periodNetProfit,
      periodGrossProfitMargin,
      periodNetProfitMargin,
      periodAverageROI,
      periodTotalAcquisitions,
      periodTotalDispositions,

      // Deals
      totalLeads: leadDeals.length + analyzingDeals.length,
      underContract: underContractDeals.length,
      closedDeals: closedDeals.length,
      avgSpread,
      purchaseVolume,
      avgARV,
      avgRehabBudget,
      
      // Lender
      totalLoanAmount,
      avgInterestRate,
      avgLTV,
      
      // Property breakdown
      propertyBreakdown,
      
      // Recent data
      recentAcquisitions: acquisitions.slice(0, 5),
      recentSales: soldProperties.slice(0, 5),
      activeConstructionProperties: constructionProperties,
      rentalProperties,
    };
  }, [properties, deals, loans, timePeriod]);

  return {
    metrics,
    properties,
    deals,
    loans,
    loading: propertiesLoading || dealsLoading || loansLoading,
  };
}