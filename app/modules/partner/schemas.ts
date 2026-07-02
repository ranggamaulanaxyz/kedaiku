import z from "zod";
import type { ValidationError } from "~/types";

export const CountrySchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const CountryStateSchema = z.object({
  id: z.string(),
  name: z.string(),
  countryID: z.string(),
  country: CountrySchema.optional().nullable(),
});

export const PartnerSchema = z.object({
  id: z.string(),
  name: z.string().nonempty("Nama tidak boleh kosong"),
  type: z
    .enum(["individual", "company"], {
      message: "Tipe partner harus dipilih dan valid",
    })
    .default("individual"),
  email: z.email("Alamat email tidak valid"),
  address: z.string().optional(),
  address2: z.string().optional(),
  city: z.string().optional(),
  countryStateID: z.string().optional(),
  countryState: CountryStateSchema.optional().nullable(),
  countryID: z.string().optional(),
  country: CountrySchema.optional().nullable(),
});

export type PartnerSchema = z.infer<typeof PartnerSchema>;
export type PartnerValidationError = ValidationError<keyof PartnerSchema>;
