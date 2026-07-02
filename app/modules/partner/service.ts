import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseClientContext } from "../supabase/context";
import type { RouterContextProvider } from "react-router";
import { PartnerRepository } from "./repository";
import { PartnerSchema } from "./schemas";
import { formatError } from "~/lib/utils";

export class PartnerService {
  partnerRepository: PartnerRepository;
  constructor(private context: Readonly<RouterContextProvider>) {
    this.partnerRepository = new PartnerRepository(this.context);
  }

  async getPartners(): Promise<PartnerSchema[]> {
    const partners = await this.partnerRepository.findAll();
    return partners;
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
}
