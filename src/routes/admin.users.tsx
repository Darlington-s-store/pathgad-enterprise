import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { DataTable } from "@/components/site/DataTable";

type Profile = { id: string; full_name: string | null; phone: string | null; company: string | null; created_at: string };
type Role = { user_id: string; role: string };

export const Route = createFileRoute("/admin/users")({
  component: AdminUsers,
});

function AdminUsers() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  const load = () => {
    supabase.from("profiles").select("id, full_name, phone, company, created_at").order("created_at", { ascending: false }).then(({ data }) => setProfiles((data as Profile[]) || []));
    supabase.from("user_roles").select("user_id, role").then(({ data }) => setRoles((data as Role[]) || []));
  };

  useEffect(() => { load(); }, []);

  const isAdmin = (id: string) => roles.some((r) => r.user_id === id && r.role === "admin");

  const toggleAdmin = async (id: string) => {
    if (isAdmin(id)) {
      const { error } = await supabase.from("user_roles").delete().eq("user_id", id).eq("role", "admin");
      if (error) return toast.error(error.message);
      toast.success("Admin removed");
    } else {
      const { error } = await supabase.from("user_roles").insert({ user_id: id, role: "admin" });
      if (error) return toast.error(error.message);
      toast.success("Admin granted");
    }
    load();
  };

  return (
    <>
      <h1 className="font-display text-3xl font-bold text-navy">Users & Roles</h1>
      <p className="mt-1 text-sm text-muted-foreground">Grant or revoke admin access to platform users.</p>

      <DataTable
        className="mt-6"
        cols={["Name", "Phone", "Company", "Joined", "Role", "Actions"]}
        rows={profiles.map((p) => [
          p.full_name || "—",
          p.phone || "—",
          p.company || "—",
          new Date(p.created_at).toLocaleDateString(),
          isAdmin(p.id)
            ? <span key="r" className="rounded-full bg-gold/15 px-2.5 py-1 text-xs font-semibold text-navy">Admin</span>
            : <span key="r" className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">User</span>,
          <button key="a" onClick={() => toggleAdmin(p.id)} className="rounded-md border-hairline border-border px-3 py-1 text-xs font-semibold hover:border-gold">
            {isAdmin(p.id) ? "Remove admin" : "Make admin"}
          </button>,
        ])}
        empty="No users yet."
      />
    </>
  );
}
