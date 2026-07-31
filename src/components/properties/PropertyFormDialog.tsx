import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Property, PropertyFormData, PropertyStatus } from "@/types/property";
import { Loader2 } from "lucide-react";
import { PropertyPhotoUpload } from "./PropertyPhotoUpload";
import { PropertyDocumentUpload } from "./PropertyDocumentUpload";

interface PropertyFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property?: Property | null;
  onSubmit: (data: Partial<PropertyFormData>) => Promise<boolean | Property | null>;
}

const statusOptions: { value: PropertyStatus; label: string }[] = [
  { value: "lead", label: "Lead" },
  { value: "under_contract", label: "Under Contract" },
  { value: "owned", label: "Owned" },
  { value: "in_rehab", label: "In Rehab" },
  { value: "listed", label: "Listed" },
  { value: "sold", label: "Sold" },
  { value: "rental", label: "Rental" },
];

const propertyTypes = [
  "Single Family",
  "Multi-Family",
  "Condo",
  "Townhouse",
  "Duplex",
  "Triplex",
  "Fourplex",
  "Land",
  "Commercial",
  "Other",
];

const defaultFormData: Partial<PropertyFormData> = {
  address: "",
  city: "",
  state: "",
  zip_code: "",
  county: "",
  property_type: "",
  bedrooms: null,
  bathrooms: null,
  square_feet: null,
  lot_size: null,
  year_built: null,
  purchase_price: null,
  arv: null,
  rehab_budget: null,
  actual_rehab_cost: null,
  holding_costs: null,
  sale_price: null,
  monthly_rent: null,
  monthly_expenses: null,
  loan_amount: null,
  interest_rate: null,
  lender_name: "",
  status: "lead",
  acquisition_date: "",
  sale_date: "",
  notes: "",
  mls_number: "",
};

export function PropertyFormDialog({ open, onOpenChange, property, onSubmit }: PropertyFormDialogProps) {
  const [formData, setFormData] = useState<Partial<PropertyFormData>>(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (property) {
      setFormData({
        address: property.address || "",
        city: property.city || "",
        state: property.state || "",
        zip_code: property.zip_code || "",
        county: property.county || "",
        property_type: property.property_type || "",
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        square_feet: property.square_feet,
        lot_size: property.lot_size,
        year_built: property.year_built,
        purchase_price: property.purchase_price,
        arv: property.arv,
        rehab_budget: property.rehab_budget,
        actual_rehab_cost: property.actual_rehab_cost,
        holding_costs: property.holding_costs,
        sale_price: property.sale_price,
        monthly_rent: property.monthly_rent,
        monthly_expenses: property.monthly_expenses,
        loan_amount: property.loan_amount,
        interest_rate: property.interest_rate,
        lender_name: property.lender_name || "",
        status: property.status,
        acquisition_date: property.acquisition_date || "",
        sale_date: property.sale_date || "",
        notes: property.notes || "",
        mls_number: property.mls_number || "",
      });
    } else {
      setFormData(defaultFormData);
    }
  }, [property, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.address?.trim()) {
      return;
    }

    setIsSubmitting(true);
    const result = await onSubmit(formData);
    setIsSubmitting(false);

    if (result) {
      onOpenChange(false);
    }
  };

  const handleNumberChange = (field: keyof PropertyFormData, value: string) => {
    const numValue = value === "" ? null : parseFloat(value);
    setFormData((prev) => ({ ...prev, [field]: numValue }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{property ? "Edit Property" : "Add New Property"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="financials">Financials</TabsTrigger>
              <TabsTrigger value="rental">Rental</TabsTrigger>
              <TabsTrigger value="photos">Photos</TabsTrigger>
              <TabsTrigger value="docs">Docs</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                    placeholder="123 Main Street"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                      placeholder="Dallas"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => setFormData((prev) => ({ ...prev, state: e.target.value }))}
                      placeholder="TX"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zip_code">Zip Code</Label>
                    <Input
                      id="zip_code"
                      value={formData.zip_code}
                      onChange={(e) => setFormData((prev) => ({ ...prev, zip_code: e.target.value }))}
                      placeholder="75001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="county">County</Label>
                    <Input
                      id="county"
                      value={formData.county}
                      onChange={(e) => setFormData((prev) => ({ ...prev, county: e.target.value }))}
                      placeholder="Dallas County"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="property_type">Property Type</Label>
                    <Select
                      value={formData.property_type}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, property_type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {propertyTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value as PropertyStatus }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">Beds</Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      value={formData.bedrooms ?? ""}
                      onChange={(e) => handleNumberChange("bedrooms", e.target.value)}
                      placeholder="3"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bathrooms">Baths</Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      step="0.5"
                      value={formData.bathrooms ?? ""}
                      onChange={(e) => handleNumberChange("bathrooms", e.target.value)}
                      placeholder="2"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="square_feet">Sq Ft</Label>
                    <Input
                      id="square_feet"
                      type="number"
                      value={formData.square_feet ?? ""}
                      onChange={(e) => handleNumberChange("square_feet", e.target.value)}
                      placeholder="1500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year_built">Year Built</Label>
                    <Input
                      id="year_built"
                      type="number"
                      value={formData.year_built ?? ""}
                      onChange={(e) => handleNumberChange("year_built", e.target.value)}
                      placeholder="1990"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mls_number">MLS Number</Label>
                  <Input
                    id="mls_number"
                    value={formData.mls_number}
                    onChange={(e) => setFormData((prev) => ({ ...prev, mls_number: e.target.value }))}
                    placeholder="MLS123456"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="financials" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="purchase_price">Purchase Price ($)</Label>
                  <Input
                    id="purchase_price"
                    type="number"
                    value={formData.purchase_price ?? ""}
                    onChange={(e) => handleNumberChange("purchase_price", e.target.value)}
                    placeholder="150000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="arv">ARV ($)</Label>
                  <Input
                    id="arv"
                    type="number"
                    value={formData.arv ?? ""}
                    onChange={(e) => handleNumberChange("arv", e.target.value)}
                    placeholder="220000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rehab_budget">Rehab Budget ($)</Label>
                  <Input
                    id="rehab_budget"
                    type="number"
                    value={formData.rehab_budget ?? ""}
                    onChange={(e) => handleNumberChange("rehab_budget", e.target.value)}
                    placeholder="35000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="actual_rehab_cost">Actual Rehab Cost ($)</Label>
                  <Input
                    id="actual_rehab_cost"
                    type="number"
                    value={formData.actual_rehab_cost ?? ""}
                    onChange={(e) => handleNumberChange("actual_rehab_cost", e.target.value)}
                    placeholder="38000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="holding_costs">Holding Costs ($)</Label>
                  <Input
                    id="holding_costs"
                    type="number"
                    value={formData.holding_costs ?? ""}
                    onChange={(e) => handleNumberChange("holding_costs", e.target.value)}
                    placeholder="5000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sale_price">Sale Price ($)</Label>
                  <Input
                    id="sale_price"
                    type="number"
                    value={formData.sale_price ?? ""}
                    onChange={(e) => handleNumberChange("sale_price", e.target.value)}
                    placeholder="215000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="loan_amount">Loan Amount ($)</Label>
                  <Input
                    id="loan_amount"
                    type="number"
                    value={formData.loan_amount ?? ""}
                    onChange={(e) => handleNumberChange("loan_amount", e.target.value)}
                    placeholder="120000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interest_rate">Interest Rate (%)</Label>
                  <Input
                    id="interest_rate"
                    type="number"
                    step="0.001"
                    value={formData.interest_rate ?? ""}
                    onChange={(e) => handleNumberChange("interest_rate", e.target.value)}
                    placeholder="12.5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lender_name">Lender</Label>
                  <Input
                    id="lender_name"
                    value={formData.lender_name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, lender_name: e.target.value }))}
                    placeholder="ABC Lending"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="acquisition_date">Acquisition Date</Label>
                  <Input
                    id="acquisition_date"
                    type="date"
                    value={formData.acquisition_date}
                    onChange={(e) => setFormData((prev) => ({ ...prev, acquisition_date: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sale_date">Sale Date</Label>
                  <Input
                    id="sale_date"
                    type="date"
                    value={formData.sale_date}
                    onChange={(e) => setFormData((prev) => ({ ...prev, sale_date: e.target.value }))}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="rental" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="monthly_rent">Monthly Rent ($)</Label>
                  <Input
                    id="monthly_rent"
                    type="number"
                    value={formData.monthly_rent ?? ""}
                    onChange={(e) => handleNumberChange("monthly_rent", e.target.value)}
                    placeholder="1500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthly_expenses">Monthly Expenses ($)</Label>
                  <Input
                    id="monthly_expenses"
                    type="number"
                    value={formData.monthly_expenses ?? ""}
                    onChange={(e) => handleNumberChange("monthly_expenses", e.target.value)}
                    placeholder="350"
                  />
                </div>
              </div>

              {formData.monthly_rent && formData.monthly_expenses && (
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground">Monthly Cash Flow</div>
                  <div className="text-2xl font-bold text-primary">
                    ${((formData.monthly_rent || 0) - (formData.monthly_expenses || 0)).toLocaleString()}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="photos" className="space-y-4 mt-4">
              <PropertyPhotoUpload propertyId={property?.id || null} />
            </TabsContent>

            <TabsContent value="docs" className="space-y-4 mt-4">
              <PropertyDocumentUpload propertyId={property?.id || null} />
            </TabsContent>

            <TabsContent value="notes" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add any notes about this property..."
                  rows={6}
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {property ? "Updating..." : "Adding..."}
                </>
              ) : property ? (
                "Update Property"
              ) : (
                "Add Property"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}