import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DecisionMatrix } from "@/components/deals/DecisionMatrix";
import { 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  MapPin,
  Plus,
  Eye,
  Calculator
} from "lucide-react";

// Enhanced deal data with all required metrics
interface Deal {
  id: string;
  address: string;
  stage: "leads" | "under-contract" | "closed";
  purchasePrice: number;
  arv: number;
  rehabBudget: number;
  mao: number; // Maximum Allowable Offer
  spread: number;
  roi: number;
  acquisitionDate: string;
  status: string;
}

const mockDeals: Deal[] = [
  {
    id: "1",
    address: "123 Oak Street, Dallas TX",
    stage: "leads",
    purchasePrice: 85000,
    arv: 120000,
    rehabBudget: 25000,
    mao: 78000,
    spread: 35000,
    roi: 32.5,
    acquisitionDate: "2024-01-15",
    status: "Under Review"
  },
  {
    id: "2", 
    address: "456 Pine Avenue, Austin TX",
    stage: "under-contract",
    purchasePrice: 92000,
    arv: 135000,
    rehabBudget: 28000,
    mao: 89000,
    spread: 43000,
    roi: 28.1,
    acquisitionDate: "2024-01-20",
    status: "Inspection Period"
  },
  {
    id: "3",
    address: "789 Maple Drive, Houston TX", 
    stage: "closed",
    purchasePrice: 78000,
    arv: 110000,
    rehabBudget: 22000,
    mao: 72000,
    spread: 32000,
    roi: 35.2,
    acquisitionDate: "2024-01-10",
    status: "Rehab Started"
  }
];

const DealsPage = () => {
  const totalDeals = mockDeals.length;
  const totalPurchaseVolume = mockDeals.reduce((sum, deal) => sum + deal.purchasePrice, 0);
  const averageSpread = mockDeals.reduce((sum, deal) => sum + deal.spread, 0) / totalDeals;
  const averageROI = mockDeals.reduce((sum, deal) => sum + deal.roi, 0) / totalDeals;

  return (
    <div className="flex min-h-screen purple-gradient">
      <Navigation />
      
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
            <Button variant="gold">
              <Plus className="h-4 w-4 mr-2" />
              Add New Deal
            </Button>
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
                <div className="text-2xl font-bold text-accent">{totalDeals}</div>
                <p className="text-xs text-success-light mt-1">+2 this month</p>
              </CardContent>
            </Card>

            <Card variant="glass">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Purchase Volume
                </CardTitle>
                <div className="p-2 rounded-lg gold-gradient">
                  <DollarSign className="h-4 w-4 text-accent-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success-light">
                  ${totalPurchaseVolume.toLocaleString()}
                </div>
                <p className="text-xs text-success-light mt-1">+15% this quarter</p>
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
                <div className="text-2xl font-bold text-accent">
                  ${Math.round(averageSpread).toLocaleString()}
                </div>
                <p className="text-xs text-success-light mt-1">+8.2% vs target</p>
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
                <div className="text-2xl font-bold text-accent">
                  {averageROI.toFixed(1)}%
                </div>
                <p className="text-xs text-success-light mt-1">Above 25% target</p>
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
              <Card variant="glass">
                <CardHeader>
                  <CardTitle className="text-foreground">Deal Pipeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockDeals.map((deal) => (
                      <div key={deal.id} className="p-4 border border-border rounded-lg bg-panel hover:bg-panel-raised transition-all">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="font-semibold text-foreground">{deal.address}</span>
                              <Badge variant="outline" className={
                                deal.stage === "leads" ? "bg-panel text-muted-foreground border-border" :
                                deal.stage === "under-contract" ? "bg-accent/15 text-accent border-accent/40" : "bg-success/20 text-success-light border-success/30"
                              }>
                                {deal.stage.replace("-", " ").toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{deal.status}</p>
                          </div>
                          <Button variant="glass-outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                          <div>
                            <div className="text-muted-foreground">Purchase Price</div>
                            <div className="font-semibold text-foreground">${deal.purchasePrice.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">ARV</div>
                            <div className="font-semibold text-foreground">${deal.arv.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Rehab Budget</div>
                            <div className="font-semibold text-foreground">${deal.rehabBudget.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">MAO</div>
                            <div className="font-semibold text-foreground">${deal.mao.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Spread</div>
                            <div className="font-semibold text-success-light">${deal.spread.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">ROI</div>
                            <div className="font-semibold text-accent">{deal.roi}%</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="decision-matrix">
              <DecisionMatrix />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default DealsPage;