import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Calendar, FileText, Activity } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/dashboard/")({
  component: Overview,
});

function Overview() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState(0);
  const [inquiries, setInquiries] = useState(0);
  const [last, setLast] = useState<string>("—");
  const [name, setName] = useState<string>(user?.email || "");

  useEffect(() => {
    if (!user) return;
    supabase.from("bookings").select("preferred_date, created_at", { count: "exact" }).order("created_at", { ascending: false }).then(({ data, count }) => {
      setBookings(count || 0);
      if (data?.[0]) setLast(data[0].preferred_date || (data[0].created_at as string).slice(0, 10));
    });
    supabase.from("inquiries").select("status", { count: "exact" }).neq("status", "Closed").then(({ count }) => setInquiries(count || 0));
    supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle().then(({ data }) => data?.full_name && setName(data.full_name));
  }, [user]);

  const stats = [
    { l: "Total Bookings", v: bookings, i: Calendar },
    { l: "Open Inquiries", v: inquiries, i: FileText },
    { l: "Last Activity", v: last, i: Activity },
  ];

  return (
    <>
      <h1 className="font-display text-3xl font-bold text-navy">Welcome, {name}</h1>
      <p className="mt-1 text-sm text-muted-foreground">Here's a summary of your activity.</p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <div key={s.l} className="rounded-xl border-hairline border-border bg-card p-6">
            <s.i className="h-6 w-6 text-gold" />
            <div className="mt-3 text-sm text-muted-foreground">{s.l}</div>
            <div className="mt-1 font-display text-3xl font-bold text-navy">{s.v}</div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/booking" className="inline-flex rounded-md bg-navy px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-navy/90">New booking or quote</Link>
        <Link to="/dashboard/bookings" className="inline-flex rounded-md border-hairline border-border bg-card px-5 py-2.5 text-sm font-semibold text-navy hover:border-gold">View bookings</Link>
      </div>
    </>
  );
}
