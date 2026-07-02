import type { SupabaseClient } from "@supabase/supabase-js";
import type { RouterContextProvider } from "react-router";
import { supabaseClientContext } from "../supabase/context";
import type { PartnerSchema } from "./schemas";
import camelcaseKeys from "camelcase-keys";

export class PartnerRepository {
  private supabase: SupabaseClient;
  constructor(private context: Readonly<RouterContextProvider>) {
    this.supabase = this.context.get(supabaseClientContext);
  }

  async findAll(): Promise<PartnerSchema[]> {
    const { data, error } = await this.supabase.from("partners").select("*, country_state:country_states(*), country:countries(*)");
    if (error) {
      console.error(error);
      return [];
    }

    return camelcaseKeys(data, {deep: true}) as PartnerSchema[];
  }

  async findById(id: string): Promise<PartnerSchema | null> {
    const { data, error } = await this.supabase
      .from("partners")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
      return null;
    }

    return data as PartnerSchema;
  }

  async create(
    partner: Omit<PartnerSchema, "id">,
  ): Promise<PartnerSchema | null> {
    const { data, error } = await this.supabase
      .from("partners")
      .insert(partner)
      .select()
      .single();

    if (error) {
      console.error(error);
      return null;
    }

    return camelcaseKeys(data, { deep: true }) as PartnerSchema;
  }
}
