import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/dashboard/profile")({
  component: Profile,
});

type P = { full_name: string | null; phone: string | null; company: string | null };

function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<P>({ full_name: "", phone: "", company: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("full_name, phone, company").eq("id", user.id).maybeSingle().then(({ data }) => data && setProfile(data as P));
  }, [user]);

  const save = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").upsert({ id: user.id, ...profile, updated_at: new Date().toISOString() });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Profile updated");
  };

  return (
    <>
      <h1 className="font-display text-3xl font-bold text-navy">Profile</h1>
      <div className="mt-6 max-w-xl space-y-4 rounded-xl border-hairline border-border bg-card p-6">
        <Input label="Full name" value={profile.full_name || ""} onChange={(v) => setProfile({ ...profile, full_name: v })} />
        <Input label="Phone" value={profile.phone || ""} onChange={(v) => setProfile({ ...profile, phone: v })} />
        <Input label="Company" value={profile.company || ""} onChange={(v) => setProfile({ ...profile, company: v })} />
        <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-md bg-navy px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60">
          {saving && <Loader2 className="h-4 w-4 animate-spin" />} Save changes
        </button>
      </div>
    </>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-navy">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border-hairline border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
      />
    </div>
  );
}
