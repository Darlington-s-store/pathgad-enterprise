import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, CheckCircle2, Clock, Circle } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { SERVICES } from "@/lib/services";
import { PageHero } from "@/components/site/PageHero";
import heroBooking from "@/assets/hero-booking.jpg";

export const Route = createFileRoute("/booking")({
  validateSearch: (s: Record<string, unknown>) => ({ service: (s.service as string) || "" }),
  head: () => ({ meta: [{ title: "Booking & Inquiry — PATHGAD" }] }),
  component: Booking,
});

const ref = () => `PG-2026-${Math.floor(10000 + Math.random() * 90000)}`;

function Booking() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const [tab, setTab] = useState<"appointment" | "quote" | "track">("appointment");

  useEffect(() => {
    if (!loading && !user) nav({ to: "/login", search: { redirect: "/booking" } });
  }, [loading, user, nav]);

  if (loading || !user) return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-navy" /></div>;

  return (
    <>
      <PageHero
        eyebrow="Booking"
        title="Book, request a quote, or track an inquiry."
        subtitle="Schedule a consultation, request pricing, or check the status of an existing request."
        image={heroBooking}
      />

      <section className="container-pg py-12">
        <div className="mb-6 inline-flex rounded-lg border-hairline border-border bg-card p-1">
          {([
            { k: "appointment", l: "Appointment" },
            { k: "quote", l: "Request Quote" },
            { k: "track", l: "Track Inquiry" },
          ] as const).map((t) => (
            <button key={t.k} onClick={() => setTab(t.k)} className={`rounded-md px-5 py-2 text-sm font-medium transition-colors ${tab === t.k ? "bg-navy text-primary-foreground" : "text-muted-foreground hover:text-navy"}`}>{t.l}</button>
          ))}
        </div>

        <div className="rounded-xl border-hairline border-border bg-card p-7 md:p-10">
          {tab === "appointment" && <AppointmentForm />}
          {tab === "quote" && <QuoteForm />}
          {tab === "track" && <TrackForm />}
        </div>
      </section>

      <style>{`.input{width:100%;border-radius:8px;border:0.5px solid var(--border);background:var(--background);padding:0.625rem 0.75rem;font-size:0.875rem;outline:none} .input:focus{border-color:var(--gold);box-shadow:0 0 0 3px color-mix(in oklab,var(--gold) 20%, transparent)}`}</style>
    </>
  );
}

const apptSchema = z.object({
  full_name: z.string().min(2),
  company: z.string().optional(),
  phone: z.string().min(7),
  email: z.string().email(),
  service: z.string().min(1, "Pick a service"),
  meeting_type: z.string().min(1),
  preferred_date: z.string().min(1),
  preferred_time: z.string().min(1),
  notes: z.string().optional(),
});
type Appt = z.infer<typeof apptSchema>;

function AppointmentForm() {
  const { user } = useAuth();
  const { service: preset } = Route.useSearch();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<Appt>({
    resolver: zodResolver(apptSchema),
    defaultValues: { service: preset, email: user?.email || "" },
  });

  const onSubmit = async (d: Appt) => {
    setLoading(true);
    const reference = ref();
    const { error } = await supabase.from("bookings").insert({ ...d, reference, user_id: user!.id });
    setLoading(false);
    if (error) return toast.error(error.message);
    setDone(reference);
    toast.success("Appointment booked");
    reset();
  };

  if (done) return <Success ref_={done} onAgain={() => setDone(null)} />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
      <Field label="Full name" error={errors.full_name?.message}><input {...register("full_name")} className="input" /></Field>
      <Field label="Company (optional)"><input {...register("company")} className="input" /></Field>
      <Field label="Phone" error={errors.phone?.message}><input {...register("phone")} className="input" /></Field>
      <Field label="Email" error={errors.email?.message}><input {...register("email")} type="email" className="input" /></Field>
      <Field label="Service interest" error={errors.service?.message}>
        <select {...register("service")} className="input"><option value="">Select…</option>{SERVICES.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}</select>
      </Field>
      <Field label="Meeting type" error={errors.meeting_type?.message}>
        <select {...register("meeting_type")} className="input"><option value="">Select…</option><option>Office visit</option><option>Site visit</option><option>Video call</option><option>Phone call</option></select>
      </Field>
      <Field label="Preferred date" error={errors.preferred_date?.message}><input {...register("preferred_date")} type="date" className="input" /></Field>
      <Field label="Preferred time" error={errors.preferred_time?.message}><input {...register("preferred_time")} type="time" className="input" /></Field>
      <div className="md:col-span-2"><Field label="Notes"><textarea {...register("notes")} rows={4} className="input" /></Field></div>
      <div className="md:col-span-2"><SubmitBtn loading={loading}>Book Appointment</SubmitBtn></div>
    </form>
  );
}

const quoteSchema = z.object({
  full_name: z.string().min(2),
  company: z.string().optional(),
  phone: z.string().min(7),
  email: z.string().email(),
  service: z.string().min(1),
  origin: z.string().optional(),
  destination: z.string().optional(),
  cargo_type: z.string().optional(),
  weight: z.string().optional(),
  budget: z.string().min(1),
  urgency: z.string().min(1),
  description: z.string().min(10),
});
type Quote = z.infer<typeof quoteSchema>;
const URGENCIES = ["No rush", "Within 2 weeks", "Within 1 week", "Urgent 48hrs"];

function QuoteForm() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [urgency, setUrgency] = useState("No rush");
  const { register, handleSubmit, watch, setValue, formState: { errors }, reset } = useForm<Quote>({
    resolver: zodResolver(quoteSchema),
    defaultValues: { email: user?.email || "", urgency: "No rush" },
  });
  const svc = watch("service");
  const isLogistics = svc === "haulage" || svc === "air-freight";

  const onSubmit = async (d: Quote) => {
    setLoading(true);
    const reference = ref();
    const { error } = await supabase.from("inquiries").insert({ ...d, reference, user_id: user!.id });
    setLoading(false);
    if (error) return toast.error(error.message);
    setDone(reference); toast.success("Quote requested"); reset();
  };

  if (done) return <Success ref_={done} onAgain={() => setDone(null)} />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
      <Field label="Full name" error={errors.full_name?.message}><input {...register("full_name")} className="input" /></Field>
      <Field label="Company"><input {...register("company")} className="input" /></Field>
      <Field label="Phone" error={errors.phone?.message}><input {...register("phone")} className="input" /></Field>
      <Field label="Email" error={errors.email?.message}><input {...register("email")} type="email" className="input" /></Field>
      <Field label="Service required" error={errors.service?.message}>
        <select {...register("service")} className="input"><option value="">Select…</option>{SERVICES.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}</select>
      </Field>
      <Field label="Budget range" error={errors.budget?.message}>
        <select {...register("budget")} className="input"><option value="">Select…</option><option>Under $5,000</option><option>$5,000 – $25,000</option><option>$25,000 – $100,000</option><option>$100,000+</option></select>
      </Field>
      {isLogistics && (
        <>
          <Field label="Origin"><input {...register("origin")} className="input" /></Field>
          <Field label="Destination"><input {...register("destination")} className="input" /></Field>
          <Field label="Cargo type"><input {...register("cargo_type")} className="input" /></Field>
          <Field label="Weight / volume"><input {...register("weight")} className="input" /></Field>
        </>
      )}
      <div className="md:col-span-2">
        <label className="mb-1.5 block text-sm font-medium text-navy">Urgency</label>
        <div className="flex flex-wrap gap-2">
          {URGENCIES.map((u) => (
            <button key={u} type="button" onClick={() => { setUrgency(u); setValue("urgency", u); }} className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${urgency === u ? "bg-navy text-primary-foreground" : "border-hairline border-border hover:border-gold"}`}>{u}</button>
          ))}
        </div>
      </div>
      <div className="md:col-span-2"><Field label="Description" error={errors.description?.message}><textarea {...register("description")} rows={4} className="input" /></Field></div>
      <div className="md:col-span-2"><Field label="Attach file (PDF/image, max 10MB)"><input type="file" accept=".pdf,image/*" className="input" /></Field></div>
      <div className="md:col-span-2"><SubmitBtn loading={loading}>Request Quote</SubmitBtn></div>
    </form>
  );
}

function TrackForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ status: string; created_at: string; service: string } | null>(null);
  const [reference, setReference] = useState("");
  const [email, setEmail] = useState("");

  const track = async () => {
    if (!reference || !email) return toast.error("Reference and email required");
    setLoading(true);
    const { data, error } = await supabase.rpc("track_inquiry", { _reference: reference, _email: email });
    setLoading(false);
    if (error) return toast.error(error.message);
    if (!data || data.length === 0) { setResult(null); return toast.error("No record found"); }
    setResult(data[0] as { status: string; created_at: string; service: string });
  };

  const steps = ["Received", "Under Review", "Quote Sent", "Closed"];
  const idx = result ? Math.max(0, steps.indexOf(result.status)) : -1;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-4">
        <Field label="Reference number"><input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="PG-2026-XXXXX" className="input" /></Field>
        <Field label="Email"><input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="input" /></Field>
        <SubmitBtn loading={loading} onClick={track} type="button">Track</SubmitBtn>
      </div>
      {result && (
        <div className="rounded-lg border-hairline border-border bg-muted/30 p-6">
          <div className="text-sm text-muted-foreground">Service</div>
          <div className="mb-5 font-display text-lg font-bold text-navy">{result.service}</div>
          <ol className="space-y-4">
            {steps.map((s, i) => (
              <li key={s} className="flex items-start gap-3">
                {i < idx ? <CheckCircle2 className="h-5 w-5 text-success" /> : i === idx ? <Clock className="h-5 w-5 text-gold" /> : <Circle className="h-5 w-5 text-border" />}
                <div>
                  <div className={`text-sm font-medium ${i <= idx ? "text-navy" : "text-muted-foreground"}`}>{s}</div>
                  {i <= idx && <div className="text-xs text-muted-foreground">{new Date(result.created_at).toLocaleString()}</div>}
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <div><label className="mb-1.5 block text-sm font-medium text-navy">{label}</label>{children}{error && <p className="mt-1 text-xs text-destructive">{error}</p>}</div>;
}
function SubmitBtn({ loading, children, ...rest }: { loading: boolean; children: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...rest} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-md bg-navy px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-navy/90 disabled:opacity-60">{loading && <Loader2 className="h-4 w-4 animate-spin" />} {children}</button>;
}
function Success({ ref_, onAgain }: { ref_: string; onAgain: () => void }) {
  return (
    <div className="text-center py-8">
      <CheckCircle2 className="mx-auto h-14 w-14 text-success" />
      <h3 className="mt-4 font-display text-2xl font-bold text-navy">Submitted successfully</h3>
      <p className="mt-2 text-sm text-muted-foreground">Your reference number is</p>
      <div className="mt-3 inline-block rounded-md bg-navy px-5 py-2 font-display text-xl font-bold text-gold">{ref_}</div>
      <div className="mt-6 flex justify-center gap-3">
        <button onClick={onAgain} className="rounded-md border-hairline border-border px-5 py-2 text-sm font-medium hover:border-gold">Submit another</button>
        <Link to="/dashboard" className="rounded-md bg-navy px-5 py-2 text-sm font-semibold text-primary-foreground">Go to dashboard</Link>
      </div>
    </div>
  );
}
