import { describe, expect, it } from "vitest";
import {
  annualDebtService,
  calculateRemainingBalance,
  currentDebtForProperty,
  monthlyPaymentFor,
} from "./loan-utils";
import type { Loan } from "@/services/loans.service";

function makeLoan(overrides: Partial<Loan> = {}): Loan {
  return {
    id: "loan-1",
    userId: "user-1",
    propertyId: "prop-1",
    lenderId: null,
    principal: 100000,
    interestRate: 12,
    termMonths: 360,
    monthlyPayment: null,
    startDate: "2020-01-01",
    status: "active",
    createdAt: "2020-01-01",
    updatedAt: "2020-01-01",
    ...overrides,
  };
}

describe("monthlyPaymentFor", () => {
  it("returns the recorded monthlyPayment when set, without recomputing", () => {
    const loan = makeLoan({ monthlyPayment: 2500, interestRate: 999, termMonths: 1 });
    expect(monthlyPaymentFor(loan)).toBe(2500);
  });

  it("derives the classic $100k / 12% / 30yr payment (~$1028.61)", () => {
    const loan = makeLoan({ principal: 100000, interestRate: 12, termMonths: 360 });
    expect(monthlyPaymentFor(loan)).toBeCloseTo(1028.61, 1);
  });

  it("falls back to straight-line principal/term when the rate is 0%", () => {
    const loan = makeLoan({ principal: 12000, interestRate: 0, termMonths: 12 });
    expect(monthlyPaymentFor(loan)).toBeCloseTo(1000, 5);
  });

  it("returns null when there's no payment and no term to derive one from", () => {
    const loan = makeLoan({ monthlyPayment: null, termMonths: null });
    expect(monthlyPaymentFor(loan)).toBeNull();
  });

  it("returns null for a non-positive principal", () => {
    const loan = makeLoan({ principal: 0, termMonths: 360 });
    expect(monthlyPaymentFor(loan)).toBeNull();
  });
});

describe("calculateRemainingBalance", () => {
  it("returns 0 for paid_off loans regardless of other fields", () => {
    const loan = makeLoan({ status: "paid_off", principal: 500000 });
    expect(calculateRemainingBalance(loan)).toBe(0);
  });

  it("returns 0 for refinanced loans", () => {
    const loan = makeLoan({ status: "refinanced", principal: 500000 });
    expect(calculateRemainingBalance(loan)).toBe(0);
  });

  it("returns 0 for a non-positive principal", () => {
    const loan = makeLoan({ principal: 0 });
    expect(calculateRemainingBalance(loan)).toBe(0);
  });

  it("equals the original principal at month 0 (asOf === startDate)", () => {
    const loan = makeLoan({ startDate: "2026-01-01" });
    const balance = calculateRemainingBalance(loan, new Date("2026-01-01"));
    expect(balance).toBeCloseTo(100000, 0);
  });

  it("amortizes to (near) zero by the loan's own maturity date", () => {
    const loan = makeLoan({ startDate: "2020-01-01", termMonths: 360 });
    const maturity = new Date("2050-01-01"); // 360 months after start
    const balance = calculateRemainingBalance(loan, maturity);
    expect(balance).toBeLessThan(1); // fully amortized, allowing for rounding
  });

  it("decreases monotonically as time passes", () => {
    const loan = makeLoan({ startDate: "2020-01-01", termMonths: 360 });
    const balanceAt1yr = calculateRemainingBalance(loan, new Date("2021-01-01"));
    const balanceAt5yr = calculateRemainingBalance(loan, new Date("2025-01-01"));
    const balanceAt10yr = calculateRemainingBalance(loan, new Date("2030-01-01"));
    expect(balanceAt1yr).toBeLessThan(100000);
    expect(balanceAt5yr).toBeLessThan(balanceAt1yr);
    expect(balanceAt10yr).toBeLessThan(balanceAt5yr);
  });

  it("falls back to the original principal when payment can't be derived", () => {
    const loan = makeLoan({ termMonths: null, monthlyPayment: null });
    const balance = calculateRemainingBalance(loan, new Date("2030-01-01"));
    expect(balance).toBe(100000);
  });
});

describe("annualDebtService", () => {
  it("sums 12x the monthly payment across active loans only", () => {
    const loans = [
      makeLoan({ id: "a", status: "active", monthlyPayment: 1000 }),
      makeLoan({ id: "b", status: "active", monthlyPayment: 500 }),
      makeLoan({ id: "c", status: "paid_off", monthlyPayment: 99999 }),
    ];
    expect(annualDebtService(loans)).toBeCloseTo(18000, 5); // (1000+500)*12
  });

  it("returns 0 for an empty loan list", () => {
    expect(annualDebtService([])).toBe(0);
  });
});

describe("currentDebtForProperty", () => {
  it("falls back to the static amount when the property has no Loan records", () => {
    const result = currentDebtForProperty("prop-x", [], 45000);
    expect(result).toBe(45000);
  });

  it("sums amortized balances across multiple loans on the same property", () => {
    const loans = [
      makeLoan({ id: "a", propertyId: "prop-1", principal: 50000, termMonths: null, monthlyPayment: null }),
      makeLoan({ id: "b", propertyId: "prop-1", principal: 30000, termMonths: null, monthlyPayment: null }),
      makeLoan({ id: "c", propertyId: "prop-2", principal: 999999, termMonths: null, monthlyPayment: null }),
    ];
    // No term/payment on a/b means calculateRemainingBalance falls back to principal
    expect(currentDebtForProperty("prop-1", loans, 0)).toBe(80000);
  });

  it("ignores the fallback amount once real Loan records exist", () => {
    const loans = [makeLoan({ propertyId: "prop-1", principal: 10000, termMonths: null, monthlyPayment: null })];
    expect(currentDebtForProperty("prop-1", loans, 999999)).toBe(10000);
  });
});
