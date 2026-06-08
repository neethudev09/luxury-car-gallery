import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager, type FieldDef, type ColumnDef } from "@/components/admin/ResourceManager";
import { listFaqs, saveFaq, deleteFaq } from "@/lib/cms.functions";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/admin/faqs/")({
  component: FaqsPage,
});

type Faq = {
  id: string;
  question: string;
  category: string | null;
  sort_order: number;
  published: boolean;
};

const fields: FieldDef[] = [
  { name: "question", label: "Question", type: "text", required: true, full: true },
  { name: "answer", label: "Answer", type: "textarea", required: true, full: true },
  { name: "category", label: "Category", type: "text" },
  { name: "sort_order", label: "Sort order", type: "number" },
  { name: "published", label: "Published", type: "switch" },
];

const columns: ColumnDef<Faq>[] = [
  { header: "Question", render: (r) => <span className="font-medium">{r.question}</span> },
  { header: "Category", render: (r) => r.category ?? "—" },
  { header: "Order", render: (r) => r.sort_order },
  { header: "Status", render: (r) => (
    <Badge variant={r.published ? "default" : "outline"}>{r.published ? "Published" : "Hidden"}</Badge>
  ) },
];

function FaqsPage() {
  return (
    <ResourceManager<Faq>
      title="FAQs"
      description="Manage frequently asked questions."
      queryKey="faqs"
      fetchList={listFaqs}
      listKey="faqs"
      save={saveFaq}
      remove={deleteFaq}
      columns={columns}
      fields={fields}
      emptyRecord={{ question: "", answer: "", category: "", sort_order: 0, published: true }}
    />
  );
}
