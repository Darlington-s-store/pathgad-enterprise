import { Link } from "@tanstack/react-router";
import { Facebook, Linkedin, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-navy text-primary-foreground">
      <div className="container-pg grid gap-10 py-14 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-gold font-display font-bold text-navy">P</span>
            <span className="font-display text-lg font-bold">PATHGAD ENTERPRISE</span>
          </div>
          <p className="mt-4 text-sm text-primary-foreground/70">
            Ghana's multi-sector enterprise — trading, construction, and logistics under one trusted partner.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-gold">Company</h4>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/80">
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/projects">Projects</Link></li>
            <li><Link to="/news">News</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-gold">Reach Us</h4>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/80">
            <li>Kumasi, Ghana</li>
            <li>+233 XX XXX XXXX</li>
            <li>info@pathgad.com</li>
            <li><Link to="/contact">Contact form</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-gold">Follow</h4>
          <div className="mt-4 flex gap-3">
            <a aria-label="Facebook" href="#" className="rounded-full border-hairline border-white/30 p-2 hover:border-gold"><Facebook className="h-4 w-4" /></a>
            <a aria-label="LinkedIn" href="#" className="rounded-full border-hairline border-white/30 p-2 hover:border-gold"><Linkedin className="h-4 w-4" /></a>
            <a aria-label="Twitter" href="#" className="rounded-full border-hairline border-white/30 p-2 hover:border-gold"><Twitter className="h-4 w-4" /></a>
          </div>
          <p className="mt-6 text-xs text-primary-foreground/60">Reg. No: PG-GH-2024<br />© {new Date().getFullYear()} PATHGAD Enterprise</p>
        </div>
      </div>
    </footer>
  );
}
