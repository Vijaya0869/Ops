-- Enable realtime for properties table
ALTER PUBLICATION supabase_realtime ADD TABLE public.properties;

-- Enable realtime for deals table  
ALTER PUBLICATION supabase_realtime ADD TABLE public.deals;