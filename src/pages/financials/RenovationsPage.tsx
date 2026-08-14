import { useMemo } from "react";
import { RenovationExpenses } from "@/components/financials/RenovationExpenses";
import { TimePeriodDropdown } from "@/components/ui/time-period-dropdown";
import { useTimePeriod, getDateRange } from "@/contexts/TimePeriodContext";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import { useRenovationItems } from "@/hooks/useRenovationItems";

export default function RenovationsPage() {
  const { timePeriod, setTimePeriod } = useTimePeriod();
  const { projects } = useProjects();
  const { renovationItems } = useRenovationItems();
  const dateRange = useMemo(() => getDateRange(timePeriod), [timePeriod]);

  const downloadRenovationReport = () => {
    const totalBudget = projects.reduce((sum, p) => sum + (p.budget ?? 0), 0);
    const totalActual = projects.reduce((sum, p) => sum + (p.actualCost ?? 0), 0);
    const variance = totalBudget > 0 ? ((totalActual - totalBudget) / totalBudget) * 100 : 0;

    const reportData = `Renovation Expenses Report - ${new Date().toLocaleDateString()}

SUMMARY
-------
Total Budget: $${totalBudget.toLocaleString()}
Total Actual Costs: $${totalActual.toLocaleString()}
Budget Variance: ${variance > 0 ? "+" : ""}${variance.toFixed(1)}%
Active Projects: ${projects.filter((p) => p.status === "in_progress").length}

PROJECT BREAKDOWN
-----------------
${projects
  .map(
    (p) =>
      `${p.name}\nStatus: ${p.status}\nBudget: $${(p.budget ?? 0).toLocaleString()} | Actual: $${(p.actualCost ?? 0).toLocaleString()}`,
  )
  .join("\n\n")}

RENOVATION ITEMS
----------------
${renovationItems
  .map(
    (i) =>
      `${i.category}: Estimated $${i.estimatedCost.toLocaleString()}${i.actualCost != null ? ` | Actual $${i.actualCost.toLocaleString()}` : ""}`,
  )
  .join("\n")}

Report generated on ${new Date().toLocaleString()}
`;

    const blob = new Blob([reportData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `renovation-expenses-report-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Renovation Expenses</h1>
              <p className="text-muted-foreground">Track budget vs actual costs and timeline performance</p>
            </div>
            <div className="flex gap-3">
              <TimePeriodDropdown value={timePeriod} onValueChange={setTimePeriod} />
              <Button variant="outline" className="gap-2" onClick={downloadRenovationReport}>
                <Download className="h-4 w-4" />
                Download Report
              </Button>
            </div>
          </div>

          <RenovationExpenses dateRange={dateRange} />
        </div>
      </main>
  );
}
