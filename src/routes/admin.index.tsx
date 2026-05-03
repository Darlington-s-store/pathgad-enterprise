import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Calendar, FileText, Users, Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

function AdminOverview() {
  const [stats, setStats] = useState({ bookings: 0, inquiries: 0, users: 0, pending: 0 });

  useEffect(() => {
    Promise.all([
      supabase.from("bookings").select("*", { count: "exact", head: true }),
      supabase.from("inquiries").select("*", { count: "exact", head: true }),
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("bookings").select("*", { count: "exact", head: true }).eq("status", "Pending"),
    ]).then(([b, i, u, p]) => {
      setStats({
        bookings: b.count || 0,
        inquiries: i.count || 0,
        users: u.count || 0,
        pending: p.count || 0,
      });
    });
  }, []);

  const cards = [
    { l: "Total Bookings", v: stats.bookings, i: Calendar, to: "/admin/bookings" },
    { l: "Total Inquiries", v: stats.inquiries, i: FileText, to: "/admin/inquiries" },
    { l: "Registered Users", v: stats.users, i: Users, to: "/admin/users" },
    { l: "Pending Bookings", v: stats.pending, i: Activity, to: "/admin/bookings" },
  ] as const;

  return (
    <>
      <h1 className="font-display text-3xl font-bold text-navy">Admin Overview</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage all platform activity from one place.</p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.l} to={c.to} className="rounded-xl border-hairline border-border bg-card p-6 transition-colors hover:border-gold">
            <c.i className="h-6 w-6 text-gold" />
            <div className="mt-3 text-sm text-muted-foreground">{c.l}</div>
            <div className="mt-1 font-display text-3xl font-bold text-navy">{c.v}</div>
          </Link>
        ))}
      </div>
    </>
  );
}
