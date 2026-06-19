import z from "zod";

export const SigninSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export type SigninSchema = z.infer<typeof SigninSchema>;
