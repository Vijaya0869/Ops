import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, DollarSign, TrendingUp, Calendar } from "lucide-react";

export default function RentalsPage() {
  // Mock data - will be replaced with real data connections
  const rentalProperties = [
    {
      id: 1,
      address: "123 Main St, Springfield",
      monthlyRent: 2500,
      occupancyRate: 100,
      lastRentIncrease: "Jan 2024",
      tenantName: "Johnson Family",
      leaseEnd: "Dec 2024",
      status: "occupied"
    },
    {
      id: 2,
      address: "456 Oak Ave, Downtown",
      monthlyRent: 3200,
      occupancyRate: 100,
      lastRentIncrease: "Mar 2024",
      tenantName: "Smith LLC",
      leaseEnd: "Aug 2025",
      status: "occupied"
    },
    {
      id: 3,
      address: "789 Pine Rd, Suburbs",
      monthlyRent: 1800,
      occupancyRate: 0,
      lastRentIncrease: "N/A",
      tenantName: "N/A",
      leaseEnd: "N/A",
      status: "vacant"
    }
  ];

  const totalMonthlyRent = rentalProperties
    .filter(p => p.status === "occupied")
    .reduce((sum, p) => sum + p.monthlyRent, 0);
  
  const avgOccupancyRate = rentalProperties
    .reduce((sum, p) => sum + p.occupancyRate, 0) / rentalProperties.length;

  const totalAnnualRent = totalMonthlyRent * 12;

  return (
    <div className="flex h-screen bg-background">
      <Navigation />
      
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
                <p className="text-xs text-muted-foreground">Current month</p>
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
                <p className="text-xs text-muted-foreground">Average rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Property Details */}
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {rentalProperties.map((property) => (
                  <div key={property.id} className="border border-border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{property.address}</h3>
                        <p className="text-muted-foreground">Property #{property.id}</p>
                      </div>
                      <Badge 
                        variant={property.status === "occupied" ? "default" : "destructive"}
                        className={property.status === "occupied" ? "bg-success" : ""}
                      >
                        {property.status.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Monthly Rent</p>
                        <p className="font-semibold">${property.monthlyRent.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Occupancy</p>
                        <p className="font-semibold">{property.occupancyRate}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Current Tenant</p>
                        <p className="font-semibold">{property.tenantName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Lease End</p>
                        <p className="font-semibold">{property.leaseEnd}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2 border-t border-border">
                      <div>
                        <p className="text-sm text-muted-foreground">Last Rent Increase</p>
                        <p className="font-medium">{property.lastRentIncrease}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Annual Income</p>
                        <p className="font-semibold text-success">
                          ${(property.monthlyRent * 12 * (property.occupancyRate / 100)).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}