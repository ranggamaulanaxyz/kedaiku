import MainWrapper from "../components/main-wrapper";
import ResetPasswordForm from "../components/reset-password-form";
import ResetPasswordRequestForm from "../components/reset-password-request-form";
import ResetPasswordRequestSent from "../components/reset-password-request-sent";
import { authServiceContext } from "../context";
import { requireGuestMiddleware } from "../middleware";
import type { Route } from "./+types/reset-password";
import { data, redirect } from "react-router";
import { supabaseHeadersContext } from "~/modules/supabase/context";

export const middleware: Route.MiddlewareFunction[] = [requireGuestMiddleware];

export async function loader({ request, context }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  return { isResetPage: !!code };
}

export async function action({ request, context }: Route.ActionArgs) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const auth = context.get(authServiceContext);
  const headers = context.get(supabaseHeadersContext);

  const formData = await request.formData();

  if (code) {
    const password = formData.get("password") as string;
    const password_confirmation = formData.get(
      "password_confirmation",
    ) as string;
    const { isUpdated, error } = await auth.resetPassword(
      {
        password,
        password_confirmation,
      },
      code,
    );
    if (isUpdated) {
      return data({ isUpdated: false, error }, { headers });
    }
    return data({ isUpdated: true }, { headers });
  }

  const email = formData.get("email") as string;
  const { isSent, error } = await auth.resetPasswordRequest({ email });
  return data({ isSent, error: error }, { headers });
}

export default function ResetPasswordRoute({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { isResetPage } = loaderData;

  const isUpdated =
    actionData && "isUpdated" in actionData ? actionData.isUpdated : false;
  const isSent =
    actionData && "isSent" in actionData ? actionData.isSent : false;
  const error = actionData && "error" in actionData ? actionData.error : null;

  if (isResetPage) {
    return (
      <MainWrapper>
        <ResetPasswordForm
          isUpdated={isUpdated}
          initialFieldErrors={error?.fieldErrors}
        />
      </MainWrapper>
    );
  }

  if (isSent) {
    return (
      <MainWrapper>
        <ResetPasswordRequestSent />
      </MainWrapper>
    );
  }

  return (
    <MainWrapper>
      <ResetPasswordRequestForm initialFieldErrors={error?.fieldErrors} />
    </MainWrapper>
  );
}
