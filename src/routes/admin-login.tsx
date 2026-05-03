import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin-login")({
  head: () => ({ meta: [{ title: "Admin Sign in — PATHGAD" }] }),
  component: AdminLogin,
});

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Min 8 characters"),
});
type Form = z.infer<typeof schema>;

function AdminLogin() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<Form>({ resolver: zodResolver(schema) });

  const onSubmit = async (d: Form) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword(d);
    if (error) { setLoading(false); return toast.error(error.message); }

    const { data: roleRow } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id)
      .eq("role", "admin")
      .maybeSingle();

    setLoading(false);

    if (!roleRow) {
      await supabase.auth.signOut();
      return toast.error("This account does not have admin access.");
    }

    toast.success("Welcome, admin");
    nav({ to: "/admin" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy px-4 py-12">
      <div className="w-full max-w-md rounded-xl border-hairline border-white/10 bg-card p-8">
        <div className="mb-6 flex flex-col items-center gap-2">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-navy text-gold">
            <Shield className="h-6 w-6" />
          </span>
          <span className="font-display text-xl font-bold text-navy">PATHGAD Admin</span>
        </div>
        <h1 className="text-center font-display text-2xl font-bold text-navy">Restricted access</h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">Admin staff only. Sign in with your privileged account.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-navy">Admin email</label>
            <input {...register("email")} type="email" className="input" />
            {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-navy">Password</label>
            <input {...register("password")} type="password" className="input" />
            {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>}
          </div>
          <button disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-navy px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />} Sign in to admin
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Not an admin? <Link to="/login" search={{ redirect: "/dashboard" }} className="font-semibold text-navy hover:text-gold">User sign in</Link>
        </p>
      </div>
      <style>{`.input{width:100%;border-radius:8px;border:0.5px solid var(--border);background:var(--background);padding:0.625rem 0.75rem;font-size:0.875rem;outline:none} .input:focus{border-color:var(--gold);box-shadow:0 0 0 3px color-mix(in oklab,var(--gold) 20%, transparent)}`}</style>
    </div>
  );
}
