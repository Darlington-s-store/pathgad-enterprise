import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Shield, Calendar, FileText, Users, Settings, LogOut, Menu, X, LayoutDashboard,
} from "lucide-react";
import { useAuth } from "@/lib/auth";

const items = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/bookings", label: "Bookings", icon: Calendar },
  { to: "/admin/inquiries", label: "Inquiries", icon: FileText },
  { to: "/admin/users", label: "Users & Roles", icon: Users },
  { to: "/admin/settings", label: "Site Settings", icon: Settings },
];

export function AdminSidebar() {
  const { signOut, user } = useAuth();
  const nav = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  const Body = (
    <div className="flex h-full flex-col bg-navy text-primary-foreground">
      <Link to="/admin" className="flex items-center gap-2 border-b border-white/10 px-5 py-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-gold text-navy">
          <Shield className="h-4 w-4" />
        </span>
        <div>
          <div className="font-display text-base font-bold">PATHGAD</div>
          <div className="text-[10px] uppercase tracking-widest text-gold">Admin Console</div>
        </div>
      </Link>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {items.map((it) => {
          const active = it.exact ? path === it.to : path === it.to || path.startsWith(it.to + "/");
          return (
            <Link
              key={it.to}
              to={it.to}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                active ? "bg-gold text-navy" : "text-primary-foreground/80 hover:bg-white/5 hover:text-primary-foreground"
              }`}
            >
              <it.icon className="h-4 w-4" />
              {it.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 p-3">
        <div className="mb-2 truncate px-2 text-xs text-primary-foreground/60">{user?.email}</div>
        <button
          onClick={async () => { await signOut(); nav({ to: "/admin-login" }); }}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-primary-foreground/80 hover:bg-white/5"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="flex items-center justify-between border-b border-white/10 bg-navy px-4 py-3 text-primary-foreground md:hidden">
        <Link to="/admin" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gold text-navy"><Shield className="h-4 w-4" /></span>
          <span className="font-display font-bold">Admin</span>
        </Link>
        <button onClick={() => setOpen(true)} aria-label="Open menu" className="p-2">
          <Menu className="h-6 w-6" />
        </button>
      </div>

      <aside className="hidden w-64 shrink-0 md:block">{Body}</aside>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 shadow-xl">
            <button onClick={() => setOpen(false)} aria-label="Close" className="absolute right-3 top-3 z-10 p-2 text-primary-foreground">
              <X className="h-5 w-5" />
            </button>
            {Body}
          </div>
        </div>
      )}
    </>
  );
}

