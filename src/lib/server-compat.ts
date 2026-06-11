// Static-SPA compatibility layer.
//
// This project deploys as a fully static SPA (no Node/SSR server). The data
// layer therefore talks to the database directly from the browser using the
// publishable (anon) key. Row Level Security enforces exactly the same access
// rules the old server functions relied on:
//   - public/anonymous users can only read PUBLISHED content
//   - only authenticated staff can read private tables or write any table
//
// To avoid rewriting every handler body, this shim mimics the small slice of
// the `createServerFn` builder API the codebase uses, but executes the handler
// immediately in the browser against the authenticated Supabase client.
import { supabase } from "@/integrations/supabase/client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyObj = Record<string, any>;
type Handler = (args: { context: AnyObj; data: unknown }) => Promise<unknown> | unknown;

async function buildContext(): Promise<AnyObj> {
  const { data } = await supabase.auth.getUser();
  return { supabase, userId: data.user?.id ?? null, claims: null };
}

class ServerFnBuilder {
  private validator?: (input: unknown) => unknown;

  middleware() {
    // Auth is enforced by RLS in the static build — middleware is a no-op.
    return this;
  }

  inputValidator(fn: (input: unknown) => unknown) {
    this.validator = fn;
    return this;
  }

  handler(fn: Handler) {
    const validator = this.validator;
    return async (arg?: { data?: unknown }) => {
      const data = validator ? validator(arg?.data) : arg?.data;
      const context = await buildContext();
      return fn({ context, data });
    };
  }
}

export function createServerFn(_opts?: { method?: string }) {
  return new ServerFnBuilder();
}

// Imported by the (former) auth-protected functions and passed to
// `.middleware([...])`; only needs to be a referenceable value.
export const requireSupabaseAuth = Symbol("requireSupabaseAuth");

// Passthrough replacement for @tanstack/react-start's useServerFn — the
// functions are now plain async browser functions with the same call shape.
export function useServerFn<T>(fn: T): T {
  return fn;
}
