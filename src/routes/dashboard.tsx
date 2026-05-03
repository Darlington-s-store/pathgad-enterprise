import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LayoutDashboard, Calendar, FileText, User as UserIcon, LogOut, Loader2 } from "lucide-react";
import toast from "sonner";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — PATHGAD" }] }),
  component: Dashboard,
});

type Booking = { reference: string; service: string; preferred_date: string; status: string };
type Inquiry = { reference: string; service: string; created_at: string; status: string };
type Profile = { full_name: string | null; phone: string | null; company: string | null };

function Dashboard() {
  const { user, loading, signOut } = useAuth();
  const nav = useNavigate();
  const [tab, setTab] = useState<"home" | "bookings" | "inquiries" | "profile">("home");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [profile, setProfile] = useState<Profile>({ full_name: "", phone: "", company: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (!loading && !user) nav({ to: "/login", search: { redirect: "/dashboard" } }); }, [loading, user, nav]);

  useEffect(() => {
    if (!user) return;
    supabase.from("bookings").select("reference, service, preferred_date, status").order("created_at", { ascending: false }).then(({ data }) => setBookings((data as Booking[]) || []));
    supabase.from("inquiries").select("reference, service, created_at, status").order("created_at", { ascending: false }).then(({ data }) => setInquiries((data as Inquiry[]) || []));
    supabase.from("profiles").select("full_name, phone, company").eq("id", user.id).maybeSingle().then(({ data }) => data && setProfile(data as Profile));
  }, [user]);

  if (loading || !user) return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-navy" /></div>;

  const name = profile.full_name || user.email;

  const saveProfile = async () => {
    setSaving(true);
    const { error } = await supabase.from("profiles").upsert({ id: user.id, ...profile, updated_at: new Date().toISOString() });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Profile updated");
  };

  const items = [
    { k: "home", l: "Dashboard", i: LayoutDashboard },
    { k: "bookings", l: "My Bookings", i: Calendar },
    { k: "inquiries", l: "My Inquiries", i: FileText },
    { k: "profile", l: "Profile", i: UserIcon },
  ] as const;

  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className="hidden w-64 flex-col border-hairline border-r bg-card md:flex">
        <Link to="/" className="flex items-center gap-2 border-hairline border-b px-5 py-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-navy text-gold font-display font-bold">P</span>
          <span className="font-display text-lg font-bold text-navy">PATHGAD</span>
        </Link>
        <nav className="flex-1 space-y-1 p-3">
          {items.map((it) => (
            <button key={it.k} onClick={() => setTab(it.k)} className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${tab === it.k ? "bg-navy text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-navy"}`}>
              <it.i className="h-4 w-4" /> {it.l}
            </button>
          ))}
        </nav>
        <button onClick={async () => { await signOut(); nav({ to: "/" }); }} className="m-3 flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted">
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </aside>

      <main className="flex-1 p-6 md:p-10">
        {tab === "home" && (
          <>
            <h1 className="font-display text-3xl font-bold text-navy">Welcome, {name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">Here's a summary of your activity.</p>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {[
                { l: "Total Bookings", v: bookings.length },
                { l: "Open Inquiries", v: inquiries.filter((i) => i.status !== "Closed").length },
                { l: "Last Activity", v: bookings[0]?.preferred_date || inquiries[0]?.created_at?.slice(0,10) || "—" },
              ].map((s) => (
                <div key={s.l} className="rounded-xl border-hairline border-border bg-card p-6">
                  <div className="text-sm text-muted-foreground">{s.l}</div>
                  <div className="mt-2 font-display text-3xl font-bold text-navy">{s.v}</div>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Link to="/booking" className="inline-flex rounded-md bg-navy px-5 py-2.5 text-sm font-semibold text-primary-foreground">New booking or quote</Link>
            </div>
          </>
        )}

        {tab === "bookings" && <Table title="My Bookings" cols={["Reference", "Service", "Date", "Status"]} rows={bookings.map((b) => [b.reference, b.service, b.preferred_date, b.status])} empty="No bookings yet." />}
        {tab === "inquiries" && <Table title="My Inquiries" cols={["Reference", "Service", "Submitted", "Status"]} rows={inquiries.map((i) => [i.reference, i.service, new Date(i.created_at).toLocaleDateString(), i.status])} empty="No inquiries yet." />}

        {tab === "profile" && (
          <>
            <h1 className="font-display text-3xl font-bold text-navy">Profile</h1>
            <div className="mt-6 max-w-xl space-y-4 rounded-xl border-hairline border-border bg-card p-6">
              <div><label className="mb-1.5 block text-sm font-medium text-navy">Full name</label><input className="input" value={profile.full_name || ""} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} /></div>
              <div><label className="mb-1.5 block text-sm font-medium text-navy">Phone</label><input className="input" value={profile.phone || ""} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} /></div>
              <div><label className="mb-1.5 block text-sm font-medium text-navy">Company</label><input className="input" value={profile.company || ""} onChange={(e) => setProfile({ ...profile, company: e.target.value })} /></div>
              <button onClick={saveProfile} disabled={saving} className="inline-flex items-center gap-2 rounded-md bg-navy px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60">
                {saving && <Loader2 className="h-4 w-4 animate-spin" />} Save
              </button>
            </div>
          </>
        )}
      </main>

      <style>{`.input{width:100%;border-radius:8px;border:0.5px solid var(--border);background:var(--background);padding:0.625rem 0.75rem;font-size:0.875rem;outline:none} .input:focus{border-color:var(--gold);box-shadow:0 0 0 3px color-mix(in oklab,var(--gold) 20%, transparent)}`}</style>
    </div>
  );
}

function Table({ title, cols, rows, empty }: { title: string; cols: string[]; rows: (string | number)[][]; empty: string }) {
  const badge = (s: string) => {
    const m: Record<string, string> = { Pending: "bg-gold/15 text-navy", Confirmed: "bg-success/15 text-success", Cancelled: "bg-destructive/15 text-destructive", Received: "bg-gold/15 text-navy", "Under Review": "bg-gold/15 text-navy", "Quote Sent": "bg-success/15 text-success", Closed: "bg-muted text-muted-foreground" };
    return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${m[s] || "bg-muted"}`}>{s}</span>;
  };
  return (
    <>
      <h1 className="font-display text-3xl font-bold text-navy">{title}</h1>
      <div className="mt-6 overflow-hidden rounded-xl border-hairline border-border bg-card">
        {rows.length === 0 ? <div className="p-10 text-center text-sm text-muted-foreground">{empty}</div> : (
          <table className="w-full text-sm">
            <thead className="bg-muted/50"><tr>{cols.map((c) => <th key={c} className="px-5 py-3 text-left font-semibold text-navy">{c}</th>)}</tr></thead>
            <tbody>{rows.map((r, i) => (
              <tr key={i} className="border-hairline border-t">{r.map((v, j) => <td key={j} className="px-5 py-3">{j === r.length - 1 ? badge(String(v)) : v}</td>)}</tr>
            ))}</tbody>
          </table>
        )}
      </div>
    </>
  );
}
