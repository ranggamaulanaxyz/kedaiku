import type { RouterContextProvider } from "react-router";
import { supabaseClientContext } from "./context";
import { getSupabaseBrowserClient } from "./lib/supabase.client";

export async function supabaseClientMiddleware({
  request,
  context,
}: {
  request: Request;
  context: Readonly<RouterContextProvider>;
}) {
  const supabase = getSupabaseBrowserClient();
  context.set(supabaseClientContext, supabase);
}
