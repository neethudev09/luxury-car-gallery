import { useMemo, useState } from "react";
import { Plus, X, GripVertical, Link2, ExternalLink } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  type ContentRef,
  type IndexItem,
  type RefType,
  REF_TYPES,
  refUrl,
  resolveRef,
} from "@/lib/refs";

const TYPE_LABEL: Record<RefType, string> = {
  page: "Page",
  vehicle: "Vehicle",
  brand: "Brand",
  post: "Blog Post",
  gallery: "Gallery",
  faq: "FAQ",
  custom: "Custom",
};

/** Pick a single existing CMS item; calls onSelect with a content reference. */
export function ContentPicker({
  index,
  onSelect,
  trigger,
}: {
  index: IndexItem[];
  onSelect: (ref: ContentRef) => void;
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const grouped = useMemo(() => {
    const map = new Map<RefType, IndexItem[]>();
    index.forEach((i) => {
      const list = map.get(i.type) ?? [];
      list.push(i);
      map.set(i.type, list);
    });
    return map;
  }, [index]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {trigger ?? (
          <Button type="button" variant="outline" size="sm">
            <Plus className="h-4 w-4" /> Add content
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-[340px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search pages, vehicles, brands…" />
          <CommandList>
            <CommandEmpty>No matching content.</CommandEmpty>
            {REF_TYPES.map(({ type, label }) => {
              const list = grouped.get(type) ?? [];
              if (list.length === 0) return null;
              return (
                <CommandGroup key={type} heading={label}>
                  {list.map((item) => (
                    <CommandItem
                      key={`${type}-${item.id}`}
                      value={`${label} ${item.label}`}
                      onSelect={() => {
                        onSelect({ type, id: item.id });
                        setOpen(false);
                      }}
                    >
                      <span className="truncate">{item.label}</span>
                      {item.status && (
                        <span className="ml-auto text-xs text-muted-foreground">{item.status}</span>
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              );
            })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

/** Manage an ordered list of content references with drag-to-reorder. */
export function RefList({
  value,
  onChange,
  index,
}: {
  value: ContentRef[];
  onChange: (next: ContentRef[]) => void;
  index: IndexItem[];
}) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [customLabel, setCustomLabel] = useState("");
  const [customUrl, setCustomUrl] = useState("");

  const move = (from: number, to: number) => {
    if (to < 0 || to >= value.length) return;
    const next = [...value];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));
  const add = (ref: ContentRef) => onChange([...value, ref]);

  const addCustom = () => {
    if (!customLabel.trim() || !customUrl.trim()) return;
    add({ type: "custom", label: customLabel.trim(), url: customUrl.trim() });
    setCustomLabel("");
    setCustomUrl("");
  };

  return (
    <div className="space-y-3">
      <ul className="space-y-2">
        {value.map((ref, i) => {
          const resolved = resolveRef(ref, index);
          return (
            <li
              key={i}
              draggable
              onDragStart={() => setDragIndex(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragIndex !== null && dragIndex !== i) move(dragIndex, i);
                setDragIndex(null);
              }}
              className={`flex items-center gap-2 rounded-md border bg-card px-2.5 py-2 text-sm ${
                resolved.valid ? "border-border" : "border-destructive/60"
              }`}
            >
              <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-muted-foreground" />
              <Badge variant="secondary" className="shrink-0">
                {TYPE_LABEL[ref.type]}
              </Badge>
              <span className="flex-1 truncate">{resolved.label}</span>
              <span className="hidden items-center gap-1 truncate text-xs text-muted-foreground sm:flex">
                {ref.type === "custom" ? (
                  <ExternalLink className="h-3 w-3" />
                ) : (
                  <Link2 className="h-3 w-3" />
                )}
                {resolved.url}
              </span>
              {!resolved.valid && (
                <span className="text-xs text-destructive">removed</span>
              )}
              <button
                type="button"
                onClick={() => remove(i)}
                className="shrink-0 rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
                aria-label="Remove"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          );
        })}
        {value.length === 0 && (
          <li className="rounded-md border border-dashed px-3 py-4 text-center text-sm text-muted-foreground">
            No items yet. Select existing content below.
          </li>
        )}
      </ul>

      <div className="flex flex-wrap items-center gap-2">
        <ContentPicker index={index} onSelect={add} />
      </div>

      <div className="rounded-md border border-dashed p-3">
        <p className="mb-2 text-xs font-medium text-muted-foreground">External / custom link</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            placeholder="Label"
            value={customLabel}
            onChange={(e) => setCustomLabel(e.target.value)}
          />
          <Input
            placeholder="https://…"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
          />
          <Button type="button" variant="outline" onClick={addCustom}>
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}

export { refUrl };
