import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calculator, Save, Download } from "lucide-react";

interface DecisionCriterion {
  criterion: string;
  weight: number;
  guidance: string;
  score: number;
  weightedScore: number;
}

const defaultCriteria: DecisionCriterion[] = [
  {
    criterion: "Location quality (neighborhood tier, school/crime trend, comps within 0.5–1.0 mi)",
    weight: 8,
    guidance: "5=Top quartile for submarket; 3=Average; 1=Bottom quartile",
    score: 0,
    weightedScore: 0
  },
  {
    criterion: "Physical condition / effective age (structure, roof, MEPs)",
    weight: 6,
    guidance: "5=Turnkey/light; 3=Medium rehab; 1=Heavy/gut or major structural",
    score: 0,
    weightedScore: 0
  },
  {
    criterion: "Layout & unit functionality (bed/bath count, flow, parking)",
    weight: 4,
    guidance: "5=Optimal layouts & parking; 3=Serviceable; 1=Obsolete/awkward",
    score: 0,
    weightedScore: 0
  },
  {
    criterion: "Code/zoning/environmental risk (violations, flood, lead/asbestos)",
    weight: 4,
    guidance: "5=None/cleared; 3=Minor; 1=Material unresolved",
    score: 0,
    weightedScore: 0
  },
  {
    criterion: "Value-add scope clarity (SOW defined, permits path, contingency)",
    weight: 5,
    guidance: "5=Detailed SOW, permits simple; 3=Some ambiguity; 1=Unclear/high risk",
    score: 0,
    weightedScore: 0
  },
  {
    criterion: "Exit flexibility (sell, refi, rent—multiple viable paths)",
    weight: 3,
    guidance: "5=3 exits viable; 3=2 exits; 1=single exit high risk",
    score: 0,
    weightedScore: 0
  },
  {
    criterion: "Tax/insurance stability (reassessment risk, carrier availability)",
    weight: 5,
    guidance: "5=Low volatility; 3=Moderate; 1=High/unknown",
    score: 0,
    weightedScore: 0
  },
  {
    criterion: "All-in basis vs. stabilized value (LTC/LTV; % of ARV incl. capex)",
    weight: 8,
    guidance: "5<=70% of ARV; 3=71–78%; 1>=79%",
    score: 0,
    weightedScore: 0
  },
  {
    criterion: "DSCR (stabilized, amortizing) at current rates",
    weight: 7,
    guidance: "5>=1.35x; 3=1.25–1.34x; 1<1.25x",
    score: 0,
    weightedScore: 0
  },
  {
    criterion: "Cash buffer & liquidity after close (months of fixed costs)",
    weight: 5,
    guidance: "5>=6 months; 3=3–5 months; 1<3 months",
    score: 0,
    weightedScore: 0
  },
  {
    criterion: "Debt structure (term, rate risk, prepay, recourse)",
    weight: 5,
    guidance: "5=Fixed/limited recourse/favorable prepay; 3=mixed; 1=short/variable/recourse",
    score: 0,
    weightedScore: 0
  },
  {
    criterion: "Sensitivity resilience (rent -5% & rate +100 bps stress)",
    weight: 5,
    guidance: "5=Positive CF; 3=Breakeven; 1=Negative CF",
    score: 0,
    weightedScore: 0
  },
  {
    criterion: "Transaction costs & fees (points, lender fees, carry)",
    weight: 5,
    guidance: "5=Low; 3=Moderate; 1=High",
    score: 0,
    weightedScore: 0
  },
  {
    criterion: "Rent comps vs. HUD FMR/SAFMR & demand (DOM, absorption)",
    weight: 7,
    guidance: "5=Market rents strong & ≥FMR; 3=at FMR; 1< FMR with weak demand",
    score: 0,
    weightedScore: 0
  },
  {
    criterion: "Vacancy & tenant pool quality (screening yield, income mix)",
    weight: 6,
    guidance: "5=Deep pool; 3=Average; 1=Thin/problematic",
    score: 0,
    weightedScore: 0
  },
  {
    criterion: "Unit features vs. competition (W/D, AC, parking, finishes)",
    weight: 4,
    guidance: "5=Clearly superior; 3=Parity; 1=Inferior",
    score: 0,
    weightedScore: 0
  },
  {
    criterion: "Regulatory constraints (rent control, inspections cadence)",
    weight: 3,
    guidance: "5=None/light; 3=Moderate; 1=Heavy",
    score: 0,
    weightedScore: 0
  },
  {
    criterion: "Execution complexity (permits, trades availability, lead times)",
    weight: 5,
    guidance: "5=Low; 3=Moderate; 1=High",
    score: 0,
    weightedScore: 0
  },
  {
    criterion: "Distance/logistics & management intensity",
    weight: 5,
    guidance: "5=Near base/low touch; 3=manageable; 1=far/high touch",
    score: 0,
    weightedScore: 0
  }
];

export function DecisionMatrix() {
  const [criteria, setCriteria] = useState<DecisionCriterion[]>(defaultCriteria);
  const [propertyAddress, setPropertyAddress] = useState("");

  const updateScore = (index: number, score: number) => {
    const newCriteria = [...criteria];
    newCriteria[index].score = score;
    newCriteria[index].weightedScore = score * newCriteria[index].weight;
    setCriteria(newCriteria);
  };

  const totalWeightedScore = criteria.reduce((sum, item) => sum + item.weightedScore, 0);
  const maxPossibleScore = criteria.reduce((sum, item) => sum + (item.weight * 5), 0);
  const scorePercentage = maxPossibleScore > 0 ? (totalWeightedScore / maxPossibleScore) * 100 : 0;

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadge = (percentage: number) => {
    if (percentage >= 80) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
    if (percentage >= 60) return <Badge className="bg-yellow-100 text-yellow-800">Good</Badge>;
    if (percentage >= 40) return <Badge className="bg-orange-100 text-orange-800">Fair</Badge>;
    return <Badge className="bg-red-100 text-red-800">Poor</Badge>;
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
                Score each criterion from 1-5 to evaluate property acquisition potential
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <label className="text-sm font-medium mb-2 block">Property Address</label>
            <Input
              placeholder="Enter property address..."
              value={propertyAddress}
              onChange={(e) => setPropertyAddress(e.target.value)}
              className="max-w-md"
            />
          </div>

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
                      <Badge variant="outline">{item.weight}</Badge>
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