import type { SupabaseClient } from "@supabase/supabase-js";
import type { RouterContextProvider } from "react-router";
import { supabaseClientContext } from "../supabase/context";
import type { PartnerSchema } from "./schemas";

export class PartnerRepository {
  private supabase: SupabaseClient;
  constructor(private context: Readonly<RouterContextProvider>) {
    this.supabase = this.context.get(supabaseClientContext);
  }

  async findAll(): Promise<PartnerSchema[]> {
    const { data, error } = await this.supabase.from("partners").select("*");
    if (error) {
      console.error(error);
      return [];
    }

    return data as PartnerSchema[];
  }
}
