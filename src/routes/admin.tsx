import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Loader2, ShieldAlert } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useIsAdmin } from "@/lib/use-admin";
import { DashboardLayout } from "@/components/site/DashboardLayout";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — PATHGAD" }] }),
  component: AdminShell,
});

function AdminShell() {
  const { user, loading } = useAuth();
  const { isAdmin, checking } = useIsAdmin();
  const nav = useNavigate();

  useEffect(() => {
    if (!loading && !user) nav({ to: "/login", search: { redirect: "/admin" } });
  }, [loading, user, nav]);

  if (loading || !user || checking) {
    return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-navy" /></div>;
  }

  if (!isAdmin) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-md rounded-xl border-hairline border-border bg-card p-10 text-center">
          <ShieldAlert className="mx-auto h-10 w-10 text-destructive" />
          <h1 className="mt-3 font-display text-2xl font-bold text-navy">Admin access required</h1>
          <p className="mt-2 text-sm text-muted-foreground">Your account doesn't have admin privileges. Contact a site administrator to be granted the admin role.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}
