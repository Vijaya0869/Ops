import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calculator, DollarSign, FileSpreadsheet, Receipt, TrendingDown, Target } from "lucide-react";

const CostControlPage = () => {
  useEffect(() => {
    document.title = "Cost Control | Playbooks";
    const meta = document.querySelector('meta[name="description"]') || document.createElement("meta");
    meta.setAttribute("name", "description");
    meta.setAttribute("content", "Cost control playbook: budgeting, tracking, change orders, reporting.");
    if (!meta.parentNode) document.head.appendChild(meta);
  }, []);

  return (
    <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Calculator className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Cost Control</h1>
                <p className="text-muted-foreground">Budget planning, cost tracking, and financial controls for projects</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary">Budgeting</Badge>
              <Badge variant="secondary">Tracking</Badge>
              <Badge variant="secondary">Reporting</Badge>
            </div>
          </div>

          {/* Budget Planning */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Budget Planning
              </CardTitle>
              <CardDescription>Establish reliable budgets and contingencies</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2 text-sm text-foreground">
                <li>Use scope-based estimates with unit costs and productivity assumptions.</li>
                <li>Include contingency (5–10%) and escalation assumptions per market data.</li>
                <li>Baseline the budget with version control and approval records.</li>
              </ul>
            </CardContent>
          </Card>

          {/* Cost Tracking */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Cost Tracking
              </CardTitle>
              <CardDescription>Keep actuals and commitments visible</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="list-disc pl-5 space-y-2 text-sm text-foreground">
                <li>Track committed vs. actual costs; reconcile weekly with invoices and POs.</li>
                <li>Maintain a change order log with status, cost impact, and approvals.</li>
                <li>Forecast EAC (Estimate at Completion) by cost code each month.</li>
              </ul>
            </CardContent>
          </Card>

          {/* Reporting */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5" />
                Reporting & KPIs
              </CardTitle>
              <CardDescription>Make financial health transparent</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border text-center">
                  <DollarSign className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h4 className="font-semibold text-foreground mb-1">Cost Variance</h4>
                  <p className="text-xs text-muted-foreground">CV = Budget - Actual</p>
                </div>
                <div className="p-4 rounded-lg border text-center">
                  <TrendingDown className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h4 className="font-semibold text-foreground mb-1">Forecast Variance</h4>
                  <p className="text-xs text-muted-foreground">FV = Budget - EAC</p>
                </div>
                <div className="p-4 rounded-lg border text-center">
                  <Calculator className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h4 className="font-semibold text-foreground mb-1">Cost Performance</h4>
                  <p className="text-xs text-muted-foreground">Track burn rate by cost code</p>
                </div>
              </div>
              <Separator />
              <p className="text-sm text-muted-foreground">Automate exports to your finance tool weekly to keep numbers aligned.</p>
            </CardContent>
          </Card>
        </div>
      </main>
  );
};

export default CostControlPage;
