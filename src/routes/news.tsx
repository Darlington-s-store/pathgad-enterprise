import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import heroNews from "@/assets/hero-news.jpg";
import imgConstruction from "@/assets/svc-construction.jpg";
import imgHaulage from "@/assets/svc-haulage.jpg";
import imgLeather from "@/assets/svc-leather.jpg";
import imgAbout from "@/assets/hero-about.jpg";

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
  { d: "May 12, 2026", c: "Construction", img: imgConstruction, t: "PATHGAD breaks ground on Kumasi distribution hub", e: "A new 12,000 sqm warehouse complex begins construction this quarter." },
  { d: "Apr 28, 2026", c: "Logistics", img: imgHaulage, t: "Expanded haulage fleet for the northern corridor", e: "Twelve new long-haul tractors join the fleet to serve Burkina-bound clients." },
  { d: "Mar 15, 2026", c: "Trading", img: imgLeather, t: "New leather supplier partnership in Italy", e: "Premium-grade leather sourcing now available for bulk Ghanaian buyers." },
  { d: "Feb 03, 2026", c: "Company", img: imgAbout, t: "PATHGAD certified PPA vendor", e: "We've been added to the Public Procurement Authority approved vendor registry." },
];

function News() {
  return (
    <>
      <PageHero
        eyebrow="Newsroom"
        title="News & Updates."
        subtitle="The latest milestones, partnerships and industry insight from PATHGAD."
        image={heroNews}
      />

      <section className="container-pg py-16">
        <div className="grid gap-6 md:grid-cols-2">
          {articles.map((a) => (
            <article key={a.t} className="overflow-hidden rounded-xl border-hairline border-border bg-card transition-all hover:-translate-y-1 hover:border-gold">
              <img src={a.img} alt={a.t} loading="lazy" className="aspect-[2/1] w-full object-cover" />
              <div className="p-6">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{a.d}</span>
                  <span className="rounded-full bg-gold/15 px-2 py-0.5 font-semibold text-navy">{a.c}</span>
                </div>
                <h2 className="mt-3 font-display text-xl font-bold text-navy">{a.t}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{a.e}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
