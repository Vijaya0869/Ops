-- Create storage bucket for property photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-photos', 'property-photos', true);

-- Create storage policies for property photos
CREATE POLICY "Users can upload property photos"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'property-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their property photos"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'property-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their property photos"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'property-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Public can view property photos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'property-photos');

-- Create property_photos table to track photos linked to properties
CREATE TABLE public.property_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.property_photos ENABLE ROW LEVEL SECURITY;

-- RLS policies for property_photos
CREATE POLICY "Users can view their property photos"
ON public.property_photos
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their property photos"
ON public.property_photos
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their property photos"
ON public.property_photos
FOR DELETE
USING (auth.uid() = user_id);

-- Index for faster lookups
CREATE INDEX idx_property_photos_property_id ON public.property_photos(property_id);