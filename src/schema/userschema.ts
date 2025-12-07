import { z } from "zod";

export const usernameValidation = z
    .string()
    .min(2, 'Username must be at least of 2 characters')
    .max(20, 'Username must be not more than 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username must not contain special characters');

export const signupSchema = z.object({
  email: z.email({message: 'Invalid email address'}),
  
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long"),

  name: usernameValidation,
  
  role: z.enum(["admin", "analyst"]).optional(), // default handled by mongoose
  
  isActive: z.boolean().optional(),
});