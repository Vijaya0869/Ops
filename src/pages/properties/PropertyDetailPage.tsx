import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Property } from "@/types/property";
import { PropertyPhotoUpload } from "@/components/properties/PropertyPhotoUpload";
import { PropertyDocumentUpload } from "@/components/properties/PropertyDocumentUpload";
import { PropertyFormDialog } from "@/components/properties/PropertyFormDialog";
import { usePropertyPhotos } from "@/hooks/usePropertyPhotos";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Pencil,
  MapPin,
  Home,
  DollarSign,
  TrendingUp,
  Calendar,
  Loader2,
  Image,
  FileText,
  Calculator,
} from "lucide-react";

const statusColors: Record<string, string> = {
  lead: "bg-slate-500",
  under_contract: "bg-yellow-500",
  owned: "bg-blue-500",
  in_rehab: "bg-orange-500",
  listed: "bg-secondary",
  sold: "bg-green-500",
  rental: "bg-teal-500",
};

const statusLabels: Record<string, string> = {
  lead: "Lead",
  under_contract: "Under Contract",
  owned: "Owned",
  in_rehab: "In Rehab",
  listed: "Listed",
  sold: "Sold",
  rental: "Rental",
};

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { photos, fetchPhotos } = usePropertyPhotos(id || null);

  useEffect(() => {
    if (id) {
      fetchProperty();
      fetchPhotos();
    }
  }, [id]);

  const fetchProperty = async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        toast({
          title: "Not Found",
          description: "Property not found",
          variant: "destructive",
        });
        navigate("/properties/portfolio");
        return;
      }
      
      setProperty(data as Property);
    } catch (error: any) {
      console.error("Error fetching property:", error);
      toast({
        title: "Error",
        description: "Failed to load property",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (data: any) => {
    if (!property) return false;

    try {
      const { data: updated, error } = await supabase
        .from("properties")
        .update(data)
        .eq("id", property.id)
        .select()
        .single();

      if (error) throw error;

      setProperty(updated as Property);
      toast({
        title: "Success",
        description: "Property updated successfully",
      });
      return true;
    } catch (error: any) {
      console.error("Error updating property:", error);
      toast({
        title: "Error",
        description: "Failed to update property",
        variant: "destructive",
      });
      return false;
    }
  };

  const formatCurrency = (value: number | null) => {
    if (!value) return "—";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const primaryPhoto = photos.find((p) => p.is_primary) || photos[0];

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </main>
      </div>
    );
  }

  if (!property) {
    return null;
  }

  // Financial calculations
  const totalInvestment =
    (property.purchase_price || 0) +
    (property.actual_rehab_cost || property.rehab_budget || 0) +
    (property.holding_costs || 0);
  const equity = (property.arv || 0) - (property.loan_amount || 0);
  const potentialProfit = (property.arv || 0) - totalInvestment;
  const roi = totalInvestment > 0 ? (potentialProfit / totalInvestment) * 100 : 0;
  const cashFlow =
    (property.monthly_rent || 0) - (property.monthly_expenses || 0);
  const annualCashFlow = cashFlow * 12;
  const cashOnCash =
    property.purchase_price && property.loan_amount
      ? (annualCashFlow /
          (property.purchase_price - property.loan_amount)) *
        100
      : 0;

  return (
    <div className="flex min-h-screen bg-background">
      <Navigation />
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/properties/portfolio")}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold text-foreground">
                    {property.address}
                  </h1>
                  <Badge className={statusColors[property.status]}>
                    {statusLabels[property.status]}
                  </Badge>
                </div>
                <p className="text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {[property.city, property.state, property.zip_code]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
            </div>
            <Button onClick={() => setEditDialogOpen(true)}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Property
            </Button>
          </div>

          {/* Hero Photo */}
          {primaryPhoto && (
            <div className="mb-6 rounded-xl overflow-hidden h-64 bg-muted">
              <img
                src={primaryPhoto.url}
                alt={property.address}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Home className="h-3 w-3" />
                  Type
                </div>
                <div className="font-semibold">
                  {property.property_type || "—"}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground">Bed / Bath</div>
                <div className="font-semibold">
                  {property.bedrooms || "—"} / {property.bathrooms || "—"}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground">Sq Ft</div>
                <div className="font-semibold">
                  {property.square_feet?.toLocaleString() || "—"}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground">Year Built</div>
                <div className="font-semibold">
                  {property.year_built || "—"}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  Purchase
                </div>
                <div className="font-semibold">
                  {formatCurrency(property.purchase_price)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  ARV
                </div>
                <div className="font-semibold text-primary">
                  {formatCurrency(property.arv)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="financials" className="space-y-4">
            <TabsList>
              <TabsTrigger value="financials" className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Financial Analysis
              </TabsTrigger>
              <TabsTrigger value="photos" className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                Photos ({photos.length})
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Documents
              </TabsTrigger>
            </TabsList>

            <TabsContent value="financials">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Investment Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Investment Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Purchase Price
                      </span>
                      <span className="font-medium">
                        {formatCurrency(property.purchase_price)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rehab Budget</span>
                      <span className="font-medium">
                        {formatCurrency(property.rehab_budget)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Actual Rehab Cost
                      </span>
                      <span className="font-medium">
                        {formatCurrency(property.actual_rehab_cost)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Holding Costs
                      </span>
                      <span className="font-medium">
                        {formatCurrency(property.holding_costs)}
                      </span>
                    </div>
                    <div className="border-t pt-3 flex justify-between font-semibold">
                      <span>Total Investment</span>
                      <span>{formatCurrency(totalInvestment)}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Returns Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Returns Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ARV</span>
                      <span className="font-medium">
                        {formatCurrency(property.arv)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Loan Amount
                      </span>
                      <span className="font-medium">
                        {formatCurrency(property.loan_amount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Equity</span>
                      <span className="font-medium text-primary">
                        {formatCurrency(equity)}
                      </span>
                    </div>
                    <div className="border-t pt-3 flex justify-between">
                      <span className="font-semibold">Potential Profit</span>
                      <span
                        className={`font-bold ${
                          potentialProfit >= 0
                            ? "text-green-600"
                            : "text-destructive"
                        }`}
                      >
                        {formatCurrency(potentialProfit)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">ROI</span>
                      <span
                        className={`font-bold ${
                          roi >= 0 ? "text-green-600" : "text-destructive"
                        }`}
                      >
                        {roi.toFixed(1)}%
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Rental Analysis */}
                {(property.monthly_rent || property.status === "rental") && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Rental Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Monthly Rent
                        </span>
                        <span className="font-medium">
                          {formatCurrency(property.monthly_rent)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Monthly Expenses
                        </span>
                        <span className="font-medium">
                          {formatCurrency(property.monthly_expenses)}
                        </span>
                      </div>
                      <div className="border-t pt-3 flex justify-between">
                        <span className="font-semibold">Monthly Cash Flow</span>
                        <span
                          className={`font-bold ${
                            cashFlow >= 0
                              ? "text-green-600"
                              : "text-destructive"
                          }`}
                        >
                          {formatCurrency(cashFlow)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">Annual Cash Flow</span>
                        <span
                          className={`font-bold ${
                            annualCashFlow >= 0
                              ? "text-green-600"
                              : "text-destructive"
                          }`}
                        >
                          {formatCurrency(annualCashFlow)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">Cash-on-Cash Return</span>
                        <span className="font-bold text-primary">
                          {cashOnCash.toFixed(1)}%
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Financing Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Financing</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lender</span>
                      <span className="font-medium">
                        {property.lender_name || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Loan Amount</span>
                      <span className="font-medium">
                        {formatCurrency(property.loan_amount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Interest Rate
                      </span>
                      <span className="font-medium">
                        {property.interest_rate
                          ? `${property.interest_rate}%`
                          : "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Acquisition Date
                      </span>
                      <span className="font-medium">
                        {property.acquisition_date || "—"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Notes */}
              {property.notes && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {property.notes}
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="photos">
              <Card>
                <CardContent className="p-6">
                  <PropertyPhotoUpload propertyId={property.id} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents">
              <Card>
                <CardContent className="p-6">
                  <PropertyDocumentUpload propertyId={property.id} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <PropertyFormDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        property={property}
        onSubmit={handleUpdate}
      />
    </div>
  );
}
