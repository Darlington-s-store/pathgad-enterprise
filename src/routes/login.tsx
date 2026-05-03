import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import toast from "sonner";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>) => ({ redirect: (s.redirect as string) || "/dashboard" }),
  head: () => ({ meta: [{ title: "Sign in — PATHGAD" }] }),
  component: Login,
});

const schema = z.object({ email: z.string().email("Enter a valid email"), password: z.string().min(8, "Min 8 characters") });
type Form = z.infer<typeof schema>;

function Login() {
  const nav = useNavigate();
  const { redirect } = useSearch({ from: "/login" });
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<Form>({ resolver: zodResolver(schema) });

  const onSubmit = async (d: Form) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword(d);
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back");
    nav({ to: redirect });
  };

  const google = async () => {
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + redirect });
    if (r.error) toast.error(r.error.message || "Google sign-in failed");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
      <div className="w-full max-w-md rounded-xl border-hairline border-border bg-card p-8">
        <Link to="/" className="mb-6 flex items-center justify-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-navy text-gold font-display font-bold">P</span>
          <span className="font-display text-xl font-bold text-navy">PATHGAD</span>
        </Link>
        <h1 className="text-center font-display text-2xl font-bold text-navy">Welcome back</h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">Sign in to your account</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-navy">Email</label>
            <input {...register("email")} type="email" className="input" />
            {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-navy">Password</label>
            <input {...register("password")} type="password" className="input" />
            {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>}
          </div>
          <button disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-navy px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />} Sign in
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          <Link to="/reset-password" className="text-muted-foreground hover:text-navy">Forgot password?</Link>
        </div>

        <div className="my-5 flex items-center gap-3"><div className="h-px flex-1 bg-border" /><span className="text-xs text-muted-foreground">OR</span><div className="h-px flex-1 bg-border" /></div>

        <button onClick={google} className="flex w-full items-center justify-center gap-2 rounded-md border-hairline border-border px-4 py-2.5 text-sm font-medium hover:bg-muted">
          <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47c-.28 1.46-1.13 2.7-2.4 3.53v2.93h3.87c2.27-2.09 3.55-5.18 3.55-8.7z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.07 7.94-2.91l-3.87-2.93c-1.07.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.27v3.09C3.25 21.3 7.31 24 12 24z"/><path fill="#FBBC05" d="M5.27 14.36c-.24-.72-.38-1.49-.38-2.36s.14-1.64.38-2.36V6.55H1.27C.46 8.16 0 9.99 0 12s.46 3.84 1.27 5.45l4-3.09z"/><path fill="#EA4335" d="M12 4.74c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.55l4 3.09C6.22 6.79 8.87 4.74 12 4.74z"/></svg>
          Continue with Google
        </button>

        <p className="mt-6 text-center text-sm text-muted-foreground">No account? <Link to="/register" className="font-semibold text-navy hover:text-gold">Register</Link></p>
      </div>
      <style>{`.input{width:100%;border-radius:8px;border:0.5px solid var(--border);background:var(--background);padding:0.625rem 0.75rem;font-size:0.875rem;outline:none} .input:focus{border-color:var(--gold);box-shadow:0 0 0 3px color-mix(in oklab,var(--gold) 20%, transparent)}`}</style>
    </div>
  );
}
