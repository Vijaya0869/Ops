import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { TimePeriod } from "@/components/ui/time-period-dropdown";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Hammer, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Calendar,
  TrendingUp,
  Target,
  DollarSign,
  Building
} from "lucide-react";

interface ConstructionSectionProps {
  timePeriod: TimePeriod;
}

export function ConstructionSection({ timePeriod }: ConstructionSectionProps) {
  const { metrics, loading } = useDashboardData();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 bg-panel" />
          ))}
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toFixed(0)}`;
  };

  // Calculate construction metrics
  const constructionProperties = metrics.activeConstructionProperties;
  const totalRehabBudget = constructionProperties.reduce((sum, p) => sum + (p.rehab_budget || 0), 0);
  const totalActualCost = constructionProperties.reduce((sum, p) => sum + (p.actual_rehab_cost || 0), 0);
  const budgetVariance = totalRehabBudget > 0 
    ? ((totalActualCost - totalRehabBudget) / totalRehabBudget) * 100 
    : 0;

  return (
    <div className="space-y-6">
      {/* Construction Overview KPIs */}
      <div>
        <h3 className="text-xl font-bold text-foreground mb-4">Construction Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Active Projects"
            value={metrics.constructionProjects}
            icon={Hammer}
            change={metrics.constructionProjects > 0 ? "In progress" : "No active projects"}
            changeType={metrics.constructionProjects > 0 ? "positive" : "neutral"}
          />
          <MetricCard
            title="Total Rehab Budget"
            value={formatCurrency(totalRehabBudget)}
            icon={DollarSign}
            change={totalRehabBudget > 0 ? "Allocated" : "No budget set"}
            changeType={totalRehabBudget > 0 ? "positive" : "neutral"}
          />
          <MetricCard
            title="Actual Spend"
            value={formatCurrency(totalActualCost)}
            icon={TrendingUp}
            change={totalActualCost > 0 ? "Spent to date" : "Not tracked"}
            changeType="neutral"
          />
          <MetricCard
            title="Budget Variance"
            value={`${budgetVariance >= 0 ? '+' : ''}${budgetVariance.toFixed(1)}%`}
            icon={Target}
            change={budgetVariance <= 0 ? "Under budget" : "Over budget"}
            changeType={budgetVariance <= 0 ? "positive" : "negative"}
          />
        </div>
      </div>

      {/* Project Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-foreground">Budget Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Budget</span>
                <span className="font-semibold text-foreground">{formatCurrency(totalRehabBudget)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Actual Spend</span>
                <span className={`font-semibold ${totalActualCost <= totalRehabBudget ? 'text-success' : 'text-destructive'}`}>
                  {formatCurrency(totalActualCost)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Remaining</span>
                <span className="font-semibold text-accent">
                  {formatCurrency(Math.max(0, totalRehabBudget - totalActualCost))}
                </span>
              </div>
              <hr className="border-border" />
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Avg Budget/Project</span>
                <span className="font-semibold text-foreground">
                  {formatCurrency(metrics.constructionProjects > 0 ? totalRehabBudget / metrics.constructionProjects : 0)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-foreground">Project Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Active Projects</span>
                <span className="font-semibold text-foreground">{metrics.constructionProjects}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Avg ARV</span>
                <span className="font-semibold text-success">
                  {formatCurrency(constructionProperties.reduce((sum, p) => sum + (p.arv || 0), 0) / Math.max(1, constructionProperties.length))}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Portfolio Value at Risk</span>
                <span className="font-semibold text-accent">
                  {formatCurrency(constructionProperties.reduce((sum, p) => sum + (p.purchase_price || 0) + (p.rehab_budget || 0), 0))}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Construction Projects */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="text-foreground">Active Construction Projects</CardTitle>
        </CardHeader>
        <CardContent>
          {constructionProperties.length > 0 ? (
            <div className="space-y-6">
              {constructionProperties.map((project) => {
                const budgetUsed = project.rehab_budget 
                  ? ((project.actual_rehab_cost || 0) / project.rehab_budget) * 100 
                  : 0;
                const isOverBudget = (project.actual_rehab_cost || 0) > (project.rehab_budget || 0);
                
                return (
                  <div key={project.id} className="p-4 border border-border rounded-lg bg-panel">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-foreground">{project.address}</h4>
                        <p className="text-sm text-muted-foreground">{project.city}, {project.state}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${isOverBudget ? 'text-destructive' : 'text-accent'}`}>
                          {Math.min(budgetUsed, 100).toFixed(0)}%
                        </p>
                        <p className="text-sm text-muted-foreground">Budget Used</p>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-panel rounded-full h-2 mb-4">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${isOverBudget ? 'bg-destructive' : 'bg-accent'}`}
                        style={{ width: `${Math.min(budgetUsed, 100)}%` }}
                      ></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Purchase Price</p>
                        <p className="font-semibold text-foreground">{formatCurrency(project.purchase_price || 0)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Rehab Budget</p>
                        <p className="font-semibold text-foreground">{formatCurrency(project.rehab_budget || 0)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Actual Cost</p>
                        <p className={`font-semibold ${isOverBudget ? 'text-destructive' : 'text-success'}`}>
                          {formatCurrency(project.actual_rehab_cost || 0)}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">ARV</p>
                        <p className="font-semibold text-accent">{formatCurrency(project.arv || 0)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Building className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No active construction projects</p>
              <p className="text-sm">Add properties with status "In Rehab" to track them here</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}