import { redirect, type RouterContextProvider } from "react-router";
import { authServiceContext } from "./context";
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

export async function requireAuthMiddleware({
  context,
}: {
  request: Request;
  context: Readonly<RouterContextProvider>;
}) {
  const authService = context.get(authServiceContext);
  const isAuthenticated = await authService.authenticated();

  if (!isAuthenticated) {
    throw redirect("/");
  }
}

export async function requireGuestMiddleware({
  context,
}: {
  context: Readonly<RouterContextProvider>;
}) {
  const authService = context.get(authServiceContext);
  const isAuthenticated = await authService.authenticated();

  if (isAuthenticated) {
    throw redirect("/app/dashboard");
  }
}
