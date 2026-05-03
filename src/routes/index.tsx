import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Quote, Star } from "lucide-react";
import { SERVICES } from "@/lib/services";
import heroHome from "@/assets/hero-home.jpg";
import heroAbout from "@/assets/hero-about.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PATHGAD Enterprise — Trade, Construction & Logistics in Ghana" },
      { name: "description", content: "From trade to transport — one trusted partner across Ghana and West Africa." },
    ],
  }),
  component: Index,
});

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.floor(v).toLocaleString() + suffix);
  const [text, setText] = useState("0" + suffix);
  useEffect(() => {
    if (!inView) return;
    const c = animate(mv, to, { duration: 1.6, ease: "easeOut" });
    const u = rounded.on("change", setText);
    return () => { c.stop(); u(); };
  }, [inView, to, mv, rounded]);
  return <span ref={ref}>{text}</span>;
}

const stats = [
  { n: 12, s: "+", l: "Years in Business" },
  { n: 240, s: "+", l: "Projects Completed" },
  { n: 18, s: "", l: "Countries Reached" },
  { n: 950, s: "+", l: "Happy Clients" },
];

const testimonials = [
  { name: "Kwame Asante", co: "Asante Holdings", q: "PATHGAD delivered our warehouse construction on time and within budget. Truly a trusted partner." },
  { name: "Adwoa Mensah", co: "Mensah Imports Ltd", q: "Their import logistics team handled our leather shipments flawlessly. Communication was excellent throughout." },
  { name: "Joseph Owusu", co: "Owusu Logistics", q: "Reliable haulage across the Tema corridor. We've never had a delayed delivery in two years." },
];

function Index() {
  const [t, setT] = useState(0);
  useEffect(() => { const i = setInterval(() => setT((v) => (v + 1) % testimonials.length), 5000); return () => clearInterval(i); }, []);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-navy text-primary-foreground">
        <img src={heroHome} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0" style={{
          background: "radial-gradient(circle at 20% 30%, rgba(200,149,42,0.25) 0%, transparent 50%), linear-gradient(180deg, rgba(13,27,62,0.85), rgba(13,27,62,0.95))",
        }} />
        <div className="container-pg relative grid gap-12 py-20 md:grid-cols-2 md:py-28">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="inline-block rounded-full border-hairline border-gold/40 px-3 py-1 text-xs font-medium uppercase tracking-widest text-gold">Ghana · Established Enterprise</span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] md:text-6xl">
              From Trade to Transport — <span className="text-gold">One Trusted Partner</span>
            </h1>
            <p className="mt-5 max-w-lg text-base text-primary-foreground/80 md:text-lg">
              Ghana's multi-sector enterprise spanning trading, construction, and logistics.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#services" className="inline-flex items-center gap-2 rounded-md bg-gold px-5 py-3 text-sm font-semibold text-navy transition-transform hover:-translate-y-0.5">
                Explore Services <ArrowRight className="h-4 w-4" />
              </a>
              <Link to="/booking" search={{ service: "" }} className="inline-flex items-center gap-2 rounded-md border-hairline border-white/40 px-5 py-3 text-sm font-semibold text-primary-foreground hover:border-gold">
                Book Appointment
              </Link>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative">
            <img src={heroHome} alt="PATHGAD logistics in Ghana" width={1600} height={1280} className="aspect-[5/4] w-full rounded-lg object-cover shadow-2xl" />
          </motion.div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="container-pg py-20">
        <div className="mb-12 max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-gold">What we do</span>
          <h2 className="mt-2 font-display text-3xl font-bold text-navy md:text-4xl">Seven sectors. One partner.</h2>
          <p className="mt-3 text-muted-foreground">Comprehensive capabilities across trade, construction, and logistics.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {SERVICES.map((s) => (
            <Link key={s.slug} to="/services" className="group rounded-xl border-hairline border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-gold">
              <s.icon className="h-8 w-8 text-navy transition-colors group-hover:text-gold" />
              <h3 className="mt-4 font-display text-lg font-semibold text-navy">{s.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="bg-navy text-primary-foreground">
        <div className="container-pg grid grid-cols-2 gap-8 py-14 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.l}>
              <div className="font-display text-4xl font-bold text-gold md:text-5xl">
                <Counter to={s.n} suffix={s.s} />
              </div>
              <div className="mt-2 text-sm uppercase tracking-wider text-primary-foreground/70">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT SNIPPET */}
      <section className="container-pg grid items-center gap-12 py-20 md:grid-cols-2">
        <img src={heroAbout} alt="PATHGAD team" loading="lazy" className="aspect-[4/3] w-full rounded-lg object-cover" />
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-gold">About PATHGAD</span>
          <h2 className="mt-2 font-display text-3xl font-bold text-navy md:text-4xl">Built on integrity, scaled by execution.</h2>
          <p className="mt-4 text-muted-foreground">From a small trading operation to a multi-sector enterprise, PATHGAD has spent over a decade building infrastructure, moving goods, and connecting Ghana to global markets.</p>
          <Link to="/about" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-navy hover:text-gold">
            Read our story <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-muted/40 py-20">
        <div className="container-pg">
          <div className="mb-10 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-gold">Testimonials</span>
            <h2 className="mt-2 font-display text-3xl font-bold text-navy md:text-4xl">Trusted by partners across West Africa</h2>
          </div>
          <div className="mx-auto max-w-3xl rounded-xl border-hairline border-border bg-card p-8 md:p-12">
            <Quote className="h-8 w-8 text-gold" />
            <motion.p key={t} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 font-display text-xl text-navy md:text-2xl">
              "{testimonials[t].q}"
            </motion.p>
            <div className="mt-6 flex items-center justify-between">
              <div>
                <div className="font-semibold text-navy">{testimonials[t].name}</div>
                <div className="text-sm text-muted-foreground">{testimonials[t].co}</div>
              </div>
              <div className="flex gap-1">{[0,1,2,3,4].map((i) => <Star key={i} className="h-4 w-4 fill-gold text-gold" />)}</div>
            </div>
            <div className="mt-6 flex justify-center gap-2">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setT(i)} className={`h-1.5 rounded-full transition-all ${i === t ? "w-8 bg-navy" : "w-2 bg-border"}`} aria-label={`Slide ${i + 1}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy py-16 text-primary-foreground">
        <div className="container-pg flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
          <h2 className="font-display text-2xl font-bold md:text-3xl">Ready to start a project with PATHGAD?</h2>
          <Link to="/contact" className="inline-flex items-center gap-2 rounded-md bg-gold px-6 py-3 text-sm font-semibold text-navy hover:-translate-y-0.5">
            Contact Us <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
