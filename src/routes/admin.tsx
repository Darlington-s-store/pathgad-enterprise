import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Loader2, ShieldAlert } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useIsAdmin } from "@/lib/use-admin";
import { AdminSidebar } from "@/components/site/AdminSidebar";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — PATHGAD" }] }),
  component: AdminShell,
});

function AdminShell() {
  const { user, loading } = useAuth();
  const { isAdmin, checking } = useIsAdmin();
  const nav = useNavigate();

  useEffect(() => {
    if (!loading && !user) nav({ to: "/admin-login" });
  }, [loading, user, nav]);

  if (loading || !user || checking) {
    return <div className="flex min-h-screen items-center justify-center bg-navy"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>;
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy px-4">
        <div className="w-full max-w-md rounded-xl border-hairline border-white/10 bg-card p-10 text-center">
          <ShieldAlert className="mx-auto h-10 w-10 text-destructive" />
          <h1 className="mt-3 font-display text-2xl font-bold text-navy">Admin access required</h1>
          <p className="mt-2 text-sm text-muted-foreground">Your account doesn't have admin privileges. Contact a site administrator.</p>
          <button onClick={() => nav({ to: "/admin-login" })} className="mt-5 rounded-md bg-navy px-4 py-2 text-sm font-semibold text-primary-foreground">Sign in as admin</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 md:flex">
      <AdminSidebar />
      <main className="flex-1 p-5 md:p-10">
        <Outlet />
      </main>
    </div>
  );
}
