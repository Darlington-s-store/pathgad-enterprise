import { createFileRoute } from "@tanstack/react-router";
import { Placeholder } from "@/components/site/Placeholder";

export const Route = createFileRoute("/news")({
  head: () => ({ meta: [
    { title: "News & Updates — PATHGAD Enterprise" },
    { name: "description", content: "Company news, projects and industry updates from PATHGAD Enterprise." },
    { property: "og:title", content: "PATHGAD News" },
    { property: "og:description", content: "Latest from PATHGAD Enterprise." },
  ]}),
  component: News,
});

const articles = [
  { d: "May 12, 2026", c: "Construction", t: "PATHGAD breaks ground on Kumasi distribution hub", e: "A new 12,000 sqm warehouse complex begins construction this quarter." },
  { d: "Apr 28, 2026", c: "Logistics", t: "Expanded haulage fleet for the northern corridor", e: "Twelve new long-haul tractors join the fleet to serve Burkina-bound clients." },
  { d: "Mar 15, 2026", c: "Trading", t: "New leather supplier partnership in Italy", e: "Premium-grade leather sourcing now available for bulk Ghanaian buyers." },
  { d: "Feb 03, 2026", c: "Company", t: "PATHGAD certified PPA vendor", e: "We've been added to the Public Procurement Authority approved vendor registry." },
];

function News() {
  return (
    <>
      <section className="bg-navy py-16 text-primary-foreground">
        <div className="container-pg">
          <span className="text-xs font-semibold uppercase tracking-widest text-gold">Newsroom</span>
          <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">News & Updates.</h1>
        </div>
      </section>

      <section className="container-pg py-16">
        <div className="grid gap-6 md:grid-cols-2">
          {articles.map((a) => (
            <article key={a.t} className="overflow-hidden rounded-xl border-hairline border-border bg-card transition-all hover:-translate-y-1 hover:border-gold">
              <Placeholder label={a.c} ratio="aspect-[2/1]" />
              <div className="p-6">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{a.d}</span>
                  <span className="rounded-full bg-gold/15 px-2 py-0.5 font-semibold text-navy">{a.c}</span>
                </div>
                <h2 className="mt-3 font-display text-xl font-bold text-navy">{a.t}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{a.e}</p>
                <button className="mt-4 text-sm font-semibold text-navy hover:text-gold">Read more →</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
