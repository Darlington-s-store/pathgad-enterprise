import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "sonner";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Reset password — PATHGAD" }] }),
  component: Reset,
});

const schema = z.object({ email: z.string().email() });
type Form = z.infer<typeof schema>;

function Reset() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<Form>({ resolver: zodResolver(schema) });
  const onSubmit = async (d: Form) => {
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(d.email, { redirectTo: window.location.origin + "/reset-password" });
    setLoading(false);
    if (error) return toast.error(error.message);
    setSent(true);
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
      <div className="w-full max-w-md rounded-xl border-hairline border-border bg-card p-8">
        <Link to="/" className="mb-6 flex items-center justify-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-navy text-gold font-display font-bold">P</span>
          <span className="font-display text-xl font-bold text-navy">PATHGAD</span>
        </Link>
        <h1 className="text-center font-display text-2xl font-bold text-navy">Reset password</h1>
        {sent ? (
          <p className="mt-6 rounded-md bg-success/10 p-4 text-center text-sm text-navy">Check your email for a reset link.</p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy">Email</label>
              <input {...register("email")} type="email" className="input" />
              {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <button disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-navy px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />} Send reset link
            </button>
          </form>
        )}
        <p className="mt-6 text-center text-sm text-muted-foreground"><Link to="/login" className="font-semibold text-navy hover:text-gold">Back to sign in</Link></p>
      </div>
      <style>{`.input{width:100%;border-radius:8px;border:0.5px solid var(--border);background:var(--background);padding:0.625rem 0.75rem;font-size:0.875rem;outline:none} .input:focus{border-color:var(--gold);box-shadow:0 0 0 3px color-mix(in oklab,var(--gold) 20%, transparent)}`}</style>
    </div>
  );
}
