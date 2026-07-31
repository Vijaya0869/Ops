import { api, ApiError } from "./api-client";
import { Property, PropertyFormData } from "@/types/property";

// The backend (Prisma) returns camelCase field names; the rest of this app
// was built against Supabase's raw snake_case columns. Translating shapes
// here is the whole point of the service layer — nothing above this file
// needs to know or care that the backend changed.

function toDateOnly(value?: string | null): string | null {
  return value ? value.slice(0, 10) : null;
}

interface ApiProperty {
  id: string;
  userId: string;
  address: string;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  county: string | null;
  propertyType: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  squareFeet: number | null;
  lotSize: number | null;
  yearBuilt: number | null;
  purchasePrice: number | null;
  arv: number | null;
  rehabBudget: number | null;
  actualRehabCost: number | null;
  holdingCosts: number | null;
  salePrice: number | null;
  monthlyRent: number | null;
  monthlyExpenses: number | null;
  loanAmount: number | null;
  interestRate: number | null;
  lenderName: string | null;
  status: Property["status"];
  acquisitionDate: string | null;
  saleDate: string | null;
  notes: string | null;
  mlsNumber: string | null;
  createdAt: string;
  updatedAt: string;
}

function fromApi(row: ApiProperty): Property {
  return {
    id: row.id,
    user_id: row.userId,
    address: row.address,
    city: row.city,
    state: row.state,
    zip_code: row.zipCode,
    county: row.county,
    property_type: row.propertyType,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    square_feet: row.squareFeet,
    lot_size: row.lotSize,
    year_built: row.yearBuilt,
    purchase_price: row.purchasePrice,
    arv: row.arv,
    rehab_budget: row.rehabBudget,
    actual_rehab_cost: row.actualRehabCost,
    holding_costs: row.holdingCosts,
    sale_price: row.salePrice,
    monthly_rent: row.monthlyRent,
    monthly_expenses: row.monthlyExpenses,
    loan_amount: row.loanAmount,
    interest_rate: row.interestRate,
    lender_name: row.lenderName,
    status: row.status,
    acquisition_date: toDateOnly(row.acquisitionDate),
    sale_date: toDateOnly(row.saleDate),
    notes: row.notes,
    mls_number: row.mlsNumber,
    created_at: row.createdAt,
    updated_at: row.updatedAt,
  };
}

const FIELD_MAP: Record<keyof PropertyFormData, string> = {
  address: "address",
  city: "city",
  state: "state",
  zip_code: "zipCode",
  county: "county",
  property_type: "propertyType",
  bedrooms: "bedrooms",
  bathrooms: "bathrooms",
  square_feet: "squareFeet",
  lot_size: "lotSize",
  year_built: "yearBuilt",
  purchase_price: "purchasePrice",
  arv: "arv",
  rehab_budget: "rehabBudget",
  actual_rehab_cost: "actualRehabCost",
  holding_costs: "holdingCosts",
  sale_price: "salePrice",
  monthly_rent: "monthlyRent",
  monthly_expenses: "monthlyExpenses",
  loan_amount: "loanAmount",
  interest_rate: "interestRate",
  lender_name: "lenderName",
  status: "status",
  acquisition_date: "acquisitionDate",
  sale_date: "saleDate",
  notes: "notes",
  mls_number: "mlsNumber",
};

function toApiPayload(formData: Partial<PropertyFormData>): Record<string, unknown> {
  const payload: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(formData) as [keyof PropertyFormData, unknown][]) {
    const apiKey = FIELD_MAP[key];
    if (!apiKey) continue;
    payload[apiKey] = value === "" ? null : value;
  }
  return payload;
}

export async function fetchProperties(): Promise<Property[]> {
  const rows = await api.get<ApiProperty[]>("/properties");
  return rows.map(fromApi);
}

export type PropertySummary = Pick<
  Property,
  "purchase_price" | "arv" | "loan_amount" | "monthly_rent" | "status"
>;

export async function fetchPropertiesSummary(): Promise<PropertySummary[]> {
  const rows = await api.get<ApiProperty[]>("/properties");
  return rows.map((row) => ({
    purchase_price: row.purchasePrice,
    arv: row.arv,
    loan_amount: row.loanAmount,
    monthly_rent: row.monthlyRent,
    status: row.status,
  }));
}

export async function fetchPropertyById(id: string): Promise<Property | null> {
  try {
    const row = await api.get<ApiProperty>(`/properties/${id}`);
    return fromApi(row);
  } catch (error) {
    if (error instanceof ApiError && (error.status === 404 || error.status === 403)) {
      return null;
    }
    throw error;
  }
}

export async function addProperty(formData: Partial<PropertyFormData>): Promise<Property> {
  const row = await api.post<ApiProperty>("/properties", toApiPayload(formData));
  return fromApi(row);
}

export async function updateProperty(
  id: string,
  formData: Partial<PropertyFormData>,
): Promise<Property> {
  const row = await api.patch<ApiProperty>(`/properties/${id}`, toApiPayload(formData));
  return fromApi(row);
}

export async function deleteProperty(id: string): Promise<void> {
  await api.delete(`/properties/${id}`);
}
