import { data, redirect } from "react-router";
import { LoginForm } from "../components/login-form";
import { AuthService } from "../service";
import type { Route } from "./+types/signin";
import { SigninSchema } from "../schemas";
import { supabaseHeadersContext } from "~/modules/supabase/context";

export async function action({ request, context }: Route.ActionArgs) {
  const auth = new AuthService(context);
  const headers = context.get(supabaseHeadersContext);

  try {
    const formData = await request.formData();
    const email = formData.get("email");
    const password = formData.get("password");

    const result = SigninSchema.safeParse({ email, password });
    if (!result.success) {
      return data(
        {
          error: "Invalid input format.",
          fieldErrors: result.error.flatten().fieldErrors,
        },
        { status: 400, headers }
      );
    }

    const { error } = await auth.signin(result.data);
    if (error) {
      return data(
        { error: error.message },
        { status: 400, headers }
      );
    }

    return redirect("/", { headers });
  } catch (error) {
    return data(
      { error: "An unexpected error occurred during sign in." },
      { status: 500, headers }
    );
  }
}

export default function SigninRoute() {
  return (
    <main className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </main>
  );
}
