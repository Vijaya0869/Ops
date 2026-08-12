# Ops Dashboard — Business Logic & Formula Reference

Every calculation found in the codebase, with file:line citations, as of 2026-08-07.
`[REAL]` = computed from live hook/API data (backed by Postgres via the NestJS backend).
`[MOCK]` = computed from (or entirely equal to) hardcoded constants baked into the component/page.

**Backend note:** every `*.service.ts` / `*.controller.ts` under `backend/src/` is pure Prisma CRUD
(`findMany`/`create`/`update`/`delete`) scoped by `userId`. There are no `groupBy`/`aggregate`/`_sum`/`_avg`
calls anywhere in the backend — **all calculation logic in this app lives in the frontend**, computed
client-side from raw rows returned by the API.

---

## 0. Central hook — `src/hooks/useDashboardData.ts`

The foundation most dashboard/operations pages read from. All inputs real (`useProperties` + `useDeals`).

| Metric | Formula | Line |
|---|---|---|
| `portfolioValue` | Σ (`arv \|\| purchase_price`) over properties with status in [owned, in_rehab, listed, rental] | 77-80 |
| `totalLoanAmount` | Σ `loan_amount` over same set | 83-85 |
| `totalEquity` | `portfolioValue - totalLoanAmount` | 88 |
| `annualIncome` / `annualExpenses` | `monthlyRentIncome * 12` / `monthlyExpenses * 12` (rental properties only) | 93-94 |
| `salesProfit` | Σ (`sale_price - purchase_price - (actual_rehab_cost \|\| rehab_budget) - holding_costs`) over sold properties | 97-100 |
| `grossProfit` | `annualIncome - annualExpenses + salesProfit` | 102 |
| `netProfit` | `grossProfit * 0.7` — **hardcoded 30% tax/other estimate, not real** | 103 |
| `avgInterestRate` | mean `interest_rate` over properties with loan+rate | 106-109 |
| `avgLTV` | mean of `(loan_amount / (arv \|\| purchase_price)) * 100` per owned property | 112-118 |
| `avgSpread` | mean `expected_profit` over closed deals | 126-128 |
| `purchaseVolume` | Σ (`offer_price \|\| asking_price`) over closed deals | 130 |
| `avgARV` / `avgRehabBudget` | mean deal `arv` / `rehab_estimate` | 132-140 |
| `propertyBreakdown` | group-by `property_type`: count, value sum, avg rent | 143-162 |
| `occupancyRate` | `(occupied rentals / total rentals) * 100`, defaults to 100 if no rentals | 165-168, 186 |
| `averageROI` | mean of `((sale_price - (purchase_price + actual_rehab_cost\|\|rehab_budget)) / investment) * 100` over sold properties | 171-178 |
| `grossProfitMargin` / `netProfitMargin` | `(grossProfit / annualIncome) * 100` / `(netProfit / annualIncome) * 100` | 200-201 |
| `cashFlow` | `monthlyRentIncome - monthlyExpenses` | 202 |

---

## 1. Portfolio / Equity

**`src/components/dashboard/OverallHealthKPI.tsx`** `[REAL]`
Pure display of `metrics.*`. `formatCurrency`: `≥1e6 → "$X.XM"`, `≥1e3 → "$XK"` (line 36-40).

**`src/components/dashboard/FinancialSummary.tsx`** `[REAL]` — pure display, same currency formatter (line 19-23).

**`src/components/properties/PortfolioStats.tsx`** `[REAL]`
- `totalValue` = Σ (`arv \|\| purchase_price`) over owned properties — 32-35
- `totalLoans` = Σ `loan_amount` over owned — 36-39
- `averageARV` = mean `arv` — 40-44
- `totalEquity = totalValue - totalLoans` — 56
- `monthlyIncome` = Σ `monthly_rent` over rentals — 46-50

**`src/pages/PropertiesPage.tsx`** `[REAL, with one MOCK tile]`
- `totalValue` = Σ `arv` — line 25
- `totalEquity = totalValue - totalPurchasePrice` — line 27 (⚠️ inconsistent with PortfolioStats, which does value-minus-*loans*, not value-minus-purchase-price)
- `totalCashFlow` = Σ (`monthly_rent - monthly_expenses`) — line 28
- `annualCashFlow = totalCashFlow * 12` — line 31
- `averageROE = (annualCashFlow / totalEquity) * 100` — line 32
- **`[MOCK]`** "Average ROI" stat tile shows a literal **18.5%** regardless of data — line 137, never wired to the real `averageROE` computed two lines earlier

**`src/pages/properties/PropertyDetailPage.tsx`** `[REAL]` (single property)
- `totalInvestment = purchase_price + (actual_rehab_cost \|\| rehab_budget) + holding_costs` — 164-167
- `equity = arv - loan_amount` — 168
- `potentialProfit = arv - totalInvestment` — 169
- `roi = (potentialProfit / totalInvestment) * 100` — 170
- `cashFlow = monthly_rent - monthly_expenses`; `annualCashFlow = cashFlow * 12` — 171-173
- `cashOnCash = (annualCashFlow / (purchase_price - loan_amount)) * 100` — 174-179

---

## 2. Deals

**`src/components/operations/AcquisitionsSection.tsx`** `[REAL]`
- `dealsBySource` — group-by `deal.source`, count per source — 46-50
- Source share `= (count / totalDeals) * 100` — 104
- Per-acquisition LTV: `totalCost = purchase_price + (actual_rehab_cost \|\| rehab_budget)`; `ltv = (totalCost / (arv \|\| purchase_price \|\| 1)) * 100` — 171-173 (color bands: ≤70% good, ≤80% warning, else bad — 193)

**`src/components/deals/DecisionMatrix.tsx`** `[REAL user input, hardcoded weights]`
- `weightedScore = score * weight` per criterion — 159
- `totalWeightedScore` = Σ weightedScore — 163
- `maxPossibleScore` = Σ (weight * 5) — 164
- `scorePercentage = (totalWeightedScore / maxPossibleScore) * 100` — 165
- Rating bands: ≥80% Excellent, ≥60% Good, ≥40% Fair, else Poor — 167-178

**`src/pages/DealsPage.tsx`** `[MOCK]` — `mockDeals` array; `mao`/`spread`/`roi` are pre-baked literals, not recalculated
- `totalPurchaseVolume` = Σ `purchasePrice` — 77
- `averageSpread` = Σ `spread` / count — 78
- `averageROI` = Σ `roi` / count — 79

**`src/components/analytics/DealFlowAnalytics.tsx`** `[MOCK]` — static `conversionData`/`pipelineData`/`timelineData`/`dealMetrics`. Only "Avg Timeline" is computed: Σ `avgDays` across stages — 183.

**`src/components/operations/DispositionSection.tsx`** `[REAL]`
- `totalSalesProfit` = Σ (`sale_price - purchase_price - (actual_rehab_cost \|\| rehab_budget)`) over recent sales — 43-46
- `avgSalePrice` = Σ `sale_price` / count — 48-50
- `profitMargin = (totalSalesProfit / (avgSalePrice * count)) * 100` — 52-54
- `successRate = (totalDispositions / totalProperties) * 100` — 191

---

## 3. Financials — P&L, Balance Sheet, Cash Flow, Net Worth

⚠️ **Pattern across this whole section:** the presentational components (`ProfitLoss.tsx`, `BalanceSheet.tsx`, `NetWorth.tsx`, `CashPosition.tsx`, `CashFlowForecast.tsx`) contain real formula logic, but every *page* that renders them (`OverviewPage`, `FinancialsPage`, `NetWorthPage`, `BalanceSheetPage`, `ProfitLossPage`, `CashPositionPage`, `CashForecastPage`) feeds them an identical hardcoded object: `{totalIncome: 125000, totalExpenses: 37500, rentalIncome: 60000, wholesaleProfits: 20000, flipSaleProceeds: 45000}`. The math is real; the inputs are not.

**`src/components/financials/ProfitLoss.tsx`** `[MOCK inputs]`
- `totalIncome` = Σ income line items — 38
- `totalExpenses` = Σ expense line items — 39
- `grossProfit = totalIncome - totalExpenses`; `netIncome = grossProfit` (no tax modeling) — 40-41
- `profitMargin = (netIncome / totalIncome) * 100` — 70, 210

**`src/components/financials/BalanceSheet.tsx`** `[MOCK inputs]`
- `rentEscrow = rentalIncome * 0.1` — 21
- `retainedEarnings = netIncome = totalIncome - totalExpenses` — 47, 49
- `totalAssets = totalCurrentAssets + totalFixedAssets` — 52-54
- `totalLiabilities = currentLiabilities + longTermLiabilities` — 56-58
- `totalEquity` = Σ equity components — 60
- Balance check footer: `totalLiabilities + totalEquity` — 107

**`src/components/financials/NetWorth.tsx`** `[MOCK inputs]`
- `accountsReceivable = rentalIncome * 0.1` — 24
- `totalAssets` = Σ assets — 39
- `totalLiabilities` = Σ liabilities — 40
- `netWorth = totalAssets - totalLiabilities` — 41
- `Asset-to-Liability Ratio = totalAssets / totalLiabilities` — 84, 162
- `Debt-to-Asset Ratio = (totalLiabilities / totalAssets) * 100` — 85

**`src/components/financials/CashPosition.tsx`** `[MOCK]`
- `debtService.current/next = round(totalExpenses * 0.25)`, fallback 25000 — 45-48
- `operatingExpenses.current/next/quarter = totalExpenses * 0.18 / 0.19 / 0.56` — 50-54
- `netCashFlow* = totalInflows* - totalOutflows*` — 77-79
- `endingBalanceCurrent = startingBalance(125000) + netCashFlowCurrent`, chained forward for next/quarter — 62, 81-83
- `fixedMonthlyCosts = 25000 + 18000 + 12000 + 4500` (hardcoded, not tied to the outflow objects above) — 85
- `liquidityBuffer = endingBalanceCurrent / fixedMonthlyCosts` — 86; flag: <3 Critical, <5 Review, else OK — 107-111

**`src/components/financials/CashFlowForecast.tsx`** `[MOCK]` — 6-month projection, base values from props, month-over-month multipliers hardcoded (2.5→2.8 rental scaling etc., line 24-115)
- `totalIncome` / `totalExpenses` per month = Σ of category values — 119-120
- `netCashFlow = totalIncome - totalExpenses` — 121
- `cumulativeCashPosition` = running total from `startingCash = 125000` — 123-130
- `liquidityBuffer = cumulativeCashPosition / fixedMonthlyCosts` — 133, same Critical/Review bands — 135-139
- "Lowest Cash Position" = `Math.min(...cumulativeCashPosition)` — 312

**`src/components/financials/FinancialDrilldown.tsx`** `[MOCK]` — fully static nested income/expense tree. `netIncome = incomeData.amount - expenseData.amount` — 228.

**`src/components/financials/RenovationExpenses.tsx`** `[REAL]` — most complete real formula set in the app (`useProjects`/`useRenovationItems`/`useProperties`)
- `projectActual(project)` = Σ `actualCost` of its renovation items, else `project.actualCost` — 343-347
- `projectBudget(project)` = `project.budget`, else Σ item `estimatedCost` — 349-352
- `daysBetween(a,b) = round((b-a)/86400000)` — 84-86
- `plannedDuration = daysBetween(start, end)`; `elapsedDays` = days from start to (end if completed, else now), floored at 0 — 354-364
- `totalVariance = ((totalActual - totalBudget)/totalBudget) * 100` — 368
- `progress = min(100, (elapsed/duration)*100)`, or 100 if completed — 500-501, 598
- `categoryTotals` — group-by item category, Σ estimated/actual — 377-383

**`src/components/dashboard/FinancialHealthKPI.tsx`** `[REAL]`
- `debtServiceCoverage (DSCR) = (totalIncome / totalExpenses).toFixed(1)` — 43-45
- `cashOnCashReturn = ((cashFlow * 12) / totalEquity) * 100` — 47-49

**`src/pages/financials/OverviewPage.tsx`** `[MOCK]`
- `LTV = ((portfolioValue - totalEquity) / portfolioValue) * 100` — 161
- `Cash-on-Cash = ((cashFlow*12) / 500000) * 100` — hardcoded $500K equity denominator, unrelated to the real `totalEquity` field — 186

**`src/pages/FinancialsPage.tsx`** `[MOCK]`
- `Profit Margin = (netProfit / totalIncome) * 100` — 255, 257
- Lending tiles: `dailyInterest = totalDebt * (rate/100) / 365` — values pre-baked, not computed live — 86-108

**`src/pages/financials/IncomePage.tsx`** `[REAL]` (`useIncome`/`useProperties`)
- `categoryTotal(id)` = Σ `amount` filtered by category + date range + property — 57-58
- `totalIncome` = Σ categoryTotal — 63
- 6-month trend: per-month Σ amount by category — 71-83

**`src/pages/financials/ExpensesPage.tsx`** `[REAL]` (`useExpenses`/`useRenovationItems`/`useProjects`)
- `categoryTotal("renovation")` = Σ (`actualCost ?? estimatedCost`); other categories = Σ `amount` filtered — 62-69
- `totalExpenses` = Σ categoryTotal — 71
- `highestCategory` = max by total — 72-75

**`src/pages/financials/LendingPage.tsx`** `[REAL]` (`useLoans`/`useLenders`/`useProperties`)
- `totalPrincipal` = Σ `principal` — 28
- `totalMonthlyPayment` = Σ `monthlyPayment` of active loans — 30
- `averageInterestRate` = mean `interestRate` — 31-32
- `maturityDate = startDate + termMonths` — 34-39
- `ltv = round((principal / (arv \|\| purchase_price)) * 100)` per loan — 41-45

**`src/pages/financials/RentalsPage.tsx`** `[MOCK]` — hardcoded `rentalProperties` array
- `totalMonthlyRent` = Σ `monthlyRent` of occupied properties — 41-43
- `avgOccupancyRate` = simple mean of per-property occupancy (not weighted by units) — 45-46
- Per-property "Annual Income" = `monthlyRent * 12 * (occupancyRate/100)` — 157

**`src/components/operations/RentalsSection.tsx`** `[REAL]` (`metrics.rentalProperties`)
- `netOperatingIncome = totalMonthlyRent - totalMonthlyExpenses` — 42-44
- `occupiedUnits` / `vacantUnits` = count with rent>0 / total-occupied — 45-46
- `Expense Ratio = (totalMonthlyExpenses/totalMonthlyRent)*100` — 128
- `NOI Margin = (netOperatingIncome/totalMonthlyRent)*100` — 154

**`src/pages/financials/NetWorthPage.tsx` / `BalanceSheetPage.tsx` / `ProfitLossPage.tsx` / `CashPositionPage.tsx` / `CashForecastPage.tsx`** `[MOCK inputs]` — all pass the same hardcoded financial object into the real components above.

---

## 4. Lending

**`src/components/dashboard/LenderManagement.tsx`** `[REAL]`
- `lenderGroups` group-by `lender_name`: count, Σ `loan_amount`, Σ `interest_rate` — 50-60
- Per-lender avg rate = `totalRate / count` — 122
- Per-property `ltv = (loan_amount / arv) * 100` — 156
- "Avg Loan Amount" = `totalLoanAmount / propertiesWithLoans.length` — 253

(See also §2 AcquisitionsSection LTV, §3 LendingPage — same LTV formula reused throughout.)

---

## 5. Renovations / Projects

**`src/components/financials/RenovationExpenses.tsx`** — see §3 (real, most complete formula set).

**`src/pages/ProjectsPage.tsx`** `[MOCK]` — `mockProjects` array
- `totalBudget`/`totalSpent`/`totalTasks`/`totalOverdue` = Σ over mock projects — 68-71
- `Budget Variance = ((totalBudget-totalSpent)/totalBudget)*100` — 148
- Budget breakdown split: Labor = `spent*0.6`, Materials = `*0.35`, Other = `*0.05` — **arbitrary fixed proportions, not real category data** — 250-258

**`src/components/operations/ConstructionSection.tsx`** `[REAL]` (`metrics.activeConstructionProperties`)
- `totalRehabBudget` = Σ `rehab_budget`; `totalActualCost` = Σ `actual_rehab_cost` — 45-46
- `budgetVariance = ((totalActualCost-totalRehabBudget)/totalRehabBudget)*100` — 47-49
- `budgetUsed = (actual_rehab_cost/rehab_budget)*100` per project, capped at 100 for bar width — 159-161
- `isOverBudget = actual_rehab_cost > rehab_budget` — 162
- "Portfolio Value at Risk" = Σ (`purchase_price + rehab_budget`) — 142

**`src/pages/DocumentsPage.tsx`** ("Scope IQ" — SOW/cost automation) `[REAL structure, MOCK pricing]`
- `pricingProfiles` — static $/task pricing catalog by category — 32-135
- `getPricingForTask()` fuzzy-matches task name to catalog, else category default — 149-175
- `totalLaborCost` / `totalMaterialCost` = Σ across `sowData` — 625-626
- `profileMultiplier` (low=0.8, medium=1.0, high=1.3) — 617-621
- `adjustedTotal = (totalLaborCost + totalMaterialCost) * profileMultiplier` — 628
- **`[MOCK]`** "Actual Spent" = `adjustedTotal * 0.85`; "Variance" = `adjustedTotal * 0.15` — synthetic 85/15 split, not tied to any real spend data — 1371, 1375

---

## 6. Analytics / Risk — entirely mock, no live data anywhere

- **`src/components/analytics/PortfolioPerformance.tsx`** `[MOCK]` — static `roiData`, `performanceMetrics` (totalROI 16.8%, avgCashOnCash 14.2%, portfolioIRR 18.5%), `propertyPerformance` — 12-33
- **`src/components/analytics/DealFlowAnalytics.tsx`** `[MOCK]` — see §2
- **`src/components/analytics/MarketAnalytics.tsx`** `[MOCK]` — static `marketTrends`, `neighborhoodData`, `marketMetrics` — 12-33
- **`src/components/analytics/RiskAnalytics.tsx`** `[MOCK]` — static `ltvDistribution`, `cashFlowStress`, `riskFactors`, `geographicExposure`, `riskMetrics` (avgLTV 62.4%, portfolioVaR 8.2%, concentrationRisk 35%, stressTestScore 78) — 12-49

---

## 7. Operations

Real, `useDashboardData`-driven: `AcquisitionsSection.tsx`, `RentalsSection.tsx`, `ConstructionSection.tsx`, `DispositionSection.tsx` (all covered above).

---

## 8. Admin / HR — excluded from "make real" scope, documented for completeness

**`src/components/operations/AdminSection.tsx`** `[MOCK]` — `adminData` (headcount 12, contractorUtilization 85%, taskCompletion 92%, employeeSatisfaction 4.2/5.0), `teamMembers[]`, `contractors[]`, `trainingPrograms[]` (has real `completed`/`participants` fields but displays a separately hardcoded `completion` %, not `completed/participants`), `violations[]` — 20-54. No computed formulas at all — all literals.

**`src/components/dashboard/AdminHRDashboard.tsx`** `[PARTIALLY REAL]` — despite the "HR" label, this is financial estimation, not employee data:
- `estimatedSalaries = max(totalProperties * 2000, 8000)` — 29
- `estimatedOfficeExpenses = max(totalProperties * 500, 2000)` — 30
- `estimatedSubscriptions = 1500 + totalProperties * 100` — 31
- `estimatedSupplies = 500 + totalProperties * 50` — 32

These are ad hoc linear formulas keyed only off property count — not derived from any real expense data, and not fixable without an actual "office overhead" expense category.

---

## Summary: Real vs. Mock, by page/component

| Real (live data) | Mock/hardcoded |
|---|---|
| `useDashboardData` + everything consuming `metrics.*`: OverallHealthKPI, FinancialSummary, FinancialHealthKPI, LenderManagement, AcquisitionsSection, RentalsSection, ConstructionSection, DispositionSection, DealPipeline, PortfolioOverview, Index.tsx, AdminHRDashboard (portfolio/deal tiles) | AdminHRDashboard's "estimated" expense tiles (linear guesses off property count) |
| PortfolioStats, PropertyList, PropertiesPage (mostly), PropertyDetailPage | PropertiesPage "Average ROI" tile (hardcoded 18.5%) |
| RenovationExpenses, ExpensesPage, IncomePage, LendingPage | ProfitLoss/BalanceSheet/NetWorth/CashPosition/CashFlowForecast — real math, but every page that feeds them (OverviewPage, FinancialsPage, NetWorthPage, BalanceSheetPage, ProfitLossPage, CashPositionPage, CashForecastPage) passes one shared hardcoded financial object |
| DecisionMatrix (real user-entered scores, hardcoded weights) | DealsPage (mockDeals), ProjectsPage (mockProjects), financials/RentalsPage (mock array), all 4 Analytics components, AdminSection (all mock), FinancialDrilldown (mock tree), DocumentsPage pricing catalog + synthetic 85/15 actual-spend split |

---

## Data gaps that block "real" numbers even with a rewrite

1. **No cash/bank-balance entity** — Cash Position/Forecast need a stored starting balance or a policy for deriving one from the Income/Expense ledger; nothing in the schema tracks an actual account balance today.
2. **`property.loan_amount` (static field) vs. the `Loan` model (principal/rate/term/start date)** — two disconnected sources of truth for debt. Balance-sheet liabilities should standardize on amortizing the `Loan` model, not the static field.
3. **No tax rate / tax expense category** — `netProfit = grossProfit * 0.7` is a guess; needs either removal (gross-only) or a real assumption input.
4. **`DealCost` and `DealAnalysis` tables exist in the backend with zero frontend hooks** — Deals/Analytics pages can't go fully real until `useDealCosts`/`useDealAnalyses` hooks are built.
5. **No office-overhead expense category** — AdminHRDashboard's salary/subscription/supply estimates have no real data to replace them with unless that's tracked as an Expense category.
6. **No external market-data source** — MarketTrendsPage and Analytics' Market tab need county comps/days-on-market/mortgage rates that don't exist anywhere in this system (would require an MLS/Zillow/Redfin integration).
