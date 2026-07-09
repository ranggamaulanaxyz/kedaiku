import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseClientContext } from "../supabase/context";
import type { RouterContextProvider } from "react-router";
import { PartnerRepository } from "./repository";
import { PartnerSchema } from "./schemas";
import { formatError } from "~/lib/utils";
import { CountryRepository } from "../country/repositories/country_repository";
import { StateCountryRepository } from "../country/repositories/state_country_repository";
import type { CountrySchema, CountryStateSchema } from "../country/schemas";
import snakecaseKeys from "snakecase-keys";

export class PartnerService {
  partnerRepository: PartnerRepository;
  countryRepository: CountryRepository;
  stateCountryRepository: StateCountryRepository;

  constructor(private context: Readonly<RouterContextProvider>) {
    this.partnerRepository = new PartnerRepository(this.context);
    this.countryRepository = new CountryRepository(this.context);
    this.stateCountryRepository = new StateCountryRepository(this.context);
  }

  async getPartners(
    q?: string,
    page?: number,
    perPage?: number,
  ): Promise<{ partners: PartnerSchema[]; totalRecord: number }> {
    const { data, count } = await this.partnerRepository.findAll(
      q,
      page,
      perPage,
    );
    return { partners: data, totalRecord: count };
  }

  async getPartnerById(id: string): Promise<PartnerSchema | null> {
    return this.partnerRepository.findById(id);
  }

  async validate(data: unknown) {
    const {
      success,
      data: validatedData,
      error,
    } = await PartnerSchema.omit({
      id: true,
    }).safeParseAsync(data);
    if (success) {
      return { success, validatedData, error: null };
    }
    const formattedError = formatError<keyof PartnerSchema>(error);
    return { success, validatedData, error: formattedError };
  }

  async createPartner(
    partner: Omit<PartnerSchema, "id">,
  ): Promise<PartnerSchema | null> {
    return this.partnerRepository.create(partner);
  }

  async updatePartner(
    id: string,
    partner: Partial<Omit<PartnerSchema, "id">>,
  ): Promise<PartnerSchema | null> {
    return this.partnerRepository.update(id, partner);
  }

  async deletePartner(id: string): Promise<boolean> {
    return this.partnerRepository.delete(id);
  }

  async getCountries(): Promise<CountrySchema[]> {
    const { data } = await this.countryRepository.findAll();
    return data;
  }

  async getCountryStates(countryId?: string): Promise<CountryStateSchema[]> {
    return this.stateCountryRepository.findAll(countryId);
  }

  async getCountryStateById(id: string): Promise<CountryStateSchema | null> {
    return this.stateCountryRepository.findById(id);
  }
}
