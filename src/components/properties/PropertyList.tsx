import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building, 
  MapPin, 
  Plus, 
  Edit, 
  Trash2, 
  Bed, 
  Bath, 
  Square, 
  Loader2,
  MoreVertical,
  Eye
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useProperties } from "@/hooks/useProperties";
import { PropertyFormDialog } from "./PropertyFormDialog";
import { Property, PropertyStatus, PropertyFormData } from "@/types/property";

const statusColors: Record<PropertyStatus, string> = {
  lead: "bg-slate-100 text-slate-800",
  under_contract: "bg-yellow-100 text-yellow-800",
  owned: "bg-blue-100 text-blue-800",
  in_rehab: "bg-orange-100 text-orange-800",
  listed: "bg-secondary text-muted-foreground",
  sold: "bg-green-100 text-green-800",
  rental: "bg-teal-100 text-teal-800",
};

const statusLabels: Record<PropertyStatus, string> = {
  lead: "Lead",
  under_contract: "Under Contract",
  owned: "Owned",
  in_rehab: "In Rehab",
  listed: "Listed",
  sold: "Sold",
  rental: "Rental",
};

export function PropertyList() {
  const navigate = useNavigate();
  const { properties, loading, addProperty, updateProperty, deleteProperty } = useProperties();
  const [formOpen, setFormOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);

  const handleView = (property: Property) => {
    navigate(`/properties/${property.id}`);
  };

  const handleAdd = () => {
    setEditingProperty(null);
    setFormOpen(true);
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setFormOpen(true);
  };

  const handleDeleteClick = (property: Property) => {
    setPropertyToDelete(property);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (propertyToDelete) {
      await deleteProperty(propertyToDelete.id);
      setDeleteDialogOpen(false);
      setPropertyToDelete(null);
    }
  };

  const handleFormSubmit = async (data: Partial<PropertyFormData>) => {
    if (editingProperty) {
      return await updateProperty(editingProperty.id, data);
    } else {
      return await addProperty(data);
    }
  };

  const formatCurrency = (value: number | null) => {
    if (value === null) return "—";
    return `$${value.toLocaleString()}`;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Properties ({properties.length})
          </CardTitle>
          <Button onClick={handleAdd} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Property
          </Button>
        </CardHeader>
        <CardContent>
          {properties.length === 0 ? (
            <div className="text-center py-12">
              <Building className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No properties yet</h3>
              <p className="text-muted-foreground mb-4">
                Add your first property to start tracking your portfolio
              </p>
              <Button onClick={handleAdd}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Property
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {properties.map((property) => (
                <div
                  key={property.id}
                  className="p-4 border rounded-lg bg-card hover:shadow-sm transition-shadow cursor-pointer"
                  onClick={() => handleView(property)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{property.address}</span>
                      </div>
                      {(property.city || property.state) && (
                        <div className="text-sm text-muted-foreground ml-6">
                          {[property.city, property.state, property.zip_code]
                            .filter(Boolean)
                            .join(", ")}
                        </div>
                      )}
                      <div className="flex gap-2 mt-2">
                        <Badge className={statusColors[property.status]}>
                          {statusLabels[property.status]}
                        </Badge>
                        {property.property_type && (
                          <Badge variant="outline">{property.property_type}</Badge>
                        )}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-popover">
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleView(property); }}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEdit(property); }}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => { e.stopPropagation(); handleDeleteClick(property); }}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    {(property.bedrooms || property.bathrooms || property.square_feet) && (
                      <div className="flex items-center gap-3">
                        {property.bedrooms && (
                          <div className="flex items-center gap-1">
                            <Bed className="h-4 w-4 text-muted-foreground" />
                            <span>{property.bedrooms}</span>
                          </div>
                        )}
                        {property.bathrooms && (
                          <div className="flex items-center gap-1">
                            <Bath className="h-4 w-4 text-muted-foreground" />
                            <span>{property.bathrooms}</span>
                          </div>
                        )}
                        {property.square_feet && (
                          <div className="flex items-center gap-1">
                            <Square className="h-4 w-4 text-muted-foreground" />
                            <span>{property.square_feet.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {property.purchase_price && (
                      <div>
                        <div className="text-muted-foreground">Purchase</div>
                        <div className="font-semibold">{formatCurrency(property.purchase_price)}</div>
                      </div>
                    )}

                    {property.arv && (
                      <div>
                        <div className="text-muted-foreground">ARV</div>
                        <div className="font-semibold text-primary">{formatCurrency(property.arv)}</div>
                      </div>
                    )}

                    {property.monthly_rent && (
                      <div>
                        <div className="text-muted-foreground">Monthly Rent</div>
                        <div className="font-semibold text-green-600">
                          {formatCurrency(property.monthly_rent)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <PropertyFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        property={editingProperty}
        onSubmit={handleFormSubmit}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Property</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{propertyToDelete?.address}"? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}