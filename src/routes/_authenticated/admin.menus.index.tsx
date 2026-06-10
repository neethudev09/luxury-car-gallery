import { createFileRoute } from "@tanstack/react-router";
import { MenuManager } from "@/components/admin/MenuManager";

export const Route = createFileRoute("/_authenticated/admin/menus/")({
  component: MenuManager,
});
