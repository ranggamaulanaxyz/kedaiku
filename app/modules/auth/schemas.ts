import z from "zod";

export const SigninSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export type SigninSchema = z.infer<typeof SigninSchema>;

export const ResetPasswordRequestSchema = z.object({
  email: z.email(),
});

export type ResetPasswordRequestSchema = z.infer<
  typeof ResetPasswordRequestSchema
>;
