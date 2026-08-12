import { useMemo } from "react";
import { useDashboardData } from "./useDashboardData";
import { currentDebtForProperty, annualDebtService } from "@/lib/loan-utils";

const OWNED_STATUSES = ["owned", "in_rehab", "listed", "rental"];

export interface PortfolioReturns {
  annualCashFlow: number;
  roe: number;
  cashOnCash: number;
  dscr: number | null;
  totalDebt: number;
  ltv: number;
}

/**
 * Portfolio-wide return metrics that build on useDashboardData but need
 * loan-level detail (amortized balances, debt service) it doesn't expose
 * directly. Centralized here since multiple financials pages show the
 * same figures (Overview, the top-level Financials dashboard).
 */
export function usePortfolioReturns() {
  const { metrics, properties, loans, deals, loading } = useDashboardData();

  const derived = useMemo<PortfolioReturns>(() => {
    const annualCashFlow = metrics.cashFlow * 12;
    const roe = metrics.totalEquity > 0 ? (annualCashFlow / metrics.totalEquity) * 100 : 0;

    // Cash-on-cash: annual cash flow against the cash tied up in each
    // property (purchase price minus current loan balance) — the same
    // per-property formula used on PropertyDetailPage, aggregated here.
    const ownedProperties = properties.filter((p) => OWNED_STATUSES.includes(p.status || ""));
    const totalCashBasis = ownedProperties.reduce((sum, p) => {
      const debt = currentDebtForProperty(p.id, loans, p.loan_amount || 0);
      return sum + Math.max(0, (p.purchase_price || 0) - debt);
    }, 0);
    const cashOnCash = totalCashBasis > 0 ? (annualCashFlow / totalCashBasis) * 100 : 0;

    // DSCR = net operating income / annual debt service. Gross profit is
    // the closest real proxy this app has for NOI.
    const debtService = annualDebtService(loans);
    const dscr = debtService > 0 ? metrics.grossProfit / debtService : null;

    const totalDebt = metrics.portfolioValue - metrics.totalEquity;
    const ltv = metrics.portfolioValue > 0 ? (totalDebt / metrics.portfolioValue) * 100 : 0;

    return { annualCashFlow, roe, cashOnCash, dscr, totalDebt, ltv };
  }, [metrics, properties, loans]);

  return { metrics, properties, loans, deals, derived, loading };
}
