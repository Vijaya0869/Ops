export type PropertyStatus = 
  | 'lead'
  | 'under_contract'
  | 'owned'
  | 'in_rehab'
  | 'listed'
  | 'sold'
  | 'rental';

export interface Property {
  id: string;
  user_id: string;
  address: string;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  county: string | null;
  property_type: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  square_feet: number | null;
  lot_size: number | null;
  year_built: number | null;
  purchase_price: number | null;
  arv: number | null;
  rehab_budget: number | null;
  actual_rehab_cost: number | null;
  holding_costs: number | null;
  sale_price: number | null;
  monthly_rent: number | null;
  monthly_expenses: number | null;
  loan_amount: number | null;
  interest_rate: number | null;
  lender_name: string | null;
  status: PropertyStatus;
  acquisition_date: string | null;
  sale_date: string | null;
  notes: string | null;
  mls_number: string | null;
  created_at: string;
  updated_at: string;
}

export interface PropertyFormData {
  address: string;
  city: string;
  state: string;
  zip_code: string;
  county: string;
  property_type: string;
  bedrooms: number | null;
  bathrooms: number | null;
  square_feet: number | null;
  lot_size: number | null;
  year_built: number | null;
  purchase_price: number | null;
  arv: number | null;
  rehab_budget: number | null;
  actual_rehab_cost: number | null;
  holding_costs: number | null;
  sale_price: number | null;
  monthly_rent: number | null;
  monthly_expenses: number | null;
  loan_amount: number | null;
  interest_rate: number | null;
  lender_name: string;
  status: PropertyStatus;
  acquisition_date: string;
  sale_date: string;
  notes: string;
  mls_number: string;
}