import type { SupabaseClient } from "@supabase/supabase-js";
import type { RouterContextProvider } from "react-router";
import { supabaseClientContext } from "../../supabase/context";
import type { CountrySchema } from "../schemas";
import camelcaseKeys from "camelcase-keys";

export class CountryRepository {
  private supabase: SupabaseClient;
  constructor(private context: Readonly<RouterContextProvider>) {
    this.supabase = this.context.get(supabaseClientContext);
  }

  async findAll(): Promise<CountrySchema[]> {
    const { data, error } = await this.supabase
      .from("countries")
      .select("*");
    if (error) {
      console.error(error);
      return [];
    }

    return camelcaseKeys(data, { deep: true }) as CountrySchema[];
  }

  async findById(id: string): Promise<CountrySchema | null> {
    const { data, error } = await this.supabase
      .from("countries")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
      return null;
    }

    return camelcaseKeys(data, { deep: true }) as CountrySchema;
  }

  async create(
    country: Omit<CountrySchema, "id">,
  ): Promise<CountrySchema | null> {
    const { data, error } = await this.supabase
      .from("countries")
      .insert(country)
      .select()
      .single();

    if (error) {
      console.error(error);
      return null;
    }

    return camelcaseKeys(data, { deep: true }) as CountrySchema;
  }

  async update(
    id: string,
    country: Partial<Omit<CountrySchema, "id">>,
  ): Promise<CountrySchema | null> {
    const { data, error } = await this.supabase
      .from("countries")
      .update(country)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(error);
      return null;
    }

    return camelcaseKeys(data, { deep: true }) as CountrySchema;
  }
}
