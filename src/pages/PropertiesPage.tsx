import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Building, 
  MapPin, 
  DollarSign,
  Calendar,
  Users,
  Plus,
  Eye,
  TrendingUp
} from "lucide-react";
import { PropertyFormDialog } from "@/components/properties/PropertyFormDialog";
import { useProperties } from "@/hooks/useProperties";
import { useDashboardData } from "@/hooks/useDashboardData";
import { PropertyFormData } from "@/types/property";

const PropertiesPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { properties, loading: isLoading, addProperty } = useProperties();
  const { metrics } = useDashboardData();

  const totalProperties = properties.length;
  // Portfolio value and equity: combined ARV of owned properties, minus their
  // current loan balance. Sourced from useDashboardData so this matches the
  // same figures shown on the main Dashboard instead of recomputing them
  // (and previously diverging) here.
  const totalValue = metrics.portfolioValue;
  const totalEquity = metrics.totalEquity;
  const totalCashFlow = properties.reduce((sum, prop) => sum + ((prop.monthly_rent || 0) - (prop.monthly_expenses || 0)), 0);
  const rentalProperties = properties.filter(p => p.status === "rental");
  
  const annualCashFlow = totalCashFlow * 12;
  const averageROE = totalEquity > 0 ? (annualCashFlow / totalEquity) * 100 : 0;

  const handleCreateProperty = async (data: Partial<PropertyFormData>) => {
    return await addProperty(data);
  };

  return (
    <>
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Property Portfolio
              </h1>
              <p className="text-muted-foreground">
                Manage your real estate investments and rental properties
              </p>
            </div>
            <Button variant="gold" onClick={() => setIsFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Button>
          </div>

          {/* Portfolio KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <Card variant="glass">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Properties
                </CardTitle>
                <div className="p-2 rounded-lg gold-gradient">
                  <Building className="h-4 w-4 text-accent-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent">{totalProperties}</div>
                <p className="text-xs text-success-light mt-1">+2 this quarter</p>
              </CardContent>
            </Card>

            <Card variant="glass">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Portfolio Value
                </CardTitle>
                <div className="p-2 rounded-lg gold-gradient">
                  <DollarSign className="h-4 w-4 text-accent-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success-light">
                  ${totalValue.toLocaleString()}
                </div>
                <p className="text-xs text-success-light mt-1">+8.2% this year</p>
              </CardContent>
            </Card>

            <Card variant="glass">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Equity
                </CardTitle>
                <div className="p-2 rounded-lg gold-gradient">
                  <DollarSign className="h-4 w-4 text-accent-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent">
                  ${totalEquity.toLocaleString()}
                </div>
                <p className="text-xs text-success-light mt-1">Built equity</p>
              </CardContent>
            </Card>

            <Card variant="glass">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Monthly Cash Flow
                </CardTitle>
                <div className="p-2 rounded-lg gold-gradient">
                  <TrendingUp className="h-4 w-4 text-accent-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success-light">
                  ${totalCashFlow.toLocaleString()}
                </div>
                <p className="text-xs text-success-light mt-1">From {rentalProperties.length} rentals</p>
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
                <div className="text-2xl font-bold text-accent">{metrics.averageROI.toFixed(1)}%</div>
                <p className="text-xs text-success-light mt-1">
                  {metrics.averageROI > 0 ? "From sold properties" : "No sales yet"}
                </p>
              </CardContent>
            </Card>

            <Card variant="glass">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Average ROE
                </CardTitle>
                <div className="p-2 rounded-lg gold-gradient">
                  <TrendingUp className="h-4 w-4 text-accent-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success-light">
                  {averageROE.toFixed(1)}%
                </div>
                <p className="text-xs text-success-light mt-1">Return on equity</p>
              </CardContent>
            </Card>
          </div>

          {/* Property List */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="text-foreground">Property Details</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center text-muted-foreground py-8">Loading properties...</div>
              ) : properties.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No properties yet. Click "Add Property" to get started.
                </div>
              ) : (
                <div className="space-y-4">
                  {properties.map((property) => (
                    <div key={property.id} className="p-4 border border-border rounded-lg bg-panel hover:bg-panel-raised transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="font-semibold text-foreground">{property.address}</span>
                            {property.property_type && (
                              <Badge variant="outline" className="bg-accent/15 text-accent border-accent/40">
                                {property.property_type.toUpperCase()}
                              </Badge>
                            )}
                            <Badge variant="outline" className="border-border text-muted-foreground">
                              {property.status?.replace("_", " ").toUpperCase() || "LEAD"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            {property.acquisition_date && (
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Acquired: {property.acquisition_date}
                              </span>
                            )}
                            <span>{property.city}, {property.state}</span>
                          </div>
                        </div>
                        <Button variant="glass-outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Purchase Price</div>
                          <div className="font-semibold text-foreground">
                            ${(property.purchase_price || 0).toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">ARV</div>
                          <div className="font-semibold text-success-light">
                            ${(property.arv || 0).toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Rehab Budget</div>
                          <div className="font-semibold text-accent">
                            ${(property.rehab_budget || 0).toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Loan Amount</div>
                          <div className="font-semibold text-foreground">
                            ${(property.loan_amount || 0).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      {property.status === "rental" && (property.monthly_rent || property.monthly_expenses) && (
                        <div className="mt-4 pt-4 border-t border-border">
                          <h4 className="font-medium mb-2 flex items-center gap-2 text-foreground">
                            <Users className="h-4 w-4 text-accent" />
                            Rental Information
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <div className="text-muted-foreground">Monthly Rent</div>
                              <div className="font-medium text-success-light">
                                ${(property.monthly_rent || 0).toLocaleString()}
                              </div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Monthly Expenses</div>
                              <div className="font-medium text-foreground">
                                ${(property.monthly_expenses || 0).toLocaleString()}
                              </div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Net Cash Flow</div>
                              <div className="font-medium text-success-light">
                                ${((property.monthly_rent || 0) - (property.monthly_expenses || 0)).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <PropertyFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleCreateProperty}
      />
    </>
  );
};

export default PropertiesPage;