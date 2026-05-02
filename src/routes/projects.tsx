import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Placeholder } from "@/components/site/Placeholder";

export const Route = createFileRoute("/projects")({
  head: () => ({ meta: [
    { title: "Projects — PATHGAD Enterprise" },
    { name: "description", content: "A selection of construction, logistics and trading projects delivered by PATHGAD." },
    { property: "og:title", content: "PATHGAD Projects" },
    { property: "og:description", content: "Selected construction, logistics, and trading work." },
  ]}),
  component: Projects,
});

const projects = [
  { t: "Kumasi Warehouse Complex", c: "Construction", d: "12,000 sqm distribution warehouse delivered in 14 months." },
  { t: "Tema-Ouagadougou Corridor", c: "Logistics", d: "Weekly haulage operation moving consumer goods northbound." },
  { t: "Premium Leather Import", c: "Trading", d: "Quarterly imports of finished leather from Italy and Turkey." },
  { t: "Accra Office Tower", c: "Construction", d: "8-storey commercial fit-out completed for a financial services client." },
  { t: "Cocoa Export Logistics", c: "Logistics", d: "Air-freight of premium cocoa samples to European buyers." },
  { t: "FMCG Wholesale Network", c: "Trading", d: "Distribution network covering 6 regions of Ghana." },
];
const cats = ["All", "Construction", "Logistics", "Trading"] as const;

function Projects() {
  const [f, setF] = useState<(typeof cats)[number]>("All");
  const list = f === "All" ? projects : projects.filter((p) => p.c === f);
  return (
    <>
      <section className="bg-navy py-16 text-primary-foreground">
        <div className="container-pg">
          <span className="text-xs font-semibold uppercase tracking-widest text-gold">Portfolio</span>
          <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">Selected projects.</h1>
        </div>
      </section>

      <section className="container-pg py-12">
        <div className="mb-8 flex flex-wrap gap-2">
          {cats.map((c) => (
            <button key={c} onClick={() => setF(c)} className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${f === c ? "bg-navy text-primary-foreground" : "border-hairline border-border bg-card hover:border-gold"}`}>
              {c}
            </button>
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <article key={p.t} className="overflow-hidden rounded-xl border-hairline border-border bg-card transition-all hover:-translate-y-1 hover:border-gold">
              <Placeholder label={p.t} ratio="aspect-[3/2]" />
              <div className="p-5">
                <span className="rounded-full bg-gold/15 px-2.5 py-1 text-xs font-semibold text-navy">{p.c}</span>
                <h3 className="mt-3 font-display text-lg font-bold text-navy">{p.t}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{p.d}</p>
                <button className="mt-4 text-sm font-semibold text-navy hover:text-gold">View Details →</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
