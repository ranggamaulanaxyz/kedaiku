import z from "zod";
import type { ValidationError } from "~/types";

export const CountrySchema = z.object({
  id: z.uuid(),
  name: z.string().nonempty("Nama tidak boleh kosong"),
  code: z.string().nonempty("Kode tidak boleh kosong"),
  createdAt: z.preprocess(
    (val) => (val === "" ? null : val),
    z.string().optional().nullable().readonly(),
  ),
  updatedAt: z.preprocess(
    (val) => (val === "" ? null : val),
    z.string().optional().nullable().readonly(),
  ),
});

export type CountrySchema = z.infer<typeof CountrySchema>;
export type CountryValidationError = ValidationError<keyof CountrySchema>;

export const CountryStateSchema = z.object({
  id: z.uuid(),
  name: z.string().nonempty("Nama tidak boleh kosong"),
  countryId: z.uuid(),
  country: CountrySchema.optional().nullable(),
  createdAt: z.preprocess(
    (val) => (val === "" ? null : val),
    z.string().optional().nullable().readonly(),
  ),
  updatedAt: z.preprocess(
    (val) => (val === "" ? null : val),
    z.string().optional().nullable().readonly(),
  ),
});

export type CountryStateSchema = z.infer<typeof CountryStateSchema>;
export type CountryStateValidationError = ValidationError<keyof CountryStateSchema>;

