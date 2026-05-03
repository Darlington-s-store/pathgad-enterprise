import type { ReactNode } from "react";
import { useRouterState, Link } from "@tanstack/react-router";
import { Wrench } from "lucide-react";
import { useSiteSettings } from "@/lib/use-settings";
import { useIsAdmin } from "@/lib/use-admin";

const BYPASS_PREFIXES = ["/admin", "/admin-login"];

export function MaintenanceGate({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { settings, loading } = useSiteSettings();
  const { isAdmin } = useIsAdmin();

  const bypass = BYPASS_PREFIXES.some((p) => path === p || path.startsWith(p + "/")) || isAdmin;

  if (loading || !settings || !settings.maintenance_mode || bypass) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-navy px-6 text-center text-primary-foreground">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/20">
        <Wrench className="h-8 w-8 text-gold" />
      </div>
      <h1 className="mt-6 font-display text-3xl font-bold md:text-4xl">We'll be right back</h1>
      <p className="mt-3 max-w-lg text-primary-foreground/80">{settings.maintenance_message}</p>
      <Link to="/admin-login" className="mt-8 text-xs uppercase tracking-widest text-gold/80 hover:text-gold">
        Admin sign in
      </Link>
    </div>
  );
}
