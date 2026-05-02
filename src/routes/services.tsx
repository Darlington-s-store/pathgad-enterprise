import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ArrowRight } from "lucide-react";
import { SERVICES } from "@/lib/services";
import { Placeholder } from "@/components/site/Placeholder";

export const Route = createFileRoute("/services")({
  head: () => ({ meta: [
    { title: "Services — PATHGAD Enterprise" },
    { name: "description", content: "Trading, construction, import/export, leather, haulage, passenger transport, air freight." },
    { property: "og:title", content: "PATHGAD Services" },
    { property: "og:description", content: "Seven service lines under one trusted partner." },
  ]}),
  component: Services,
});

function Services() {
  return (
    <>
      <section className="bg-navy py-16 text-primary-foreground">
        <div className="container-pg">
          <span className="text-xs font-semibold uppercase tracking-widest text-gold">Our Services</span>
          <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">Seven sectors of expertise.</h1>
        </div>
      </section>

      <div className="container-pg space-y-20 py-20">
        {SERVICES.map((s, idx) => (
          <section key={s.slug} className={`grid items-center gap-10 md:grid-cols-2 ${idx % 2 === 1 ? "md:[&>*:first-child]:order-last" : ""}`}>
            <Placeholder label={s.name} />
            <div>
              <s.icon className="h-10 w-10 text-gold" />
              <h2 className="mt-3 font-display text-3xl font-bold text-navy">{s.name}</h2>
              <p className="mt-3 text-muted-foreground">{s.desc}</p>
              <ul className="mt-5 space-y-2">
                {s.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" /> {b}
                  </li>
                ))}
              </ul>
              <Link to="/booking" search={{ service: s.slug } as never} className="mt-6 inline-flex items-center gap-2 rounded-md bg-navy px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-navy/90">
                Request a Quote <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
