import { redirect } from "react-router";
import { authServiceContext } from "../context";
import type { Route } from "./+types/signout";

export async function loader({ context }: Route.LoaderArgs) {
  const auth = context.get(authServiceContext);
  await auth.signout();
  return redirect("/");
}
