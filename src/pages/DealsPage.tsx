import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DecisionMatrix } from "@/components/deals/DecisionMatrix";
import { DealsPipelineBoard } from "@/components/deals/DealsPipelineBoard";
import { useDeals } from "@/hooks/useDeals";
import { TrendingUp, DollarSign, Calculator, Loader2 } from "lucide-react";

const DealsPage = () => {
  const { deals, isLoading } = useDeals();

  const activeDeals = deals.filter((d) => d.stage !== "closed" && d.stage !== "dead");

  const purchaseVolume = activeDeals.reduce(
    (sum, d) => sum + (d.offer_price || d.asking_price || 0),
    0,
  );

  const dealsWithProfit = activeDeals.filter((d) => d.expected_profit != null);
  const averageSpread =
    dealsWithProfit.length > 0
      ? dealsWithProfit.reduce((sum, d) => sum + (d.expected_profit || 0), 0) / dealsWithProfit.length
      : 0;

  const dealsWithROI = activeDeals.filter(
    (d) => d.expected_profit != null && (d.offer_price || d.asking_price),
  );
  const averageROI =
    dealsWithROI.length > 0
      ? dealsWithROI.reduce((sum, d) => {
          const cost = (d.offer_price || d.asking_price || 0) + (d.rehab_estimate || 0);
          return cost > 0 ? sum + ((d.expected_profit || 0) / cost) * 100 : sum;
        }, 0) / dealsWithROI.length
      : 0;

  return (
    <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Acquisition & Pipeline Dashboard
              </h1>
              <p className="text-muted-foreground">
                Track deal pipeline, auto-calculated metrics, and KPIs
              </p>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card variant="glass">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Deals
                </CardTitle>
                <div className="p-2 rounded-lg gold-gradient">
                  <TrendingUp className="h-4 w-4 text-accent-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                ) : (
                  <div className="text-2xl font-bold text-accent">{activeDeals.length}</div>
                )}
              </CardContent>
            </Card>

            <Card variant="glass">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pipeline Purchase Volume
                </CardTitle>
                <div className="p-2 rounded-lg gold-gradient">
                  <DollarSign className="h-4 w-4 text-accent-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                ) : (
                  <div className="text-2xl font-bold text-success-light">
                    ${purchaseVolume.toLocaleString()}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card variant="glass">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Average Spread
                </CardTitle>
                <div className="p-2 rounded-lg gold-gradient">
                  <Calculator className="h-4 w-4 text-accent-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                ) : (
                  <div className="text-2xl font-bold text-accent">
                    ${Math.round(averageSpread).toLocaleString()}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card variant="glass">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Average ROI
                </CardTitle>
                <div className="p-2 rounded-lg gold-gradient">
                  <TrendingUp className="h-4 w-4 text-accent-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                ) : (
                  <div className="text-2xl font-bold text-accent">{averageROI.toFixed(1)}%</div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Deals Tabs */}
          <Tabs defaultValue="pipeline" className="w-full">
            <TabsList className="grid w-full grid-cols-2 glass-card">
              <TabsTrigger value="pipeline" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground text-muted-foreground">Deal Pipeline</TabsTrigger>
              <TabsTrigger value="decision-matrix" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground text-muted-foreground">Decision Matrix</TabsTrigger>
            </TabsList>

            <TabsContent value="pipeline" className="space-y-4">
              <DealsPipelineBoard />
            </TabsContent>

            <TabsContent value="decision-matrix">
              <DecisionMatrix />
            </TabsContent>
          </Tabs>
        </div>
      </main>
  );
};

export default DealsPage;
