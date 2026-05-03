import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero } from "@/components/site/PageHero";
import heroProjects from "@/assets/hero-projects.jpg";
import imgConstruction from "@/assets/svc-construction.jpg";
import imgHaulage from "@/assets/svc-haulage.jpg";
import imgLeather from "@/assets/svc-leather.jpg";
import imgImport from "@/assets/svc-import-export.jpg";
import imgAir from "@/assets/svc-air-freight.jpg";
import imgTrading from "@/assets/svc-trading.jpg";

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
  { t: "Kumasi Warehouse Complex", c: "Construction", img: imgConstruction, d: "12,000 sqm distribution warehouse delivered in 14 months." },
  { t: "Tema-Ouagadougou Corridor", c: "Logistics", img: imgHaulage, d: "Weekly haulage operation moving consumer goods northbound." },
  { t: "Premium Leather Import", c: "Trading", img: imgLeather, d: "Quarterly imports of finished leather from Italy and Turkey." },
  { t: "Accra Office Tower", c: "Construction", img: heroProjects, d: "8-storey commercial fit-out completed for a financial services client." },
  { t: "Cocoa Export Logistics", c: "Logistics", img: imgAir, d: "Air-freight of premium cocoa samples to European buyers." },
  { t: "FMCG Wholesale Network", c: "Trading", img: imgTrading, d: "Distribution network covering 6 regions of Ghana." },
  { t: "West Africa Port Imports", c: "Logistics", img: imgImport, d: "Container clearing and inland distribution from Tema port." },
];
const cats = ["All", "Construction", "Logistics", "Trading"] as const;

function Projects() {
  const [f, setF] = useState<(typeof cats)[number]>("All");
  const list = f === "All" ? projects : projects.filter((p) => p.c === f);
  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title="Selected projects."
        subtitle="A snapshot of work delivered across construction, logistics and trading."
        image={heroProjects}
      />

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
              <img src={p.img} alt={p.t} loading="lazy" className="aspect-[3/2] w-full object-cover" />
              <div className="p-5">
                <span className="rounded-full bg-gold/15 px-2.5 py-1 text-xs font-semibold text-navy">{p.c}</span>
                <h3 className="mt-3 font-display text-lg font-bold text-navy">{p.t}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{p.d}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
