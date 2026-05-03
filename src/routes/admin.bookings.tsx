import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { DataTable, StatusBadge } from "@/components/site/DataTable";

type Booking = {
  id: string; reference: string; full_name: string; email: string; phone: string;
  service: string; preferred_date: string; preferred_time: string; status: string;
};

const STATUSES = ["Pending", "Confirmed", "Cancelled"];

export const Route = createFileRoute("/admin/bookings")({
  component: AdminBookings,
});

function AdminBookings() {
  const [rows, setRows] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<string>("All");

  const load = () => {
    supabase.from("bookings")
      .select("id, reference, full_name, email, phone, service, preferred_date, preferred_time, status")
      .order("created_at", { ascending: false })
      .then(({ data }) => setRows((data as Booking[]) || []));
  };

  useEffect(() => { load(); }, []);

  const update = async (id: string, status: string) => {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Booking updated");
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this booking?")) return;
    const { error } = await supabase.from("bookings").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  };

  const filtered = filter === "All" ? rows : rows.filter((r) => r.status === filter);

  return (
    <>
      <h1 className="font-display text-3xl font-bold text-navy">All Bookings</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage every appointment booked on the platform.</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {["All", ...STATUSES].map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`rounded-full px-4 py-1.5 text-xs font-semibold ${filter === s ? "bg-navy text-primary-foreground" : "border-hairline border-border bg-card hover:border-gold"}`}>{s}</button>
        ))}
      </div>

      <DataTable
        className="mt-5"
        cols={["Reference", "Customer", "Contact", "Service", "Date", "Status", "Actions"]}
        rows={filtered.map((r) => [
          r.reference,
          <div key="c"><div className="font-medium text-navy">{r.full_name}</div></div>,
          <div key="ct" className="text-xs text-muted-foreground"><div>{r.email}</div><div>{r.phone}</div></div>,
          r.service,
          <div key="d"><div>{r.preferred_date}</div><div className="text-xs text-muted-foreground">{r.preferred_time}</div></div>,
          <StatusBadge key="s" status={r.status} />,
          <div key="a" className="flex gap-2">
            <select value={r.status} onChange={(e) => update(r.id, e.target.value)} className="rounded-md border-hairline border-border bg-background px-2 py-1 text-xs">
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
            <button onClick={() => remove(r.id)} className="rounded-md border-hairline border-destructive/40 px-2 py-1 text-xs text-destructive hover:bg-destructive/10">Delete</button>
          </div>,
        ])}
        empty="No bookings yet."
      />
    </>
  );
}
