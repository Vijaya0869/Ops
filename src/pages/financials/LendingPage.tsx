import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Percent, Calendar, TrendingUp } from "lucide-react";

export default function LendingPage() {
  // Mock data - will be replaced with real data connections
  const lendingPortfolio = [
    {
      id: 1,
      borrower: "ABC Development LLC",
      principalAmount: 150000,
      interestRate: 12.5,
      term: "12 months",
      startDate: "Jan 2024",
      maturityDate: "Jan 2025",
      monthlyPayment: 13750,
      totalInterest: 15000,
      status: "active",
      ltv: 70
    },
    {
      id: 2,
      borrower: "XYZ Properties Inc",
      principalAmount: 75000,
      interestRate: 15.0,
      term: "6 months",
      startDate: "Mar 2024",
      maturityDate: "Sep 2024",
      monthlyPayment: 13125,
      totalInterest: 5625,
      status: "active",
      ltv: 65
    },
    {
      id: 3,
      borrower: "Green Valley Investors",
      principalAmount: 200000,
      interestRate: 10.0,
      term: "18 months",
      startDate: "Feb 2024",
      maturityDate: "Aug 2025",
      monthlyPayment: 12000,
      totalInterest: 30000,
      status: "pending",
      ltv: 75
    }
  ];

  const totalPrincipal = lendingPortfolio.reduce((sum, loan) => sum + loan.principalAmount, 0);
  const totalMonthlyIncome = lendingPortfolio
    .filter(loan => loan.status === "active")
    .reduce((sum, loan) => sum + loan.monthlyPayment, 0);
  const averageInterestRate = lendingPortfolio.reduce((sum, loan) => sum + loan.interestRate, 0) / lendingPortfolio.length;
  const totalExpectedInterest = lendingPortfolio.reduce((sum, loan) => sum + loan.totalInterest, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-success";
      case "pending": return "bg-warning";
      case "completed": return "bg-muted";
      default: return "bg-muted";
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Navigation />
      
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">Lending Portfolio</h1>
            <p className="text-muted-foreground">Private money lending investments and returns</p>
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
                <p className="text-xs text-muted-foreground">Outstanding loans</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalMonthlyIncome.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">From active loans</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Interest Rate</CardTitle>
                <Percent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{averageInterestRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">Weighted average</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Expected Interest</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalExpectedInterest.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Total return</p>
              </CardContent>
            </Card>
          </div>

          {/* Loan Details */}
          <Card>
            <CardHeader>
              <CardTitle>Active Loans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {lendingPortfolio.map((loan) => (
                  <div key={loan.id} className="border border-border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{loan.borrower}</h3>
                        <p className="text-muted-foreground">Loan #{loan.id}</p>
                      </div>
                      <Badge className={getStatusColor(loan.status)}>
                        {loan.status.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Principal Amount</p>
                        <p className="font-semibold">${loan.principalAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Interest Rate</p>
                        <p className="font-semibold">{loan.interestRate}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Monthly Payment</p>
                        <p className="font-semibold">${loan.monthlyPayment.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">LTV Ratio</p>
                        <p className="font-semibold">{loan.ltv}%</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Term</p>
                        <p className="font-medium">{loan.term}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Start Date</p>
                        <p className="font-medium">{loan.startDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Maturity Date</p>
                        <p className="font-medium">{loan.maturityDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Interest</p>
                        <p className="font-semibold text-success">${loan.totalInterest.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}