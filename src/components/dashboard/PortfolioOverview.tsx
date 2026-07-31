import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, MapPin, DollarSign, Calendar, Home } from "lucide-react";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";

const statusColors: Record<string, string> = {
  lead: "bg-blue-500/20 text-blue-400 border-blue-400/30",
  under_contract: "bg-orange-500/20 text-orange-400 border-orange-400/30",
  owned: "bg-secondary text-muted-foreground border-border",
  in_rehab: "bg-warning/15 text-warning border-amber-400/30",
  listed: "bg-pink-500/20 text-pink-400 border-pink-400/30",
  sold: "bg-success/15 text-success border-success/40",
  rental: "bg-accent/15 text-accent border-accent/40",
};

const formatStatus = (status: string) => {
  return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export function PortfolioOverview() {
  const { properties, loading } = useDashboardData();

  if (loading) {
    return (
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <div className="p-2 rounded-lg bg-accent/15">
              <Building className="h-5 w-5 text-accent" />
            </div>
            Portfolio Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 bg-panel" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const displayProperties = properties.slice(0, 5);

  return (
    <Card variant="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <div className="p-2 rounded-lg bg-accent/15">
            <Building className="h-5 w-5 text-accent" />
          </div>
          Portfolio Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        {displayProperties.length > 0 ? (
          <div className="grid gap-4">
            {displayProperties.map((property) => (
              <div
                key={property.id}
                className="p-4 border border-border rounded-lg bg-panel hover:bg-panel-raised hover:border-accent/50 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="h-4 w-4 text-accent" />
                      <span className="font-medium text-foreground">{property.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {property.city && <span>{property.city}</span>}
                      {property.state && <span>, {property.state}</span>}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Badge className={`text-xs ${statusColors[property.status || 'lead']}`}>
                        {formatStatus(property.status || 'lead')}
                      </Badge>
                      {property.property_type && (
                        <Badge variant="outline" className="text-xs border-border text-muted-foreground">
                          {property.property_type}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-muted-foreground">Value</div>
                      <div className="font-semibold text-accent">
                        ${(property.arv || property.purchase_price || 0).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  {property.monthly_rent && property.monthly_rent > 0 && (
                    <div className="flex items-center gap-2">
                      <Home className="h-4 w-4 text-success" />
                      <div>
                        <div className="text-muted-foreground">Monthly Rent</div>
                        <div className="font-semibold text-success">
                          ${property.monthly_rent.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  )}

                  {property.purchase_price && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-muted-foreground">Purchase</div>
                        <div className="font-semibold text-foreground">
                          ${property.purchase_price.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-muted-foreground">Updated</div>
                      <div className="font-medium text-foreground">
                        {formatDistanceToNow(new Date(property.updated_at), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Building className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No properties in your portfolio yet</p>
            <p className="text-sm">Add properties to see them here</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
