import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { DataTable, StatusBadge } from "@/components/site/DataTable";

type Inquiry = {
  id: string; reference: string; full_name: string; email: string; phone: string;
  service: string; budget: string | null; urgency: string | null;
  description: string | null; status: string; created_at: string;
};

const STATUSES = ["Received", "Under Review", "Quote Sent", "Closed"];

export const Route = createFileRoute("/admin/inquiries")({
  component: AdminInquiries,
});

function AdminInquiries() {
  const [rows, setRows] = useState<Inquiry[]>([]);
  const [filter, setFilter] = useState<string>("All");
  const [open, setOpen] = useState<Inquiry | null>(null);

  const load = () => {
    supabase.from("inquiries")
      .select("id, reference, full_name, email, phone, service, budget, urgency, description, status, created_at")
      .order("created_at", { ascending: false })
      .then(({ data }) => setRows((data as Inquiry[]) || []));
  };

  useEffect(() => { load(); }, []);

  const update = async (id: string, status: string) => {
    const { error } = await supabase.from("inquiries").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Inquiry updated");
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this inquiry?")) return;
    const { error } = await supabase.from("inquiries").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  };

  const filtered = filter === "All" ? rows : rows.filter((r) => r.status === filter);

  return (
    <>
      <h1 className="font-display text-3xl font-bold text-navy">All Inquiries</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage every quote request submitted on the platform.</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {["All", ...STATUSES].map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`rounded-full px-4 py-1.5 text-xs font-semibold ${filter === s ? "bg-navy text-primary-foreground" : "border-hairline border-border bg-card hover:border-gold"}`}>{s}</button>
        ))}
      </div>

      <DataTable
        className="mt-5"
        cols={["Reference", "Customer", "Service", "Budget", "Urgency", "Status", "Actions"]}
        rows={filtered.map((r) => [
          r.reference,
          <div key="c"><div className="font-medium text-navy">{r.full_name}</div><div className="text-xs text-muted-foreground">{r.email}</div></div>,
          r.service,
          r.budget || "—",
          r.urgency || "—",
          <StatusBadge key="s" status={r.status} />,
          <div key="a" className="flex gap-2">
            <button onClick={() => setOpen(r)} className="rounded-md border-hairline border-border px-2 py-1 text-xs hover:border-gold">View</button>
            <select value={r.status} onChange={(e) => update(r.id, e.target.value)} className="rounded-md border-hairline border-border bg-background px-2 py-1 text-xs">
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
            <button onClick={() => remove(r.id)} className="rounded-md border-hairline border-destructive/40 px-2 py-1 text-xs text-destructive hover:bg-destructive/10">Delete</button>
          </div>,
        ])}
        empty="No inquiries yet."
      />

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setOpen(null)}>
          <div className="w-full max-w-lg rounded-xl bg-card p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-display text-xl font-bold text-navy">{open.reference}</h2>
            <div className="mt-4 space-y-2 text-sm">
              <div><strong>Customer:</strong> {open.full_name} ({open.email})</div>
              <div><strong>Phone:</strong> {open.phone}</div>
              <div><strong>Service:</strong> {open.service}</div>
              <div><strong>Budget:</strong> {open.budget || "—"}</div>
              <div><strong>Urgency:</strong> {open.urgency || "—"}</div>
              <div><strong>Submitted:</strong> {new Date(open.created_at).toLocaleString()}</div>
              <div className="mt-3"><strong>Description:</strong></div>
              <p className="rounded-md bg-muted/50 p-3 text-muted-foreground">{open.description || "—"}</p>
            </div>
            <button onClick={() => setOpen(null)} className="mt-5 w-full rounded-md bg-navy px-4 py-2 text-sm font-semibold text-primary-foreground">Close</button>
          </div>
        </div>
      )}
    </>
  );
}
