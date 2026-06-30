import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseClientContext } from "../supabase/context";
import type { RouterContextProvider } from "react-router";
import { PartnerRepository } from "./repository";
import type { PartnerSchema } from "./schemas";

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

  async createPartner(
    partner: Omit<PartnerSchema, "id">,
  ): Promise<PartnerSchema | null> {
    return this.partnerRepository.create(partner);
  }
}
