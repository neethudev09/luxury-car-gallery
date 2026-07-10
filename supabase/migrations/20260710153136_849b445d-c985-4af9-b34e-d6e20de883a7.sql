DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['blog_posts','brands','faqs','galleries','media_assets','pages','profiles','site_settings','vehicles']
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS set_updated_at ON public.%I;', t);
    EXECUTE format('CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();', t);
  END LOOP;
END $$;