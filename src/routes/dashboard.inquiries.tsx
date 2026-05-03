import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DataTable, StatusBadge } from "@/components/site/DataTable";

type Inquiry = { reference: string; service: string; created_at: string; status: string };

export const Route = createFileRoute("/dashboard/inquiries")({
  component: MyInquiries,
});

function MyInquiries() {
  const [rows, setRows] = useState<Inquiry[]>([]);
  useEffect(() => {
    supabase.from("inquiries").select("reference, service, created_at, status").order("created_at", { ascending: false }).then(({ data }) => setRows((data as Inquiry[]) || []));
  }, []);
  return (
    <>
      <h1 className="font-display text-3xl font-bold text-navy">My Inquiries</h1>
      <p className="mt-1 text-sm text-muted-foreground">Quote requests and their current status.</p>
      <DataTable
        className="mt-6"
        cols={["Reference", "Service", "Submitted", "Status"]}
        rows={rows.map((r) => [r.reference, r.service, new Date(r.created_at).toLocaleDateString(), <StatusBadge key="s" status={r.status} />])}
        empty="No inquiries yet."
      />
    </>
  );
}
