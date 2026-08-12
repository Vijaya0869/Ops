import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Percent, Calendar, TrendingUp } from "lucide-react";
import { useLoans } from "@/hooks/useLoans";
import { useLenders } from "@/hooks/useLenders";
import { useProperties } from "@/hooks/useProperties";
import {
  StatCardSkeletonGrid,
  ListRowSkeletonGroup,
} from "@/components/ui/loading-skeletons";
import { Skeleton } from "@/components/ui/skeleton";

const statusColors: Record<string, string> = {
  active: "bg-success",
  paid_off: "bg-muted",
  defaulted: "bg-destructive",
  refinanced: "bg-accent",
};

export default function LendingPage() {
  const { loans, loading: loansLoading } = useLoans();
  const { lenders, loading: lendersLoading } = useLenders();
  const { properties, loading: propertiesLoading } = useProperties();

  const loading = loansLoading || lendersLoading || propertiesLoading;

  const totalPrincipal = loans.reduce((sum, loan) => sum + loan.principal, 0);
  const activeLoans = loans.filter((loan) => loan.status === "active");
  const totalMonthlyPayment = activeLoans.reduce((sum, loan) => sum + (loan.monthlyPayment || 0), 0);
  const averageInterestRate =
    loans.length > 0 ? loans.reduce((sum, loan) => sum + loan.interestRate, 0) / loans.length : 0;

  const maturityDate = (loan: (typeof loans)[number]) => {
    if (!loan.termMonths) return null;
    const date = new Date(loan.startDate);
    date.setMonth(date.getMonth() + loan.termMonths);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  const ltv = (loan: (typeof loans)[number]) => {
    const property = properties.find((p) => p.id === loan.propertyId);
    const value = property?.arv || property?.purchase_price;
    return value ? Math.round((loan.principal / value) * 100) : null;
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Navigation />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 space-y-2">
              <Skeleton className="h-8 w-56" />
              <Skeleton className="h-4 w-72" />
            </div>
            <StatCardSkeletonGrid count={4} className="mb-8" />
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-16" />
              </CardHeader>
              <CardContent>
                <ListRowSkeletonGroup count={3} />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Navigation />

      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">Lending & Loans</h1>
            <p className="text-muted-foreground">Loans held against your properties</p>
          </div>

          {/* Portfolio Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Principal</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalPrincipal.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Outstanding across {loans.length} loan{loans.length === 1 ? "" : "s"}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Payments</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalMonthlyPayment.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">From {activeLoans.length} active loan{activeLoans.length === 1 ? "" : "s"}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Interest Rate</CardTitle>
                <Percent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{averageInterestRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">Across all loans</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Lenders</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{lenders.length}</div>
                <p className="text-xs text-muted-foreground">On file</p>
              </CardContent>
            </Card>
          </div>

          {/* Loan Details */}
          <Card>
            <CardHeader>
              <CardTitle>Loans</CardTitle>
            </CardHeader>
            <CardContent>
              {loans.length === 0 ? (
                <p className="text-muted-foreground text-sm py-8 text-center">
                  No loans recorded yet.
                </p>
              ) : (
                <div className="space-y-6">
                  {loans.map((loan) => {
                    const property = properties.find((p) => p.id === loan.propertyId);
                    const lender = lenders.find((l) => l.id === loan.lenderId);
                    const loanLtv = ltv(loan);
                    const loanMaturity = maturityDate(loan);

                    return (
                      <div key={loan.id} className="border border-border rounded-lg p-4 space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">{property?.address || "Unknown property"}</h3>
                            <p className="text-muted-foreground">{lender?.name || "Lender not set"}</p>
                          </div>
                          <Badge className={statusColors[loan.status] || "bg-muted"}>
                            {loan.status.replace("_", " ").toUpperCase()}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Principal Amount</p>
                            <p className="font-semibold">${loan.principal.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Interest Rate</p>
                            <p className="font-semibold">{loan.interestRate}%</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Monthly Payment</p>
                            <p className="font-semibold">
                              {loan.monthlyPayment ? `$${loan.monthlyPayment.toLocaleString()}` : "—"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">LTV Ratio</p>
                            <p className="font-semibold">{loanLtv !== null ? `${loanLtv}%` : "—"}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Term</p>
                            <p className="font-medium">{loan.termMonths ? `${loan.termMonths} months` : "—"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Start Date</p>
                            <p className="font-medium">
                              {new Date(loan.startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Maturity Date</p>
                            <p className="font-medium">{loanMaturity || "—"}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
