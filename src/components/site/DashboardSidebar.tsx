import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  LayoutDashboard, Calendar, FileText, User as UserIcon, LogOut,
  Shield, Menu, X, Home, Briefcase,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useIsAdmin } from "@/lib/use-admin";

type Item = { to: string; label: string; icon: typeof LayoutDashboard };

const userItems: Item[] = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/dashboard/bookings", label: "My Bookings", icon: Calendar },
  { to: "/dashboard/inquiries", label: "My Inquiries", icon: FileText },
  { to: "/dashboard/profile", label: "Profile", icon: UserIcon },
];

const adminItems: Item[] = [
  { to: "/admin", label: "Admin Overview", icon: Shield },
  { to: "/admin/bookings", label: "All Bookings", icon: Calendar },
  { to: "/admin/inquiries", label: "All Inquiries", icon: FileText },
  { to: "/admin/users", label: "Users & Roles", icon: UserIcon },
];

export function DashboardSidebar() {
  const { signOut, user } = useAuth();
  const { isAdmin } = useIsAdmin();
  const nav = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  const Section = ({ title, items }: { title: string; items: Item[] }) => (
    <div className="px-3 py-2">
      <div className="mb-1 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</div>
      <nav className="space-y-1">
        {items.map((it) => {
          const active = path === it.to;
          return (
            <Link
              key={it.to}
              to={it.to}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                active ? "bg-navy text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-navy"
              }`}
            >
              <it.icon className="h-4 w-4" />
              {it.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );

  const SidebarBody = (
    <div className="flex h-full flex-col">
      <Link to="/" className="flex items-center gap-2 border-hairline border-b px-5 py-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-navy text-gold font-display font-bold">P</span>
        <span className="font-display text-lg font-bold text-navy">PATHGAD</span>
      </Link>
      <div className="flex-1 overflow-y-auto py-2">
        <Section title="Account" items={userItems} />
        {isAdmin && <Section title="Admin" items={adminItems} />}
        <div className="px-3 py-2">
          <div className="mb-1 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Site</div>
          <Link to="/" className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-navy">
            <Home className="h-4 w-4" /> Back to website
          </Link>
          <Link to="/services" className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-navy">
            <Briefcase className="h-4 w-4" /> Services
          </Link>
        </div>
      </div>
      <div className="border-hairline border-t p-3">
        <div className="mb-2 px-2 text-xs text-muted-foreground truncate">{user?.email}</div>
        <button
          onClick={async () => { await signOut(); nav({ to: "/" }); }}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted"
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-hairline border-b bg-card px-4 py-3 md:hidden">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-navy text-gold font-display font-bold">P</span>
          <span className="font-display font-bold text-navy">PATHGAD</span>
        </Link>
        <button onClick={() => setOpen(true)} aria-label="Open menu" className="p-2">
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-hairline border-r bg-card md:block">
        {SidebarBody}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 bg-card shadow-xl">
            <button onClick={() => setOpen(false)} aria-label="Close" className="absolute right-3 top-3 z-10 p-2">
              <X className="h-5 w-5" />
            </button>
            {SidebarBody}
          </div>
        </div>
      )}
    </>
  );
}
