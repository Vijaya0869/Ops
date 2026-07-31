-- Create property status enum
CREATE TYPE public.property_status AS ENUM (
  'lead',
  'under_contract',
  'owned',
  'in_rehab',
  'listed',
  'sold',
  'rental'
);

-- Create properties table
CREATE TABLE public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Property details
  address TEXT NOT NULL,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  county TEXT,
  property_type TEXT, -- single family, multi-family, condo, etc.
  bedrooms INTEGER,
  bathrooms NUMERIC(3,1),
  square_feet INTEGER,
  lot_size NUMERIC(10,2),
  year_built INTEGER,
  
  -- Financial details
  purchase_price NUMERIC(12,2),
  arv NUMERIC(12,2), -- After Repair Value
  rehab_budget NUMERIC(12,2),
  actual_rehab_cost NUMERIC(12,2),
  holding_costs NUMERIC(12,2),
  sale_price NUMERIC(12,2),
  
  -- Rental details (if applicable)
  monthly_rent NUMERIC(10,2),
  monthly_expenses NUMERIC(10,2),
  
  -- Financing
  loan_amount NUMERIC(12,2),
  interest_rate NUMERIC(5,3),
  lender_name TEXT,
  
  -- Status and dates
  status property_status DEFAULT 'lead',
  acquisition_date DATE,
  sale_date DATE,
  
  -- Notes and metadata
  notes TEXT,
  mls_number TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Users can view their own properties
CREATE POLICY "Users can view their own properties"
ON public.properties
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own properties
CREATE POLICY "Users can insert their own properties"
ON public.properties
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own properties
CREATE POLICY "Users can update their own properties"
ON public.properties
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own properties
CREATE POLICY "Users can delete their own properties"
ON public.properties
FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_properties_updated_at
BEFORE UPDATE ON public.properties
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries
CREATE INDEX idx_properties_user_id ON public.properties(user_id);
CREATE INDEX idx_properties_status ON public.properties(status);
CREATE INDEX idx_properties_city_state ON public.properties(city, state);