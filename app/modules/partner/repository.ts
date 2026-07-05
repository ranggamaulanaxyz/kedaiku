import type { SupabaseClient } from "@supabase/supabase-js";
import type { RouterContextProvider } from "react-router";
import { supabaseClientContext } from "../supabase/context";
import type { PartnerSchema } from "./schemas";
import camelcaseKeys from "camelcase-keys";
import snakecaseKeys from "snakecase-keys";

export class PartnerRepository {
  private supabase: SupabaseClient;
  constructor(private context: Readonly<RouterContextProvider>) {
    this.supabase = this.context.get(supabaseClientContext);
  }

  async findAll(
    q?: string,
    page?: number,
    perPage?: number,
  ): Promise<{ data: PartnerSchema[]; count: number }> {
    let query = this.supabase
      .from("partners")
      .select("*, country_state:country_states(*), country:countries(*)", {
        count: "exact",
      });

    if (q) {
      query = query.or(`name.ilike.%${q}%,email.ilike.%${q}%`);
    }

    if (page && perPage) {
      const from = (page - 1) * perPage;
      const to = from + perPage - 1;
      query = query.range(from, to);
    }

    // Order alphabetically by name
    query = query.order("name", { ascending: true });

    const { data, error, count } = await query;
    if (error) {
      console.error(error);
      return { data: [], count: 0 };
    }

    return {
      data: camelcaseKeys(data, { deep: true }) as PartnerSchema[],
      count: count || 0,
    };
  }

  async findById(id: string): Promise<PartnerSchema | null> {
    const { data, error } = await this.supabase
      .from("partners")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return null;
    }

    return camelcaseKeys(data) as PartnerSchema;
  }

  async create(
    partner: Omit<PartnerSchema, "id">,
  ): Promise<PartnerSchema | null> {
    const { data, error } = await this.supabase
      .from("partners")
      .insert(snakecaseKeys(partner))
      .select()
      .single();

    if (error) {
      console.error(error);
      return null;
    }

    return camelcaseKeys(data, { deep: true }) as PartnerSchema;
  }

  async update(
    id: string,
    partner: Partial<Omit<PartnerSchema, "id">>,
  ): Promise<PartnerSchema | null> {
    const { data, error } = await this.supabase
      .from("partners")
      .update(snakecaseKeys(partner))
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(error);
      return null;
    }

    return camelcaseKeys(data, { deep: true }) as PartnerSchema;
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from("partners")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      return false;
    }

    return true;
  }
}
