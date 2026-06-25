import { Outlet } from "react-router";
import Layout from "../components/layout";
import type { Route } from "./+types/layout";
import { requireAuthMiddleware } from "~/modules/auth/middleware";
import { userContext } from "~/modules/auth/context";

export const middleware: Route.MiddlewareFunction[] = [requireAuthMiddleware];

export async function loader({ context }: Route.LoaderArgs) {
  const user = context.get(userContext);

  return { user };
}

export default function LayoutRoute() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
