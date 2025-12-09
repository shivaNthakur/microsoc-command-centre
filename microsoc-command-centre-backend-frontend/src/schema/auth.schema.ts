import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Invalid email"),
  
  password: z.string().min(6, "Password must be at least 6 characters"),

  loginAs: z.enum(["admin", "analyst"])
    .refine((val) => val === "admin" || val === "analyst", {
      message: "Invalid login type",
    }),
});

export type LoginInput = z.infer<typeof loginSchema>;