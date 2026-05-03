import { Link, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, LogOut, ExternalLink, Shield } from "lucide-react";
import { useAuth } from "@/lib/auth";

export function AdminTopbar() {
  const { user, signOut } = useAuth();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const initials = user?.email?.[0]?.toUpperCase() || "A";

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card px-5 py-3 md:px-8">
      <div className="flex items-center gap-3">
        <span className="hidden h-9 w-9 items-center justify-center rounded-md bg-navy text-gold md:flex">
          <Shield className="h-4 w-4" />
        </span>
        <div>
          <div className="font-display text-base font-bold text-navy md:text-lg">PATHGAD Admin</div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Control Console</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Link
          to="/"
          className="hidden items-center gap-1.5 rounded-md border-hairline border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:border-gold hover:text-navy sm:inline-flex"
        >
          <ExternalLink className="h-3.5 w-3.5" /> View site
        </Link>

        <div ref={ref} className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 rounded-md border-hairline border-border bg-card px-2.5 py-1.5 text-sm hover:bg-muted"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-navy text-xs font-semibold text-gold">
              {initials}
            </span>
            <div className="hidden text-left sm:block">
              <div className="text-xs font-semibold text-navy">Admin</div>
              <div className="max-w-[160px] truncate text-[10px] text-muted-foreground">{user?.email}</div>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-lg border-hairline border-border bg-card shadow-lg">
              <div className="border-b border-border px-3 py-2.5">
                <div className="text-xs font-semibold text-navy">Signed in as</div>
                <div className="truncate text-xs text-muted-foreground">{user?.email}</div>
              </div>
              <Link to="/" className="flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-muted sm:hidden">
                <ExternalLink className="h-4 w-4" /> View site
              </Link>
              <button
                onClick={async () => {
                  await signOut();
                  nav({ to: "/admin-login" });
                }}
                className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
