import z from "zod";

export const userSchema = z
  .object({
    email: z.string().trim().toLowerCase().pipe(z.email({ error: "Please enter a valid email." })),
    password: z
      .string()
      .min(8, { error: "Password cannot be shorter than 8 characters." })
      .max(72, { error: "Password cannot exceed 72 characters." })
      .regex(/[A-Z]/, {
        error: "Password must include one uppercase character.",
      })
      .regex(/[0-9]/, { error: "Password must include one number." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords do not match.",
    path: ["confirmPassword"],
  });
