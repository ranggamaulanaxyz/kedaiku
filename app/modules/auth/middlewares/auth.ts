import { redirect, type RouterContextProvider } from "react-router";
import { supabaseClientContext, supabaseHeadersContext } from "~/modules/supabase/context";
import { userContext } from "../context";

export async function authMiddleware({
  request,
  context,
}: {
  request: Request;
  context: Readonly<RouterContextProvider>;
}) {
  const supabase = context.get(supabaseClientContext);
  const headers = context.get(supabaseHeadersContext);

  if (!supabase) {
    throw new Error("Supabase client not initialized in context");
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    // If accessing signin itself, do not redirect to prevent infinite loops (though signin doesn't usually use authMiddleware)
    const url = new URL(request.url);
    if (url.pathname === "/signin") {
      return;
    }
    throw redirect("/signin", { headers });
  }

  context.set(userContext, user);
}
