import { redirect, type RouterContextProvider } from "react-router";
import { supabaseClientContext } from "../supabase/context";
import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  ResetPasswordRequestSchema,
  ResetPasswordSchema,
  SigninSchema,
} from "./schemas";
import type { User, Partner, Token } from "./types";
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
    const { data, error } = await this.supabase.auth.getUser();
    if (error) {
      console.error("Failed to fetch user", error);
      return null;
    }

    const partner = await this.getPartner(data.user.id);
    if (partner) {
      return {
        id: data.user.id,
        name: partner.name,
        email: data.user.email,
      };
    }

    return null;
  }

  async getPartner(id: string): Promise<Partner | null> {
    const { data: partner, error } = await this.supabase
      .from("partners")
      .select("id, name")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Failed to fetch partner", error);
      return null;
    }

    if (partner) {
      return partner;
    }

    return null;
  }

  async resetPasswordRequest(
    data: ResetPasswordRequestSchema,
  ): Promise<{ isSent: boolean; error: AppError | null }> {
    const { error } = await this.supabase.auth.resetPasswordForEmail(
      data.email,
      {
        redirectTo: `${import.meta.env.VITE_APP_URL}/password/reset`,
      },
    );
    if (error) {
      return {
        isSent: false,
        error: {
          fieldErrors: {
            email: [{ message: error?.message }],
          },
        },
      };
    }
    return { isSent: true, error: null };
  }

  async resetPassword(
    data: ResetPasswordSchema,
    code?: string,
  ): Promise<{ isUpdated: boolean; error: AppError | null }> {
    if (code) {
      const { error: exchangeError } =
        await this.supabase.auth.exchangeCodeForSession(code);
      if (exchangeError) {
        return {
          isUpdated: false,
          error: {
            fieldErrors: {
              password: [{ message: exchangeError?.message }],
            },
          },
        };
      }
    }

    const { error } = await this.supabase.auth.updateUser({
      password: data.password,
    });
    if (error) {
      return {
        isUpdated: false,
        error: {
          fieldErrors: {
            password: [{ message: error?.message }],
          },
        },
      };
    }
    return { isUpdated: true, error: null };
  }
}
