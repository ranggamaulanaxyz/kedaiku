import { redirect, type RouterContextProvider } from "react-router";
import {
  supabaseClientContext,
  supabaseHeadersContext,
} from "~/modules/supabase/context";
import { authServiceContext, userContext } from "./context";
import { AuthService } from "./service";

export async function authMiddleware({
  context,
}: {
  request: Request;
  context: Readonly<RouterContextProvider>;
}) {
  const authService = new AuthService(context);

  context.set(authServiceContext, authService);
}
