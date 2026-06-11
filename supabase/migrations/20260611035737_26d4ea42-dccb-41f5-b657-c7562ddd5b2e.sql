ALTER TABLE public.brands
  ADD COLUMN IF NOT EXISTS logo_light text,
  ADD COLUMN IF NOT EXISTS logo_dark text,
  ADD COLUMN IF NOT EXISTS logo_menu text,
  ADD COLUMN IF NOT EXISTS logo_section text;