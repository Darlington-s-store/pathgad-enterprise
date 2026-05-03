import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, ChevronDown, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/lib/auth";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/projects", label: "Projects" },
  { to: "/booking", label: "Booking" },
  { to: "/news", label: "News" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });

  const initials = (user?.user_metadata?.full_name as string | undefined)
    ?.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()
    || user?.email?.[0]?.toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-40 border-hairline border-b bg-background/90 backdrop-blur">
      <div className="container-pg flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-navy text-gold font-display font-bold">P</span>
          <span className="font-display text-lg font-bold tracking-tight text-navy">PATHGAD</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm font-medium transition-colors hover:text-navy ${path === l.to ? "text-navy" : "text-muted-foreground"}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          {user ? (
            <div className="relative">
              <button onClick={() => setMenu(!menu)} className="flex items-center gap-2 rounded-md border-hairline border-border px-3 py-2 text-sm hover:bg-muted">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-navy text-xs font-semibold text-gold">{initials}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {menu && (
                <div className="absolute right-0 mt-2 w-44 rounded-lg border-hairline border-border bg-card shadow-lg">
                  <button onClick={() => { setMenu(false); navigate({ to: "/dashboard" }); }} className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted">
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </button>
                  <button onClick={async () => { await signOut(); setMenu(false); navigate({ to: "/" }); }} className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted">
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/contact" className="rounded-md bg-navy px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-navy/90">
              Get a Quote
            </Link>
          )}
        </div>

        <button onClick={() => setOpen(!open)} className="lg:hidden" aria-label="Menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-hairline border-t bg-background lg:hidden">
          <div className="container-pg flex flex-col gap-1 py-3">
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="rounded px-2 py-2 text-sm hover:bg-muted">{l.label}</Link>
            ))}
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setOpen(false)} className="rounded px-2 py-2 text-sm hover:bg-muted">Dashboard</Link>
                <button onClick={async () => { await signOut(); setOpen(false); navigate({ to: "/" }); }} className="rounded px-2 py-2 text-left text-sm hover:bg-muted">Logout</button>
              </>
            ) : (
              <Link to="/login" search={{ redirect: "/dashboard" }} onClick={() => setOpen(false)} className="rounded bg-navy px-2 py-2 text-center text-sm font-semibold text-primary-foreground">Sign in</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
