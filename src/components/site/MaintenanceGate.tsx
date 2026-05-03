import type { ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { useSiteSettings } from "@/lib/use-settings";
import { useIsAdmin } from "@/lib/use-admin";
import { Navigate } from "@tanstack/react-router";

const BYPASS_PREFIXES = ["/admin", "/admin-login", "/maintenance"];

export function MaintenanceGate({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { settings, loading } = useSiteSettings();
  const { isAdmin } = useIsAdmin();

  const bypass =
    BYPASS_PREFIXES.some((p) => path === p || path.startsWith(p + "/")) || isAdmin;

  if (loading || !settings || !settings.maintenance_mode || bypass) {
    return <>{children}</>;
  }

  return <Navigate to="/maintenance" />;
}
