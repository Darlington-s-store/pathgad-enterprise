import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, Loader2, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { SiteSettings } from "@/lib/use-settings";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
});

function AdminSettings() {
  const [s, setS] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("site_settings").select("*").limit(1).maybeSingle()
      .then(({ data }) => setS((data as SiteSettings) || null));
  }, []);

  const save = async () => {
    if (!s) return;
    setSaving(true);
    const { error } = await supabase.from("site_settings").update({
      maintenance_mode: s.maintenance_mode,
      maintenance_message: s.maintenance_message,
      site_tagline: s.site_tagline,
      contact_email: s.contact_email,
      contact_phone: s.contact_phone,
      contact_address: s.contact_address,
      facebook_url: s.facebook_url,
      linkedin_url: s.linkedin_url,
      twitter_url: s.twitter_url,
      whatsapp_number: s.whatsapp_number,
    }).eq("id", s.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Settings saved");
  };

  if (!s) return <div className="flex h-64 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-navy" /></div>;

  const set = <K extends keyof SiteSettings>(k: K, v: SiteSettings[K]) => setS({ ...s, [k]: v });

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-navy">Site Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage public-facing platform configuration.</p>
      </div>

      {/* Maintenance */}
      <section className="rounded-xl border-hairline border-border bg-card p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 text-gold" />
            <div>
              <h2 className="font-display text-lg font-bold text-navy">Maintenance Mode</h2>
              <p className="mt-1 text-sm text-muted-foreground">When enabled, public visitors see a maintenance page. Admins can still access the admin console.</p>
            </div>
          </div>
          <label className="relative inline-flex shrink-0 cursor-pointer items-center">
            <input type="checkbox" className="peer sr-only" checked={s.maintenance_mode} onChange={(e) => set("maintenance_mode", e.target.checked)} />
            <div className="peer h-6 w-11 rounded-full bg-muted after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-card after:shadow after:transition-all peer-checked:bg-destructive peer-checked:after:translate-x-full" />
          </label>
        </div>
        <div className="mt-4">
          <label className="mb-1.5 block text-sm font-medium text-navy">Maintenance message</label>
          <textarea value={s.maintenance_message} onChange={(e) => set("maintenance_message", e.target.value)} rows={3} className="input" />
        </div>
      </section>

      {/* Brand & contact */}
      <section className="rounded-xl border-hairline border-border bg-card p-6">
        <h2 className="font-display text-lg font-bold text-navy">Brand & Contact</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Field label="Site tagline" value={s.site_tagline} onChange={(v) => set("site_tagline", v)} full />
          <Field label="Contact email" value={s.contact_email} onChange={(v) => set("contact_email", v)} />
          <Field label="Contact phone" value={s.contact_phone} onChange={(v) => set("contact_phone", v)} />
          <Field label="Address" value={s.contact_address} onChange={(v) => set("contact_address", v)} full />
          <Field label="WhatsApp number (digits)" value={s.whatsapp_number || ""} onChange={(v) => set("whatsapp_number", v)} />
        </div>
      </section>

      {/* Social */}
      <section className="rounded-xl border-hairline border-border bg-card p-6">
        <h2 className="font-display text-lg font-bold text-navy">Social Links</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Field label="Facebook URL" value={s.facebook_url || ""} onChange={(v) => set("facebook_url", v)} />
          <Field label="LinkedIn URL" value={s.linkedin_url || ""} onChange={(v) => set("linkedin_url", v)} />
          <Field label="Twitter URL" value={s.twitter_url || ""} onChange={(v) => set("twitter_url", v)} />
        </div>
      </section>

      <div className="flex justify-end">
        <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-md bg-navy px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save settings
        </button>
      </div>

      <style>{`.input{width:100%;border-radius:8px;border:0.5px solid var(--border);background:var(--background);padding:0.625rem 0.75rem;font-size:0.875rem;outline:none} .input:focus{border-color:var(--gold);box-shadow:0 0 0 3px color-mix(in oklab,var(--gold) 20%, transparent)}`}</style>
    </div>
  );
}

function Field({ label, value, onChange, full }: { label: string; value: string; onChange: (v: string) => void; full?: boolean }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="mb-1.5 block text-sm font-medium text-navy">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="input" />
    </div>
  );
}
