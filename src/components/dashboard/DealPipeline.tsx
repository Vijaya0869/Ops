import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Briefcase } from "lucide-react";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { Deal } from "@/types/deal";

const stageLabels: Record<string, string> = {
  lead: "Leads",
  analyzing: "Analyzing",
  offer_made: "Offer Made",
  under_contract: "Under Contract",
  due_diligence: "Due Diligence",
  closed: "Closed",
  dead: "Dead"
};

const stageOrder = ["lead", "analyzing", "offer_made", "under_contract", "due_diligence", "closed"];

export function DealPipeline() {
  const { deals, loading } = useDashboardData();

  if (loading) {
    return (
      <Card variant="glass">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-foreground">Deal Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-48 bg-panel" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Filter out dead deals and group by stage
  const activeDeals = deals.filter(d => d.stage !== 'dead');
  const groupedDeals = activeDeals.reduce((acc, deal) => {
    if (!acc[deal.stage]) acc[deal.stage] = [];
    acc[deal.stage].push(deal);
    return acc;
  }, {} as Record<string, Deal[]>);

  return (
    <Card variant="glass">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-foreground">Deal Pipeline</CardTitle>
        <Link to="/deals/pipeline">
          <Button size="sm" variant="gold">
            <Plus className="h-4 w-4 mr-2" />
            Add Deal
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {activeDeals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {stageOrder.map((stage) => (
              <div key={stage} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm text-foreground">{stageLabels[stage]}</h3>
                  <Badge className="text-xs bg-accent/15 text-accent border-accent/40">
                    {groupedDeals[stage]?.length || 0}
                  </Badge>
                </div>
                <div className="space-y-2 min-h-[100px]">
                  {groupedDeals[stage]?.slice(0, 3).map((deal) => (
                    <div
                      key={deal.id}
                      className="p-3 border border-border rounded-lg bg-panel hover:bg-panel-raised hover:border-accent/50 transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm text-foreground truncate" title={deal.title}>
                          {deal.title}
                        </span>
                        <Link to={`/deals/pipeline`}>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-accent hover:bg-panel-raised">
                            <Eye className="h-3 w-3" />
                          </Button>
                        </Link>
                      </div>
                      {deal.address && (
                        <p className="text-xs text-muted-foreground mb-2 truncate">{deal.address}</p>
                      )}
                      <div className="space-y-1 text-xs text-muted-foreground">
                        {deal.asking_price && (
                          <div className="flex justify-between">
                            <span>Asking:</span>
                            <span className="font-medium text-foreground">${deal.asking_price.toLocaleString()}</span>
                          </div>
                        )}
                        {deal.arv && (
                          <div className="flex justify-between">
                            <span>ARV:</span>
                            <span className="font-medium text-accent">${deal.arv.toLocaleString()}</span>
                          </div>
                        )}
                        {deal.expected_profit && (
                          <div className="flex justify-between">
                            <span>Profit:</span>
                            <span className="font-medium text-success">${deal.expected_profit.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {(groupedDeals[stage]?.length || 0) > 3 && (
                    <p className="text-xs text-muted-foreground text-center">
                      +{(groupedDeals[stage]?.length || 0) - 3} more
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No active deals in your pipeline</p>
            <p className="text-sm">Add deals to track your pipeline</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
