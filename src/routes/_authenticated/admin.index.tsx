import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@/lib/server-compat";
import {
  Car,
  Star,
  Tag,
  Plus,
  Sparkles,
  CheckCircle,
  Inbox,
  Newspaper,
  AlertTriangle,
  Images,
} from "lucide-react";
import { getDashboardStats } from "@/lib/cms.functions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const fetchStats = useServerFn(getDashboardStats);
  const { data } = useQuery({ queryKey: ["dashboard"], queryFn: () => fetchStats() });
  const v = data?.vehicles;
  const enquiries = data?.latestEnquiries ?? [];
  const posts = data?.recentPosts ?? [];

  const stats = [
    { label: "Total vehicles", value: v?.total ?? 0, icon: Car },
    { label: "Available", value: v?.available ?? 0, icon: CheckCircle },
    { label: "Sold", value: v?.sold ?? 0, icon: Tag },
    { label: "Featured", value: v?.featured ?? 0, icon: Star },
    { label: "New arrivals", value: v?.newArrivals ?? 0, icon: Sparkles },
  ];

  const warnings = [
    { label: "Missing image", value: v?.missingImage ?? 0 },
    { label: "Missing SEO titles", value: v?.missingSeoTitle ?? 0 },
    { label: "Missing meta descriptions", value: v?.missingMetaDescription ?? 0 },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your entire website from here.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm">
            <Link to="/admin/vehicles/$id" params={{ id: "new" }}>
              <Plus className="h-4 w-4" /> Add vehicle
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link to="/admin/blog">
              <Newspaper className="h-4 w-4" /> Add blog post
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link to="/admin/media">
              <Images className="h-4 w-4" /> Upload media
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
              <s.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border p-5">
          <div className="mb-3 flex items-center gap-2">
            <Inbox className="h-4 w-4" />
            <h2 className="text-lg">Latest enquiries</h2>
          </div>
          <div className="space-y-2">
            {enquiries.length === 0 && <p className="text-sm text-muted-foreground">No enquiries yet.</p>}
            {enquiries.map((e) => (
              <Link
                key={e.id}
                to="/admin/enquiries"
                className="flex items-center justify-between rounded-md border border-border/70 p-3 text-sm hover:bg-muted"
              >
                <span className="font-medium">{e.name}</span>
                <Badge variant={e.status === "new" ? "default" : "outline"}>{e.status}</Badge>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border p-5">
          <div className="mb-3 flex items-center gap-2">
            <Newspaper className="h-4 w-4" />
            <h2 className="text-lg">Recent blog posts</h2>
          </div>
          <div className="space-y-2">
            {posts.length === 0 && <p className="text-sm text-muted-foreground">No posts yet.</p>}
            {posts.map((p) => (
              <Link
                key={p.id}
                to="/admin/blog"
                className="flex items-center justify-between rounded-md border border-border/70 p-3 text-sm hover:bg-muted"
              >
                <span className="font-medium">{p.title}</span>
                <Badge variant={p.status === "published" ? "default" : "outline"}>{p.status}</Badge>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-border p-5">
        <div className="mb-3 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <h2 className="text-lg">Content health</h2>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {warnings.map((w) => (
            <Link
              key={w.label}
              to="/admin/vehicles"
              className="flex items-center justify-between rounded-md border border-border/70 p-3 text-sm hover:bg-muted"
            >
              <span>{w.label}</span>
              <Badge variant={w.value > 0 ? "destructive" : "secondary"}>{w.value}</Badge>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
