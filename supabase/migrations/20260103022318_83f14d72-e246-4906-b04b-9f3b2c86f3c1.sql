-- Create deal_stage enum
CREATE TYPE public.deal_stage AS ENUM ('lead', 'analyzing', 'offer_made', 'under_contract', 'due_diligence', 'closed', 'dead');

-- Create deals table
CREATE TABLE public.deals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  asking_price NUMERIC,
  offer_price NUMERIC,
  arv NUMERIC,
  rehab_estimate NUMERIC,
  expected_profit NUMERIC,
  stage deal_stage NOT NULL DEFAULT 'lead',
  source TEXT,
  contact_name TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on deals
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;

-- RLS policies for deals
CREATE POLICY "Users can view their own deals"
ON public.deals FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own deals"
ON public.deals FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own deals"
ON public.deals FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own deals"
ON public.deals FOR DELETE
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_deals_updated_at
BEFORE UPDATE ON public.deals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes for deals
CREATE INDEX idx_deals_user_id ON public.deals(user_id);
CREATE INDEX idx_deals_stage ON public.deals(stage);

-- Create storage bucket for property documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-documents', 'property-documents', false);

-- Storage policies for property documents
CREATE POLICY "Users can upload property documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'property-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their property documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'property-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their property documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'property-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create property_documents table
CREATE TABLE public.property_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  document_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on property_documents
ALTER TABLE public.property_documents ENABLE ROW LEVEL SECURITY;

-- RLS policies for property_documents
CREATE POLICY "Users can view their property documents"
ON public.property_documents FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their property documents"
ON public.property_documents FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their property documents"
ON public.property_documents FOR DELETE
USING (auth.uid() = user_id);

-- Index for property_documents
CREATE INDEX idx_property_documents_property_id ON public.property_documents(property_id);