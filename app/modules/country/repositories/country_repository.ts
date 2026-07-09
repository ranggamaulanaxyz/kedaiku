import type { SupabaseClient } from "@supabase/supabase-js";
import type { RouterContextProvider } from "react-router";
import { supabaseClientContext } from "../../supabase/context";
import type { CountrySchema } from "../schemas";
import camelcaseKeys from "camelcase-keys";
import snakecaseKeys from "snakecase-keys";

export class CountryRepository {
  private supabase: SupabaseClient;
  constructor(private context: Readonly<RouterContextProvider>) {
    this.supabase = this.context.get(supabaseClientContext);
  }

  async findAll(
    q?: string,
    offset?: number,
    limit?: number,
  ): Promise<{ data: CountrySchema[]; count: number }> {
    let query = this.supabase
      .from("countries")
      .select("*", { count: "exact" });
 
    if (q) {
      query = query.or(`name.ilike.%${q}%,code.ilike.%${q}%`);
    }
 
    if (offset !== undefined && limit !== undefined) {
      const from = (offset - 1) * limit;
      const to = from + limit - 1;
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
      data: camelcaseKeys(data, { deep: true }) as CountrySchema[],
      count: count || 0,
    };
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
      .insert(snakecaseKeys(country))
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
      .update(snakecaseKeys(country))
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(error);
      return null;
    }

    return camelcaseKeys(data, { deep: true }) as CountrySchema;
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from("countries")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      return false;
    }

    return true;
  }
}

