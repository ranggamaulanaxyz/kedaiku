import type { RouterContextProvider } from "react-router";
import { supabaseClientContext } from "../supabase/context";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { SigninSchema } from "./schemas";
import type { Token, User } from "./types";
import type { AppError } from "~/types";

export class AuthService {
  private supabase: SupabaseClient;
  constructor(context: Readonly<RouterContextProvider>) {
    this.supabase = context.get(supabaseClientContext);
  }

  async signin(
    credentials: SigninSchema,
  ): Promise<{ token: Token | null; error: AppError | null }> {
    const { data, error } =
      await this.supabase.auth.signInWithPassword(credentials);

    return {
      token: {
        accessToken: data.session?.access_token,
        refreshToken: data.session?.refresh_token,
      },
      error: error
        ? {
            message: error?.message,
            formErrors: [{ message: error?.message }],
          }
        : null,
    };
  }
}
