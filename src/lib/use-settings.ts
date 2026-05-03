import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SiteSettings = {
  id: string;
  maintenance_mode: boolean;
  maintenance_message: string;
  site_tagline: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  facebook_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  whatsapp_number: string | null;
};

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    supabase
      .from("site_settings")
      .select("*")
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        setSettings((data as SiteSettings) || null);
        setLoading(false);
      });
  };

  useEffect(() => {
    load();
    const ch = supabase
      .channel("site_settings_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "site_settings" }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  return { settings, loading, reload: load };
}
