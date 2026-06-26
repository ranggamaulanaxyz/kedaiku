import z from "zod";

export const PartnerSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export type PartnerSchema = z.infer<typeof PartnerSchema>;
