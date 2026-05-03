
-- Create site_settings table (single-row config)
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  maintenance_mode boolean NOT NULL DEFAULT false,
  maintenance_message text NOT NULL DEFAULT 'We are performing scheduled maintenance. Please check back shortly.',
  site_tagline text NOT NULL DEFAULT 'From Trade to Transport — One Trusted Partner.',
  contact_email text NOT NULL DEFAULT 'info@pathgad.com',
  contact_phone text NOT NULL DEFAULT '+233 XX XXX XXXX',
  contact_address text NOT NULL DEFAULT 'Kumasi, Ghana',
  facebook_url text,
  linkedin_url text,
  twitter_url text,
  whatsapp_number text DEFAULT '233000000000',
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site settings"
  ON public.site_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins can update site settings"
  ON public.site_settings FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert site settings"
  ON public.site_settings FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Seed single default row
INSERT INTO public.site_settings (maintenance_mode) VALUES (false);

-- Updated-at trigger
CREATE OR REPLACE FUNCTION public.touch_site_settings()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_site_settings_touch
BEFORE UPDATE ON public.site_settings
FOR EACH ROW EXECUTE FUNCTION public.touch_site_settings();
