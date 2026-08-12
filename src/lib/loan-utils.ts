import type { Loan } from "@/services/loans.service";

function monthsElapsed(startDate: string, asOf: Date): number {
  const start = new Date(startDate);
  const months =
    (asOf.getFullYear() - start.getFullYear()) * 12 +
    (asOf.getMonth() - start.getMonth()) -
    (asOf.getDate() < start.getDate() ? 1 : 0);
  return Math.max(0, months);
}

/**
 * Current remaining balance of a single loan, amortized forward from
 * startDate using standard mortgage math. Falls back to the original
 * principal if there isn't enough info (payment + term) to amortize.
 */
export function calculateRemainingBalance(loan: Loan, asOf: Date = new Date()): number {
  if (loan.status === "paid_off" || loan.status === "refinanced") return 0;

  const principal = loan.principal || 0;
  if (principal <= 0) return 0;

  const monthlyRate = (loan.interestRate || 0) / 100 / 12;
  let n = monthsElapsed(loan.startDate, asOf);
  if (loan.termMonths) n = Math.min(n, loan.termMonths);

  let payment = loan.monthlyPayment;
  if (!payment || payment <= 0) {
    if (loan.termMonths && loan.termMonths > 0) {
      payment =
        monthlyRate > 0
          ? (principal * monthlyRate * Math.pow(1 + monthlyRate, loan.termMonths)) /
            (Math.pow(1 + monthlyRate, loan.termMonths) - 1)
          : principal / loan.termMonths;
    } else {
      // No payment and no term to derive one from — nothing to amortize with.
      return principal;
    }
  }

  const balance =
    monthlyRate === 0
      ? principal - payment * n
      : principal * Math.pow(1 + monthlyRate, n) -
        payment * ((Math.pow(1 + monthlyRate, n) - 1) / monthlyRate);

  return Math.max(0, Math.round(balance * 100) / 100);
}

/**
 * Current debt for a property: sums amortized balances of its real Loan
 * records. If the property has no Loan records at all (common for
 * properties only ever entered via the simple property form),
 * falls back to the static property.loan_amount figure.
 */
export function currentDebtForProperty(
  propertyId: string,
  loans: Loan[],
  fallbackAmount = 0,
): number {
  const propertyLoans = loans.filter((l) => l.propertyId === propertyId);
  if (propertyLoans.length === 0) return fallbackAmount;
  return propertyLoans.reduce((sum, l) => sum + calculateRemainingBalance(l), 0);
}
