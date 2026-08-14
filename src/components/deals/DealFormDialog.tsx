import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Deal, DealFormData, DealStage } from "@/types/deal";
import { Loader2 } from "lucide-react";

interface DealFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deal?: Deal | null;
  onSubmit: (data: Partial<DealFormData>) => Promise<Deal | null>;
}

const stageOptions: { value: DealStage; label: string }[] = [
  { value: "lead", label: "Lead" },
  { value: "analyzing", label: "Analyzing" },
  { value: "offer_made", label: "Offer Made" },
  { value: "under_contract", label: "Under Contract" },
  { value: "due_diligence", label: "Due Diligence" },
  { value: "closed", label: "Closed" },
  { value: "dead", label: "Dead" },
];

const defaultFormData: Partial<DealFormData> = {
  title: "",
  address: "",
  city: "",
  state: "",
  asking_price: null,
  offer_price: null,
  arv: null,
  rehab_estimate: null,
  expected_profit: null,
  stage: "lead",
  source: "",
  contact_name: "",
  contact_phone: "",
  contact_email: "",
  notes: "",
};

export function DealFormDialog({
  open,
  onOpenChange,
  deal,
  onSubmit,
}: DealFormDialogProps) {
  const [formData, setFormData] =
    useState<Partial<DealFormData>>(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (deal) {
      setFormData({
        title: deal.title || "",
        address: deal.address || "",
        city: deal.city || "",
        state: deal.state || "",
        asking_price: deal.asking_price,
        offer_price: deal.offer_price,
        arv: deal.arv,
        rehab_estimate: deal.rehab_estimate,
        expected_profit: deal.expected_profit,
        stage: deal.stage,
        source: deal.source || "",
        contact_name: deal.contact_name || "",
        contact_phone: deal.contact_phone || "",
        contact_email: deal.contact_email || "",
        notes: deal.notes || "",
      });
    } else {
      setFormData(defaultFormData);
    }
  }, [deal, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) return;

    setIsSubmitting(true);
    const result = await onSubmit(formData);
    setIsSubmitting(false);

    if (result) {
      onOpenChange(false);
    }
  };

  const handleNumberChange = (field: keyof DealFormData, value: string) => {
    const numValue = value === "" ? null : parseFloat(value);
    setFormData((prev) => ({ ...prev, [field]: numValue }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{deal ? "Edit Deal" : "Add New Deal"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Deal Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="123 Main St Flip"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, address: e.target.value }))
                }
                placeholder="123 Main Street"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stage">Stage</Label>
              <Select
                value={formData.stage}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    stage: value as DealStage,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  {stageOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, city: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, state: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="source">Source</Label>
              <Input
                id="source"
                value={formData.source}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, source: e.target.value }))
                }
                placeholder="MLS, Wholesaler"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="asking_price">Asking Price ($)</Label>
              <Input
                id="asking_price"
                type="number"
                value={formData.asking_price ?? ""}
                onChange={(e) =>
                  handleNumberChange("asking_price", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="offer_price">Offer Price ($)</Label>
              <Input
                id="offer_price"
                type="number"
                value={formData.offer_price ?? ""}
                onChange={(e) =>
                  handleNumberChange("offer_price", e.target.value)
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="arv">ARV ($)</Label>
              <Input
                id="arv"
                type="number"
                value={formData.arv ?? ""}
                onChange={(e) => handleNumberChange("arv", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rehab_estimate">Rehab Est. ($)</Label>
              <Input
                id="rehab_estimate"
                type="number"
                value={formData.rehab_estimate ?? ""}
                onChange={(e) =>
                  handleNumberChange("rehab_estimate", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expected_profit">Expected Profit ($)</Label>
              <Input
                id="expected_profit"
                type="number"
                value={formData.expected_profit ?? ""}
                onChange={(e) =>
                  handleNumberChange("expected_profit", e.target.value)
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact_name">Contact Name</Label>
              <Input
                id="contact_name"
                value={formData.contact_name}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    contact_name: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_phone">Phone</Label>
              <Input
                id="contact_phone"
                value={formData.contact_phone}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    contact_phone: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_email">Email</Label>
              <Input
                id="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    contact_email: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {deal ? "Updating..." : "Adding..."}
                </>
              ) : deal ? (
                "Update Deal"
              ) : (
                "Add Deal"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
