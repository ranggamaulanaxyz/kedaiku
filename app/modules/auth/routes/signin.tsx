import { data, redirect } from "react-router";
import { LoginForm } from "../components/login-form";
import type { Route } from "./+types/signin";
import { SigninSchema } from "../schemas";
import { supabaseHeadersContext } from "~/modules/supabase/context";
import { authServiceContext } from "../context";
import { authMiddleware } from "../middleware";
import { formatError } from "~/lib/utils";
import type { AppError } from "~/types";

export const middleware: Route.MiddlewareFunction[] = [authMiddleware];

export async function loader({ context }: Route.LoaderArgs) {
  const headers = context.get(supabaseHeadersContext);
  const auth = context.get(authServiceContext);
  const authenticated = await auth.authenticated();
  if (authenticated) {
    return redirect("/app/dashboard", { headers });
  }

  return data({}, { headers });
}

export async function action({ request, context }: Route.ActionArgs) {
  const auth = context.get(authServiceContext);
  const headers = context.get(supabaseHeadersContext);

  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  const result = SigninSchema.safeParse({ email, password });
  if (!result.success) {
    const fieldErrors = formatError<keyof SigninSchema>(result.error);
    return data(
      {
        error: {
          message: "Invalid username and password",
          fieldErrors,
        } as AppError,
      },
      { status: 400, headers },
    );
  }

  const { error } = await auth.signin(result.data);
  if (error) {
    return data(
      {
        error: error as AppError,
      },
      { status: 400, headers },
    );
  }

  return redirect("/", { headers });
}

export default function SigninRoute({ actionData }: Route.ComponentProps) {
  return (
    <main className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm
          initialFormErrors={actionData?.error?.formErrors}
          initialFieldError={actionData?.error?.fieldErrors}
        />
      </div>
    </main>
  );
}
