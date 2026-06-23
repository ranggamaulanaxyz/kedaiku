import type { RouterContextProvider } from "react-router";
import { supabaseClientContext } from "../supabase/context";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { SigninSchema } from "./schemas";
import type { Partner, Token } from "./types";
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

  async signout() {
    await this.supabase.auth.signOut();
  }

  async authenticated(): Promise<boolean> {
    const user = await this.getUser();
    return !!user;
  }

  async getUser(): Promise<User | null> {
    const { data } = await this.supabase.auth.getUser();
    if (data.user) {
      return data.user;
    }

    return null;
  }

  async getPartner(): Promise<Partner | null> {
    const user = await this.getUser();

    if (!user) {
      return null;
    }

    const { data: partner, error } = await this.supabase
      .from("partners")
      .select("id, name")
      .eq("id", user.id)
      .single();

    if (partner) {
      return partner;
    }

    return null;
  }
}
