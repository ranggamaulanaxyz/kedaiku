import z from "zod";
import type { ValidationError } from "~/types";
import { CountrySchema, CountryStateSchema } from "../country/schemas";

export const PartnerSchema = z.object({
  id: z.uuid(),
  name: z.string().nonempty("Nama tidak boleh kosong"),
  type: z
    .enum(["individual", "company"], {
      message: "Tipe partner harus dipilih dan valid",
    })
    .default("individual"),
  email: z.preprocess(
    (val) => (val === "" ? null : val),
    z.email("Alamat email tidak valid"),
  ),
  mobile: z.string(),
  address: z.string(),
  address2: z.string(),
  city: z.string(),
  countryStateId: z.preprocess(
    (val) => (val === "" ? null : val),
    z.uuid().nullable(),
  ),
  countryState: CountryStateSchema.optional(),
  countryId: z.preprocess(
    (val) => (val === "" ? null : val),
    z.uuid().nullable(),
  ),
  country: CountrySchema.optional(),
  zip: z.string(),
});

export type PartnerSchema = z.infer<typeof PartnerSchema>;
export type PartnerValidationError = ValidationError<keyof PartnerSchema>;
