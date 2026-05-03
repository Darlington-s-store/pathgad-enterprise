import { createFileRoute, Link } from "@tanstack/react-router";
import { Wrench } from "lucide-react";
import { useSiteSettings } from "@/lib/use-settings";

export const Route = createFileRoute("/maintenance")({
  head: () => ({ meta: [{ title: "Under Maintenance — PATHGAD" }] }),
  component: MaintenancePage,
});

function MaintenancePage() {
  const { settings } = useSiteSettings();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-navy px-6 text-center text-primary-foreground">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gold/20">
        <Wrench className="h-10 w-10 text-gold" />
      </div>
      <h1 className="mt-8 font-display text-4xl font-bold md:text-5xl">We'll be right back</h1>
      <p className="mt-4 max-w-xl text-base text-primary-foreground/80">
        {settings?.maintenance_message ||
          "We are performing scheduled maintenance. Please check back shortly."}
      </p>
      <p className="mt-8 text-xs uppercase tracking-widest text-gold/70">PATHGAD Enterprise</p>
      <Link to="/admin-login" className="mt-3 text-xs uppercase tracking-widest text-gold/80 hover:text-gold">
        Admin sign in →
      </Link>
    </div>
  );
}
