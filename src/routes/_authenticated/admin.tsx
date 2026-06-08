import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  LayoutDashboard,
  Car,
  LogOut,
  ShieldAlert,
  Tag,
  Images,
  GalleryHorizontalEnd,
  FileText,
  Newspaper,
  HelpCircle,
  Inbox,
  Banknote,
  Home,
  Menu as MenuIcon,
  PanelBottom,
  Search,
  Users,
  Settings as SettingsIcon,
} from "lucide-react";
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
  { to: "/admin/brands", label: "Brands", icon: Tag, exact: false },
  { to: "/admin/media", label: "Media Library", icon: Images, exact: false },
  { to: "/admin/galleries", label: "Galleries", icon: GalleryHorizontalEnd, exact: false },
  { to: "/admin/pages", label: "Pages", icon: FileText, exact: false },
  { to: "/admin/blog", label: "Blog Posts", icon: Newspaper, exact: false },
  { to: "/admin/faqs", label: "FAQs", icon: HelpCircle, exact: false },
  { to: "/admin/enquiries", label: "Enquiries", icon: Inbox, exact: false },
  { to: "/admin/sell", label: "Sell Submissions", icon: Banknote, exact: false },
  { to: "/admin/homepage", label: "Homepage Editor", icon: Home, exact: false },
  { to: "/admin/menus", label: "Menu Manager", icon: MenuIcon, exact: false },
  { to: "/admin/footer", label: "Footer Editor", icon: PanelBottom, exact: false },
  { to: "/admin/seo", label: "SEO Settings", icon: Search, exact: false },
  { to: "/admin/users", label: "Users", icon: Users, exact: false },
  { to: "/admin/settings", label: "Settings", icon: SettingsIcon, exact: false },
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
      <aside className="sticky top-20 hidden h-[calc(100vh-5rem)] w-60 shrink-0 overflow-y-auto border-r border-border bg-card/40 p-4 md:block">
        <div className="mb-4 px-2 text-xs uppercase tracking-widest text-muted-foreground">Admin</div>
        <nav className="space-y-0.5">
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
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
          <button
            onClick={signOut}
            className="mt-4 flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </nav>
      </aside>

      <main className="min-w-0 flex-1 p-5 md:p-8">
        <div className="mb-4 flex gap-2 overflow-x-auto pb-2 md:hidden">
          {nav.map((item) => (
            <Link key={item.to} to={item.to} className="whitespace-nowrap rounded-md border border-border px-3 py-1.5 text-sm">
              {item.label}
            </Link>
          ))}
          <button onClick={signOut} className="whitespace-nowrap rounded-md border border-border px-3 py-1.5 text-sm">Sign out</button>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
