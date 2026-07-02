import z from "zod";

export const CountrySchema = z.object({
  id: z.string(),
  name: z.string(),
})

export const CountryStateSchema = z.object({
  id: z.string(),
  name: z.string(),
  countryID: z.string(),
  country: CountrySchema.optional().nullable()
})

export const PartnerSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  address: z.string().optional(),
  address2: z.string().optional(),
  city: z.string().optional(),
  countryStateID: z.string().optional(),
  countryState: CountryStateSchema.optional().nullable(),
  countryID: z.string().optional(),
  country: CountrySchema.optional().nullable()
});

export type PartnerSchema = z.infer<typeof PartnerSchema>;
