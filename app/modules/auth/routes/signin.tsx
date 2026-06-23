import { data, redirect } from "react-router";
import { LoginForm } from "../components/login-form";
import type { Route } from "./+types/signin";
import { SigninSchema } from "../schemas";
import { supabaseHeadersContext } from "~/modules/supabase/context";
import z from "zod";
import { AuthService } from "../service";
import { authServiceContext } from "../context";

export async function loader({ context }: Route.LoaderArgs) {
  const auth = context.get(authServiceContext);
  const authenticated = await auth.authenticated();
  if (authenticated) {
    return redirect("/app");
  }
}

export async function action({ request, context }: Route.ActionArgs) {
  const auth = context.get(authServiceContext);
  const headers = context.get(supabaseHeadersContext);

  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  const result = SigninSchema.safeParse({ email, password });
  if (!result.success) {
    const validationErrors = z.flattenError(result.error);
    return data(
      {
        error: {
          message: "Invalid username and password",
          formErrors: validationErrors.formErrors,
          fieldErrors: validationErrors.fieldErrors,
        },
      },
      { status: 400, headers },
    );
  }

  const { token, error } = await auth.signin(result.data);
  if (error) {
    return data(
      {
        error: {
          message: error.message,
          formErrors: error.formErrors,
        },
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
        <LoginForm />
      </div>
    </main>
  );
}
