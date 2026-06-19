import type { RouterContextProvider } from "react-router";
import { supabaseClientContext } from "../supabase/context";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { SigninSchema } from "./schemas";

export class AuthService {
  private supabase: SupabaseClient;
  constructor(context: Readonly<RouterContextProvider>) {
    this.supabase = context.get(supabaseClientContext);
  }

  async signin(credentials: SigninSchema) {
    return await this.supabase.auth.signInWithPassword(credentials);
  }
}
