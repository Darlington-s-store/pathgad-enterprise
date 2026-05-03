import type { ReactNode } from "react";
import { DashboardSidebar } from "./DashboardSidebar";

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/30 md:flex">
      <DashboardSidebar />
      <main className="flex-1 p-5 md:p-10">{children}</main>
    </div>
  );
}
