import { createFileRoute } from "@tanstack/react-router";
import { Placeholder } from "@/components/site/Placeholder";
import { Award, Target, Heart, Eye } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [
    { title: "About — PATHGAD Enterprise" },
    { name: "description", content: "Learn about PATHGAD's story, mission and certifications." },
    { property: "og:title", content: "About PATHGAD Enterprise" },
    { property: "og:description", content: "A multi-sector Ghanaian enterprise built on integrity." },
  ]}),
  component: About,
});

function About() {
  return (
    <>
      <section className="bg-navy py-16 text-primary-foreground">
        <div className="container-pg">
          <span className="text-xs font-semibold uppercase tracking-widest text-gold">About Us</span>
          <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">Building Ghana's connected economy.</h1>
        </div>
      </section>

      <section className="container-pg grid items-center gap-12 py-16 md:grid-cols-2">
        <Placeholder label="Founders" />
        <div>
          <h2 className="font-display text-3xl font-bold text-navy">Our Story</h2>
          <p className="mt-4 text-muted-foreground">
            Founded in Kumasi over a decade ago, PATHGAD Enterprise began as a regional trading firm and has grown into a multi-sector business connecting Ghana's economy through trade, construction, and logistics.
          </p>
          <p className="mt-3 text-muted-foreground">
            Today we operate across seven service lines, partnering with importers, contractors, and businesses across West Africa to deliver dependable, end-to-end service.
          </p>
        </div>
      </section>

      <section className="bg-muted/40 py-16">
        <div className="container-pg grid gap-6 md:grid-cols-3">
          {[
            { i: Target, t: "Mission", d: "To connect Ghanaian businesses to global markets through reliable trade, construction, and transport services." },
            { i: Eye, t: "Vision", d: "To become West Africa's most trusted multi-sector enterprise by 2030." },
            { i: Heart, t: "Core Values", d: "Integrity. Reliability. Excellence. Partnership." },
          ].map((c) => (
            <div key={c.t} className="rounded-xl border-hairline border-border bg-card p-7">
              <c.i className="h-8 w-8 text-gold" />
              <h3 className="mt-4 font-display text-xl font-bold text-navy">{c.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-pg py-16">
        <div className="rounded-xl border-hairline border-border bg-card p-8">
          <div className="flex items-start gap-4">
            <Award className="h-8 w-8 shrink-0 text-gold" />
            <div>
              <h3 className="font-display text-xl font-bold text-navy">Registration & Certification</h3>
              <p className="mt-2 text-sm text-muted-foreground">Registered with the Registrar General's Department of Ghana. Certified by the Ghana Chamber of Commerce. ISO-aligned operating standards across all service lines.</p>
              <ul className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                <li>• Reg. No: PG-GH-2024</li>
                <li>• TIN: C0000000000</li>
                <li>• PPA Vendor Registered</li>
                <li>• GSA Certified Carrier</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
