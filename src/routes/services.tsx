import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ArrowRight } from "lucide-react";
import { SERVICES } from "@/lib/services";
import { PageHero } from "@/components/site/PageHero";
import heroServices from "@/assets/hero-services.jpg";

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
      <PageHero
        eyebrow="Our Services"
        title="Seven sectors of expertise."
        subtitle="From wholesale trading to global air freight — one accountable partner across the value chain."
        image={heroServices}
      />

      {/* Grid of service cards */}
      <section className="container-pg py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <a
              key={s.slug}
              href={`#${s.slug}`}
              className="group overflow-hidden rounded-xl border-hairline border-border bg-card transition-all hover:-translate-y-1 hover:border-gold hover:shadow-lg"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={s.image}
                  alt={s.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent" />
                <s.icon className="absolute left-4 top-4 h-8 w-8 text-gold drop-shadow-lg" />
              </div>
              <div className="p-5">
                <h3 className="font-display text-xl font-bold text-navy">{s.name}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{s.desc}</p>
                <div className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-gold">
                  Learn more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Detailed alternating sections */}
      <div className="container-pg space-y-20 pb-20">
        {SERVICES.map((s, idx) => (
          <section
            key={s.slug}
            id={s.slug}
            className={`scroll-mt-24 grid items-center gap-10 md:grid-cols-2 ${idx % 2 === 1 ? "md:[&>*:first-child]:order-last" : ""}`}
          >
            <img
              src={s.image}
              alt={s.name}
              loading="lazy"
              className="aspect-[4/3] w-full rounded-lg object-cover shadow-lg"
            />
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
              <Link
                to="/booking"
                search={{ service: s.slug }}
                className="mt-6 inline-flex items-center gap-2 rounded-md bg-navy px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-navy/90"
              >
                Request a Quote <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
