import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DataTable, StatusBadge } from "@/components/site/DataTable";

type Booking = { reference: string; service: string; preferred_date: string; preferred_time: string; status: string };

export const Route = createFileRoute("/dashboard/bookings")({
  component: MyBookings,
});

function MyBookings() {
  const [rows, setRows] = useState<Booking[]>([]);
  useEffect(() => {
    supabase.from("bookings").select("reference, service, preferred_date, preferred_time, status").order("created_at", { ascending: false }).then(({ data }) => setRows((data as Booking[]) || []));
  }, []);
  return (
    <>
      <h1 className="font-display text-3xl font-bold text-navy">My Bookings</h1>
      <p className="mt-1 text-sm text-muted-foreground">All your appointments and consultations.</p>
      <DataTable
        className="mt-6"
        cols={["Reference", "Service", "Date", "Time", "Status"]}
        rows={rows.map((r) => [r.reference, r.service, r.preferred_date, r.preferred_time, <StatusBadge key="s" status={r.status} />])}
        empty="No bookings yet."
      />
    </>
  );
}
