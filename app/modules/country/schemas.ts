import z from "zod";

export const CountrySchema = z.object({
  id: z.uuid(),
  name: z.string(),
});

export type CountrySchema = z.infer<typeof CountrySchema>;

export const CountryStateSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  countryId: z.uuid(),
  country: CountrySchema.optional().nullable(),
});

export type CountryStateSchema = z.infer<typeof CountryStateSchema>;