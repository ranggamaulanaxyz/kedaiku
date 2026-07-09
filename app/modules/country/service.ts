import type { RouterContextProvider } from "react-router";
import { CountryRepository } from "./repositories/country_repository";
import { StateCountryRepository } from "./repositories/state_country_repository";
import { CountrySchema, CountryStateSchema } from "./schemas";
import { formatError } from "~/lib/utils";

export class CountryService {
  countryRepository: CountryRepository;

  constructor(private context: Readonly<RouterContextProvider>) {
    this.countryRepository = new CountryRepository(this.context);
  }

  async getCountries(
    q?: string,
    offset?: number,
    limit?: number,
  ): Promise<{ countries: CountrySchema[]; totalRecord: number }> {
    const { data, count } = await this.countryRepository.findAll(
      q,
      offset,
      limit,
    );
    return { countries: data, totalRecord: count };
  }

  async getCountryById(id: string): Promise<CountrySchema | null> {
    return this.countryRepository.findById(id);
  }

  async validate(data: unknown) {
    const {
      success,
      data: validatedData,
      error,
    } = await CountrySchema.omit({
      id: true,
      createdAt: true,
      updatedAt: true,
    }).safeParseAsync(data);
    if (success) {
      return { success, validatedData, error: null };
    }
    const formattedError = formatError<keyof CountrySchema>(error);
    return { success, validatedData, error: formattedError };
  }

  async createCountry(
    country: Omit<CountrySchema, "id" | "createdAt" | "updatedAt">,
  ): Promise<CountrySchema | null> {
    return this.countryRepository.create(country);
  }

  async updateCountry(
    id: string,
    country: Partial<Omit<CountrySchema, "id" | "createdAt" | "updatedAt">>,
  ): Promise<CountrySchema | null> {
    return this.countryRepository.update(id, country);
  }

  async deleteCountry(id: string): Promise<boolean> {
    return this.countryRepository.delete(id);
  }
}

export class StateCountryService {
  stateCountryRepository: StateCountryRepository;

  constructor(private context: Readonly<RouterContextProvider>) {
    this.stateCountryRepository = new StateCountryRepository(this.context);
  }

  async getStates(countryId?: string, q?: string): Promise<CountryStateSchema[]> {
    return this.stateCountryRepository.findAll(countryId, q);
  }

  async getStateById(id: string): Promise<CountryStateSchema | null> {
    return this.stateCountryRepository.findById(id);
  }

  async validate(data: unknown) {
    const {
      success,
      data: validatedData,
      error,
    } = await CountryStateSchema.omit({
      id: true,
      createdAt: true,
      updatedAt: true,
      country: true,
    }).safeParseAsync(data);
    if (success) {
      return { success, validatedData, error: null };
    }
    const formattedError = formatError<keyof CountryStateSchema>(error);
    return { success, validatedData, error: formattedError };
  }

  async createState(
    state: Omit<CountryStateSchema, "id" | "createdAt" | "updatedAt" | "country">,
  ): Promise<CountryStateSchema | null> {
    return this.stateCountryRepository.create(state);
  }

  async updateState(
    id: string,
    state: Partial<Omit<CountryStateSchema, "id" | "createdAt" | "updatedAt" | "country">>,
  ): Promise<CountryStateSchema | null> {
    return this.stateCountryRepository.update(id, state);
  }

  async deleteState(id: string): Promise<boolean> {
    return this.stateCountryRepository.delete(id);
  }
}
