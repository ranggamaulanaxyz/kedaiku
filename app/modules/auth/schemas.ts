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

export const ResetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

export type ResetPasswordSchema = z.infer<typeof ResetPasswordSchema>;

