import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, DollarSign, TrendingUp, Calendar, Loader2 } from "lucide-react";
import { useProperties } from "@/hooks/useProperties";
import { useTenants } from "@/hooks/useTenants";
import { useRentPayments } from "@/hooks/useRentPayments";

const PAYMENT_STATUS_STYLES: Record<string, string> = {
  paid: "bg-success/20 text-success-light",
  partial: "bg-accent/15 text-accent",
  late: "bg-destructive/20 text-destructive",
  missed: "bg-destructive/20 text-destructive",
};

export default function RentalsPage() {
  const { properties, loading: propertiesLoading } = useProperties();
  const { tenants, loading: tenantsLoading } = useTenants();
  const { rentPayments, loading: paymentsLoading } = useRentPayments();

  const loading = propertiesLoading || tenantsLoading || paymentsLoading;

  const rentalProperties = properties.filter((p) => p.status === "rental");
  const activeTenantFor = (propertyId: string) =>
    tenants.find((t) => t.propertyId === propertyId && t.status === "active");

  const latestPaymentFor = (tenantId: string) =>
    rentPayments
      .filter((p) => p.tenantId === tenantId)
      .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime())[0];

  const occupiedCount = rentalProperties.filter((p) => activeTenantFor(p.id)).length;
  const totalMonthlyRent = rentalProperties
    .filter((p) => activeTenantFor(p.id))
    .reduce((sum, p) => sum + (p.monthly_rent || 0), 0);
  const avgOccupancyRate = rentalProperties.length > 0 ? (occupiedCount / rentalProperties.length) * 100 : 0;
  const totalAnnualRent = totalMonthlyRent * 12;

  if (loading) {
    return (
      <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </main>
    );
  }

  return (
    <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">Rental Portfolio</h1>
            <p className="text-muted-foreground">Overview of all rental properties and performance</p>
          </div>

          {/* Portfolio Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
                <Home className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{rentalProperties.length}</div>
                <p className="text-xs text-muted-foreground">Active properties</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Rent</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalMonthlyRent.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">From occupied units</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Annual Income</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalAnnualRent.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Projected yearly</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgOccupancyRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">{occupiedCount} of {rentalProperties.length} occupied</p>
              </CardContent>
            </Card>
          </div>

          {/* Property Details */}
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
            </CardHeader>
            <CardContent>
              {rentalProperties.length === 0 ? (
                <p className="text-muted-foreground text-sm py-8 text-center">
                  No rental properties yet. Mark a property's status as "Rental" to see it here.
                </p>
              ) : (
                <div className="space-y-6">
                  {rentalProperties.map((property) => {
                    const tenant = activeTenantFor(property.id);
                    const occupied = !!tenant;
                    return (
                      <div key={property.id} className="border border-border rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">{property.address}</h3>
                            <p className="text-muted-foreground">{property.city}, {property.state}</p>
                          </div>
                          <Badge
                            variant={occupied ? "default" : "destructive"}
                            className={occupied ? "bg-success" : ""}
                          >
                            {occupied ? "OCCUPIED" : "VACANT"}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Monthly Rent</p>
                            <p className="font-semibold">${(property.monthly_rent || 0).toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Occupancy</p>
                            <p className="font-semibold">{occupied ? "100%" : "0%"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Current Tenant</p>
                            <p className="font-semibold">{tenant?.fullName || "N/A"}</p>
                            {tenant && latestPaymentFor(tenant.id) && (
                              <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${PAYMENT_STATUS_STYLES[latestPaymentFor(tenant.id)!.status]}`}>
                                Last payment: {latestPaymentFor(tenant.id)!.status}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Lease End</p>
                            <p className="font-semibold">
                              {tenant?.leaseEnd
                                ? new Date(tenant.leaseEnd).toLocaleDateString("en-US", { month: "short", year: "numeric" })
                                : "N/A"}
                            </p>
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-border">
                          <div>
                            <p className="text-sm text-muted-foreground">Lease Start</p>
                            <p className="font-medium">
                              {tenant?.leaseStart
                                ? new Date(tenant.leaseStart).toLocaleDateString("en-US", { month: "short", year: "numeric" })
                                : "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Annual Income</p>
                            <p className="font-semibold text-success">
                              ${occupied ? ((property.monthly_rent || 0) * 12).toLocaleString() : "0"}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
  );
}
