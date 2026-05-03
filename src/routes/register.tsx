import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create account — PATHGAD" }] }),
  component: Register,
});

const schema = z.object({
  full_name: z.string().trim().min(2, "Name required").max(100),
  email: z.string().email("Valid email required"),
  phone: z.string().trim().min(7, "Phone required").max(20),
  password: z.string().min(8, "Min 8 characters"),
  confirm: z.string(),
  terms: z.boolean().refine((v) => v, "You must accept terms"),
}).refine((d) => d.password === d.confirm, { path: ["confirm"], message: "Passwords don't match" });
type Form = z.infer<typeof schema>;

function strength(p: string) {
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return s;
}

function Register() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<Form>({ resolver: zodResolver(schema) });
  const pw = watch("password") || "";
  const s = strength(pw);
  const colors = ["bg-border", "bg-destructive", "bg-gold", "bg-gold", "bg-success"];
  const labels = ["", "Weak", "Fair", "Good", "Strong"];

  const onSubmit = async (d: Form) => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: d.email,
      password: d.password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: { full_name: d.full_name, phone: d.phone },
      },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Account created. You can sign in now.");
    nav({ to: "/login", search: { redirect: "/dashboard" } });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
      <div className="w-full max-w-md rounded-xl border-hairline border-border bg-card p-8">
        <Link to="/" className="mb-6 flex items-center justify-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-navy text-gold font-display font-bold">P</span>
          <span className="font-display text-xl font-bold text-navy">PATHGAD</span>
        </Link>
        <h1 className="text-center font-display text-2xl font-bold text-navy">Create your account</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <Field label="Full name" error={errors.full_name?.message}><input {...register("full_name")} className="input" /></Field>
          <Field label="Email" error={errors.email?.message}><input {...register("email")} type="email" className="input" /></Field>
          <Field label="Phone" error={errors.phone?.message}><input {...register("phone")} className="input" /></Field>
          <Field label="Password" error={errors.password?.message}><input {...register("password")} type="password" className="input" /></Field>
          {pw && (
            <div>
              <div className="flex gap-1">
                {[1,2,3,4].map((i) => <div key={i} className={`h-1 flex-1 rounded ${i <= s ? colors[s] : "bg-border"}`} />)}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">{labels[s]}</div>
            </div>
          )}
          <Field label="Confirm password" error={errors.confirm?.message}><input {...register("confirm")} type="password" className="input" /></Field>
          <label className="flex items-start gap-2 text-sm">
            <input {...register("terms")} type="checkbox" className="mt-0.5" />
            <span className="text-muted-foreground">I accept the terms & conditions</span>
          </label>
          {errors.terms && <p className="text-xs text-destructive">{errors.terms.message}</p>}
          <button disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-navy px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />} Create account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">Have an account? <Link to="/login" search={{ redirect: "/dashboard" }} className="font-semibold text-navy hover:text-gold">Sign in</Link></p>
      </div>
      <style>{`.input{width:100%;border-radius:8px;border:0.5px solid var(--border);background:var(--background);padding:0.625rem 0.75rem;font-size:0.875rem;outline:none} .input:focus{border-color:var(--gold);box-shadow:0 0 0 3px color-mix(in oklab,var(--gold) 20%, transparent)}`}</style>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <div><label className="mb-1.5 block text-sm font-medium text-navy">{label}</label>{children}{error && <p className="mt-1 text-xs text-destructive">{error}</p>}</div>;
}
