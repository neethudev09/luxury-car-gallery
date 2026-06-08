import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { LayoutDashboard, Car, LogOut, ShieldAlert } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { getMyAccess } from "@/lib/vehicles.functions";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/vehicles", label: "Vehicles", icon: Car, exact: false },
];

function AdminLayout() {
  const navigate = useNavigate();
  const fetchAccess = useServerFn(getMyAccess);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { data, isLoading } = useQuery({ queryKey: ["my-access"], queryFn: () => fetchAccess() });

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center pt-24 text-muted-foreground">Loading…</div>;
  }

  if (!data?.isStaff) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 pt-24 text-center">
        <ShieldAlert className="h-12 w-12 text-destructive" />
        <h1 className="text-2xl">Access restricted</h1>
        <p className="max-w-md text-sm text-muted-foreground">
          Your account ({data?.email}) does not have staff permissions. Ask an administrator to grant
          you the admin or manager role.
        </p>
        <Button variant="outline" onClick={signOut}>Sign out</Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen pt-20">
      <aside className="hidden w-60 shrink-0 border-r border-border bg-card/40 p-4 md:block">
        <div className="mb-6 px-2 text-xs uppercase tracking-widest text-muted-foreground">Admin</div>
        <nav className="space-y-1">
          {nav.map((item) => {
            const active = item.exact ? path === item.to : path.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                  active ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={signOut}
          className="mt-6 flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </aside>
      <main className="flex-1 p-5 md:p-8">
        <div className="mb-4 flex gap-2 md:hidden">
          {nav.map((item) => (
            <Link key={item.to} to={item.to} className="rounded-md border border-border px-3 py-1.5 text-sm">
              {item.label}
            </Link>
          ))}
          <button onClick={signOut} className="rounded-md border border-border px-3 py-1.5 text-sm">Sign out</button>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
