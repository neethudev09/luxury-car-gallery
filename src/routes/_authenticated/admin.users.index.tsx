import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { listUsers, setUserRole } from "@/lib/cms.functions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/admin/users/")({
  component: UsersPage,
});

type User = {
  id: string;
  email: string | null;
  display_name: string | null;
  roles: string[];
};

const ROLES = ["admin", "manager", "editor", "user"];

function UsersPage() {
  const qc = useQueryClient();
  const list = useServerFn(listUsers);
  const setRole = useServerFn(setUserRole);
  const { data, isLoading, error } = useQuery({ queryKey: ["users"], queryFn: () => list() });
  const users = (data?.users ?? []) as User[];

  const change = async (userId: string, role: string) => {
    try {
      await setRole({ data: { userId, role } });
      toast.success("Role updated");
      qc.invalidateQueries({ queryKey: ["users"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update role");
    }
  };

  return (
    <div>
      <h1 className="text-3xl">Users</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Manage staff accounts and their access roles.
      </p>
      {error && (
        <p className="mt-6 text-sm text-destructive">
          {error instanceof Error ? error.message : "Only administrators can manage users."}
        </p>
      )}
      <div className="mt-6 overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={3} className="px-4 py-10 text-center">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                </td>
              </tr>
            )}
            {users.map((u) => (
              <tr key={u.id} className="border-t border-border/70">
                <td className="px-4 py-3 font-medium">{u.display_name ?? "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                <td className="px-4 py-3">
                  <Select value={u.roles[0] ?? "user"} onValueChange={(v) => change(u.id, v)}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
