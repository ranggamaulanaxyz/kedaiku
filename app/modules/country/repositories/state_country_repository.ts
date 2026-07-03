import type { SupabaseClient } from "@supabase/supabase-js";
import type { RouterContextProvider } from "react-router";
import { supabaseClientContext } from "../../supabase/context";
import type { CountryStateSchema } from "../schemas";
import camelcaseKeys from "camelcase-keys";

export class StateCountryRepository {
  private supabase: SupabaseClient;
  constructor(private context: Readonly<RouterContextProvider>) {
    this.supabase = this.context.get(supabaseClientContext);
  }

  async findAll(countryId?: string): Promise<CountryStateSchema[]> {
    let query = this.supabase
      .from("country_states")
      .select("*, country:countries(*)");

    if (countryId) {
      query = query.eq("country_id", countryId);
    }

    const { data, error } = await query;
    if (error) {
      console.error(error);
      return [];
    }

    return camelcaseKeys(data, { deep: true }) as CountryStateSchema[];
  }

  async findById(id: string): Promise<CountryStateSchema | null> {
    const { data, error } = await this.supabase
      .from("country_states")
      .select("*, country:countries(*)")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
      return null;
    }

    return camelcaseKeys(data, { deep: true }) as CountryStateSchema;
  }

  async create(
    state: Omit<CountryStateSchema, "id">,
  ): Promise<CountryStateSchema | null> {
    const { data, error } = await this.supabase
      .from("country_states")
      .insert(state)
      .select()
      .single();

    if (error) {
      console.error(error);
      return null;
    }

    return camelcaseKeys(data, { deep: true }) as CountryStateSchema;
  }

  async update(
    id: string,
    state: Partial<Omit<CountryStateSchema, "id">>,
  ): Promise<CountryStateSchema | null> {
    const { data, error } = await this.supabase
      .from("country_states")
      .update(state)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(error);
      return null;
    }

    return camelcaseKeys(data, { deep: true }) as CountryStateSchema;
  }
}
