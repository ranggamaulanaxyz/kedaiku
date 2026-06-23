import ResetPasswordRequestForm from "../components/reset-password-request-form";
import { authServiceContext } from "../context";
import { requireGuestMiddleware } from "../middleware";
import type { Route } from "./+types/reset-password";

export const middleware: Route.MiddlewareFunction[] = [requireGuestMiddleware];

export async function loader({ request, context }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  return { isResetPage: !!code };
}

export async function action({ request, context }: Route.ActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;

  const auth = context.get(authServiceContext);
  const isSent = await auth.resetPasswordRequest({ email });
  return { isSent };
}

export default function ResetPasswordRoute({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { isResetPage } = loaderData;
  if (isResetPage) {
    return <></>;
  }

  if (actionData?.isSent) {
    return <></>;
  }

  return (
    <main className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <ResetPasswordRequestForm initialFieldErrors={{}} />
      </div>
    </main>
  );
}
