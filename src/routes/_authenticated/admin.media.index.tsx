import { createFileRoute } from "@tanstack/react-router";
import { MediaLibrary } from "@/components/admin/MediaLibrary";

export const Route = createFileRoute("/_authenticated/admin/media/")({
  component: MediaPage,
});

function MediaPage() {
  return <MediaLibrary />;
}
