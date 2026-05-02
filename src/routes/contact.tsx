import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Phone, Mail, MapPin, Clock, Loader2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [
    { title: "Contact — PATHGAD Enterprise" },
    { name: "description", content: "Reach PATHGAD Enterprise — Kumasi, Ghana." },
    { property: "og:title", content: "Contact PATHGAD" },
    { property: "og:description", content: "Office, phone, email, and contact form." },
  ]}),
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(2, "Name required").max(100),
  email: z.string().trim().email("Valid email required").max(255),
  subject: z.string().min(1, "Pick a subject"),
  message: z.string().trim().min(10, "Min 10 characters").max(2000),
});
type Form = z.infer<typeof schema>;

function Contact() {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<Form>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: Form) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    toast.success("Message sent. We'll be in touch soon.");
    reset();
  };

  return (
    <>
      <section className="bg-navy py-16 text-primary-foreground">
        <div className="container-pg">
          <span className="text-xs font-semibold uppercase tracking-widest text-gold">Get in touch</span>
          <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">Let's talk.</h1>
        </div>
      </section>

      <section className="container-pg grid gap-10 py-16 md:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl font-bold text-navy">Reach PATHGAD</h2>
          <div className="mt-6 space-y-5 text-sm">
            <div className="flex gap-3"><MapPin className="h-5 w-5 shrink-0 text-gold" /><div><div className="font-semibold text-navy">Office</div><div className="text-muted-foreground">Adum Industrial Area, Kumasi, Ghana</div></div></div>
            <div className="flex gap-3"><Phone className="h-5 w-5 shrink-0 text-gold" /><div><div className="font-semibold text-navy">Phone</div><div className="text-muted-foreground">+233 XX XXX XXXX</div></div></div>
            <div className="flex gap-3"><Mail className="h-5 w-5 shrink-0 text-gold" /><div><div className="font-semibold text-navy">Email</div><div className="text-muted-foreground">info@pathgad.com</div></div></div>
            <div className="flex gap-3"><Clock className="h-5 w-5 shrink-0 text-gold" /><div><div className="font-semibold text-navy">Hours</div><div className="text-muted-foreground">Mon–Fri 8:00–17:00 · Sat 9:00–13:00</div></div></div>
          </div>
          <div className="mt-8 overflow-hidden rounded-lg border-hairline border-border">
            <iframe title="map" className="h-64 w-full" src="https://www.google.com/maps?q=Kumasi,Ghana&output=embed" />
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl border-hairline border-border bg-card p-7">
          <h2 className="font-display text-2xl font-bold text-navy">Send us a message</h2>
          <Field label="Full name" error={errors.name?.message}>
            <input {...register("name")} className="input" />
          </Field>
          <Field label="Email" error={errors.email?.message}>
            <input {...register("email")} type="email" className="input" />
          </Field>
          <Field label="Subject" error={errors.subject?.message}>
            <select {...register("subject")} className="input">
              <option value="">Choose one…</option>
              <option>General inquiry</option>
              <option>Quote request</option>
              <option>Partnership</option>
              <option>Other</option>
            </select>
          </Field>
          <Field label="Message" error={errors.message?.message}>
            <textarea {...register("message")} rows={5} className="input" />
          </Field>
          <button disabled={loading} className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-md bg-navy px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-navy/90 disabled:opacity-60">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />} Send message
          </button>
        </form>
      </section>

      <section className="container-pg grid gap-6 pb-20 md:grid-cols-3">
        {[{ i: Phone, t: "Call", d: "+233 XX XXX XXXX" }, { i: Mail, t: "Email", d: "info@pathgad.com" }, { i: MapPin, t: "Visit", d: "Kumasi, Ghana" }].map((c) => (
          <div key={c.t} className="rounded-xl border-hairline border-border bg-card p-6 text-center">
            <c.i className="mx-auto h-7 w-7 text-gold" />
            <div className="mt-3 font-display text-lg font-bold text-navy">{c.t}</div>
            <div className="mt-1 text-sm text-muted-foreground">{c.d}</div>
          </div>
        ))}
      </section>

      <style>{`.input{width:100%;border-radius:8px;border:0.5px solid var(--border);background:var(--background);padding:0.625rem 0.75rem;font-size:0.875rem;outline:none;transition:border-color .15s} .input:focus{border-color:var(--gold);box-shadow:0 0 0 3px color-mix(in oklab, var(--gold) 20%, transparent)}`}</style>
    </>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <label className="mb-1.5 block text-sm font-medium text-navy">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
