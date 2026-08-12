import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, Save, Download, Loader2 } from "lucide-react";
import { useDeals } from "@/hooks/useDeals";
import { useDealAnalyses } from "@/hooks/useDealAnalyses";

type Category = "location" | "condition" | "financial" | "risk";

interface DecisionCriterion {
  criterion: string;
  category: Category;
  weight: number;
  guidance: string;
  score: number;
  weightedScore: number;
}

const CATEGORY_LABELS: Record<Category, string> = {
  location: "Location",
  condition: "Condition",
  financial: "Financial",
  risk: "Risk",
};

const defaultCriteria: DecisionCriterion[] = [
  {
    criterion: "Location quality (neighborhood tier, school/crime trend, comps within 0.5–1.0 mi)",
    category: "location",
    weight: 8,
    guidance: "5=Top quartile for submarket; 3=Average; 1=Bottom quartile",
    score: 0,
    weightedScore: 0
  },
  {
    criterion: "Physical condition / effective age (structure, roof, MEPs)",
    category: "condition",
    weight: 6,
    guidance: "5=Turnkey/light; 3=Medium rehab; 1=Heavy/gut or major structural",
    score: 0,
    weightedScore: 0
  },
  {
    criterion: "Layout & unit functionality (bed/bath count, flow, parking)",
    category: "condition",
    weight: 4,
    guidance: "5=Optimal layouts & parking; 3=Serviceable; 1=Obsolete/awkward",
    score: 0,
    weightedScore: 0
  },
  {
    criterion: "Code/zoning/environmental risk (violations, flood, lead/asbestos)",
    category: "risk",
    weight: 4,
    guidance: "5=None/cleared; 3=Minor; 1=Material unresolved",
    score: 0,
    weightedScore: 0
  },
  {
    criterion: "Value-add scope clarity (SOW defined, permits path, contingency)",
    category: "condition",
    weight: 5,
    guidance: "5=Detailed SOW, permits simple; 3=Some ambiguity; 1=Unclear/high risk",
    score: 0,
    weightedScore: 0
  },
  {
    criterion: "Exit flexibility (sell, refi, rent—multiple viable paths)",
    category: "financial",
    weight: 3,
    guidance: "5=3 exits viable; 3=2 exits; 1=single exit high risk",
    score: 0,
    weightedScore: 0
  },
  {
    criterion: "Tax/insurance stability (reassessment risk, carrier availability)",
    category: "risk",
    weight: 5,
    guidance: "5=Low volatility; 3=Moderate; 1=High/unknown",
    score: 0,
    weightedScore: 0
  },
  {
    criterion: "All-in basis vs. stabilized value (LTC/LTV; % of ARV incl. capex)",
    category: "financial",
    weight: 8,
    guidance: "5<=70% of ARV; 3=71–78%; 1>=79%",
    score: 0,
    weightedScore: 0
  },
  {
    criterion: "DSCR (stabilized, amortizing) at current rates",
    category: "financial",
    weight: 7,
    guidance: "5>=1.35x; 3=1.25–1.34x; 1<1.25x",
    score: 0,
    weightedScore: 0
  },
  {
    criterion: "Cash buffer & liquidity after close (months of fixed costs)",
    category: "financial",
    weight: 5,
    guidance: "5>=6 months; 3=3–5 months; 1<3 months",
    score: 0,
    weightedScore: 0
  },
  {
    criterion: "Debt structure (term, rate risk, prepay, recourse)",
    category: "financial",
    weight: 5,
    guidance: "5=Fixed/limited recourse/favorable prepay; 3=mixed; 1=short/variable/recourse",
    score: 0,
    weightedScore: 0
  },
  {
    criterion: "Sensitivity resilience (rent -5% & rate +100 bps stress)",
    category: "risk",
    weight: 5,
    guidance: "5=Positive CF; 3=Breakeven; 1=Negative CF",
    score: 0,
    weightedScore: 0
  },
  {
    criterion: "Transaction costs & fees (points, lender fees, carry)",
    category: "financial",
    weight: 5,
    guidance: "5=Low; 3=Moderate; 1=High",
    score: 0,
    weightedScore: 0
  },
  {
    criterion: "Rent comps vs. HUD FMR/SAFMR & demand (DOM, absorption)",
    category: "location",
    weight: 7,
    guidance: "5=Market rents strong & ≥FMR; 3=at FMR; 1< FMR with weak demand",
    score: 0,
    weightedScore: 0
  },
  {
    criterion: "Vacancy & tenant pool quality (screening yield, income mix)",
    category: "location",
    weight: 6,
    guidance: "5=Deep pool; 3=Average; 1=Thin/problematic",
    score: 0,
    weightedScore: 0
  },
  {
    criterion: "Unit features vs. competition (W/D, AC, parking, finishes)",
    category: "condition",
    weight: 4,
    guidance: "5=Clearly superior; 3=Parity; 1=Inferior",
    score: 0,
    weightedScore: 0
  },
  {
    criterion: "Regulatory constraints (rent control, inspections cadence)",
    category: "risk",
    weight: 3,
    guidance: "5=None/light; 3=Moderate; 1=Heavy",
    score: 0,
    weightedScore: 0
  },
  {
    criterion: "Execution complexity (permits, trades availability, lead times)",
    category: "condition",
    weight: 5,
    guidance: "5=Low; 3=Moderate; 1=High",
    score: 0,
    weightedScore: 0
  },
  {
    criterion: "Distance/logistics & management intensity",
    category: "location",
    weight: 5,
    guidance: "5=Near base/low touch; 3=manageable; 1=far/high touch",
    score: 0,
    weightedScore: 0
  }
];

function scoreLabel(percentage: number) {
  if (percentage >= 80) return "Excellent";
  if (percentage >= 60) return "Good";
  if (percentage >= 40) return "Fair";
  return "Poor";
}

export function DecisionMatrix() {
  const [criteria, setCriteria] = useState<DecisionCriterion[]>(() =>
    defaultCriteria.map((item) => ({ ...item })),
  );
  const [selectedDealId, setSelectedDealId] = useState("");
  const [saving, setSaving] = useState(false);

  const { deals } = useDeals();
  const { dealAnalyses, addDealAnalysis } = useDealAnalyses();

  const updateScore = (index: number, score: number) => {
    setCriteria((prev) =>
      prev.map((item, i) => (i === index ? { ...item, score, weightedScore: score * item.weight } : item)),
    );
  };

  const updateWeight = (index: number, weight: number) => {
    setCriteria((prev) =>
      prev.map((item, i) => (i === index ? { ...item, weight, weightedScore: item.score * weight } : item)),
    );
  };

  const resetWeights = () => {
    setCriteria((prev) =>
      prev.map((item, index) => ({
        ...item,
        weight: defaultCriteria[index].weight,
        weightedScore: item.score * defaultCriteria[index].weight,
      })),
    );
  };

  const totalWeightedScore = criteria.reduce((sum, item) => sum + item.weightedScore, 0);
  const maxPossibleScore = criteria.reduce((sum, item) => sum + (item.weight * 5), 0);
  const scorePercentage = maxPossibleScore > 0 ? (totalWeightedScore / maxPossibleScore) * 100 : 0;

  const categoryScore = (category: Category) => {
    const items = criteria.filter((c) => c.category === category);
    const max = items.reduce((sum, c) => sum + c.weight * 5, 0);
    const total = items.reduce((sum, c) => sum + c.weightedScore, 0);
    return max > 0 ? (total / max) * 100 : 0;
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadge = (percentage: number) => {
    const label = scoreLabel(percentage);
    const styles: Record<string, string> = {
      Excellent: "bg-green-100 text-green-800",
      Good: "bg-yellow-100 text-yellow-800",
      Fair: "bg-orange-100 text-orange-800",
      Poor: "bg-red-100 text-red-800",
    };
    return <Badge className={styles[label]}>{label}</Badge>;
  };

  const selectedDeal = deals.find((d) => d.id === selectedDealId);
  const priorAnalyses = dealAnalyses
    .filter((a) => a.dealId === selectedDealId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleSave = async () => {
    if (!selectedDealId) return;
    setSaving(true);
    await addDealAnalysis({
      dealId: selectedDealId,
      locationScore: categoryScore("location"),
      conditionScore: categoryScore("condition"),
      financialScore: categoryScore("financial"),
      riskScore: categoryScore("risk"),
      totalScore: scorePercentage,
      recommendation: scoreLabel(scorePercentage),
      notes: JSON.stringify(criteria.map((c) => ({ criterion: c.criterion, weight: c.weight, score: c.score }))),
    });
    setSaving(false);
  };

  const handleExport = () => {
    const lines = [
      `Acquisition Decision Matrix`,
      selectedDeal ? `Deal: ${selectedDeal.title}` : "Deal: (none selected)",
      `Generated: ${new Date().toLocaleDateString()}`,
      ``,
      `Overall Score: ${scorePercentage.toFixed(1)}% (${scoreLabel(scorePercentage)})`,
      `Location: ${categoryScore("location").toFixed(1)}%`,
      `Condition: ${categoryScore("condition").toFixed(1)}%`,
      `Financial: ${categoryScore("financial").toFixed(1)}%`,
      `Risk: ${categoryScore("risk").toFixed(1)}%`,
      ``,
      `Criterion,Category,Weight,Score,Weighted Score`,
      ...criteria.map((c) => `"${c.criterion.replace(/"/g, '""')}",${CATEGORY_LABELS[c.category]},${c.weight},${c.score},${c.weightedScore}`),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `decision-matrix-${selectedDeal?.title.replace(/\s+/g, "-") || "export"}-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Acquisition Decision Matrix
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Score each criterion from 1-5, and adjust its weight (0-10) to match how much it matters for this deal
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={resetWeights}>
                Reset Weights
              </Button>
              <Button variant="outline" size="sm" onClick={handleSave} disabled={!selectedDealId || saving}>
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Save
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <label className="text-sm font-medium mb-2 block">Deal</label>
            <Select value={selectedDealId} onValueChange={setSelectedDealId}>
              <SelectTrigger className="max-w-md">
                <SelectValue placeholder={deals.length > 0 ? "Select a deal to score..." : "No deals yet"} />
              </SelectTrigger>
              <SelectContent>
                {deals.map((deal) => (
                  <SelectItem key={deal.id} value={deal.id}>
                    {deal.title}{deal.address ? ` — ${deal.address}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!selectedDealId && (
              <p className="text-xs text-muted-foreground mt-1">Select a deal to save this analysis against it.</p>
            )}
          </div>

          {priorAnalyses.length > 0 && (
            <div className="mb-6 p-4 border rounded-lg">
              <h4 className="font-medium mb-2 text-sm">Previous Scores for This Deal</h4>
              <div className="space-y-1">
                {priorAnalyses.map((a) => (
                  <div key={a.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {new Date(a.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    <span>
                      {a.totalScore?.toFixed(1)}% — {a.recommendation}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6 p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Overall Score</h3>
                <p className="text-sm text-muted-foreground">
                  {totalWeightedScore} / {maxPossibleScore} points
                </p>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold ${getScoreColor(scorePercentage)}`}>
                  {scorePercentage.toFixed(1)}%
                </div>
                {getScoreBadge(scorePercentage)}
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-border/50">
              {(Object.keys(CATEGORY_LABELS) as Category[]).map((cat) => (
                <div key={cat} className="text-center">
                  <div className="text-xs text-muted-foreground">{CATEGORY_LABELS[cat]}</div>
                  <div className={`font-semibold ${getScoreColor(categoryScore(cat))}`}>
                    {categoryScore(cat).toFixed(0)}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Criterion</th>
                  <th className="text-center p-3 font-medium w-20">Weight</th>
                  <th className="text-left p-3 font-medium">Scoring Guidance</th>
                  <th className="text-center p-3 font-medium w-24">Score</th>
                  <th className="text-center p-3 font-medium w-28">Weighted Score</th>
                </tr>
              </thead>
              <tbody>
                {criteria.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="p-3">
                      <div className="font-medium text-sm">{item.criterion}</div>
                    </td>
                    <td className="p-3 text-center">
                      <Input
                        type="number"
                        min={0}
                        max={10}
                        value={item.weight}
                        onChange={(e) => updateWeight(index, Math.max(0, Math.min(10, parseInt(e.target.value) || 0)))}
                        className="w-16 text-center mx-auto"
                      />
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      {item.guidance}
                    </td>
                    <td className="p-3 text-center">
                      <select
                        value={item.score}
                        onChange={(e) => updateScore(index, parseInt(e.target.value))}
                        className="w-16 p-1 border rounded text-center"
                      >
                        <option value={0}>-</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                      </select>
                    </td>
                    <td className="p-3 text-center font-medium">
                      {item.weightedScore}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium mb-2">Decision Thresholds</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="font-medium text-green-600">80%+ Excellent</div>
                <div className="text-muted-foreground">Strong acquisition candidate</div>
              </div>
              <div>
                <div className="font-medium text-yellow-600">60-79% Good</div>
                <div className="text-muted-foreground">Proceed with caution</div>
              </div>
              <div>
                <div className="font-medium text-orange-600">40-59% Fair</div>
                <div className="text-muted-foreground">Requires improvement</div>
              </div>
              <div>
                <div className="font-medium text-red-600">&lt;40% Poor</div>
                <div className="text-muted-foreground">Avoid or restructure</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
