import z from "zod";

export const loginSchema = z.object({
  email: z.email().min(1).max(255),
  password: z.string().min(8).max(20).optional(),
  userAgent: z.string().optional(),
});
export const registerUserSchema = loginSchema.extend({
  name: z.string().min(3).max(15),
});

export const verifyUserSchema = registerUserSchema.extend({
  otp: z.string().min(4).max(4),
});

export const forgotPasswordSchema = z.object({
  email: z.email().min(3).max(255).optional(),
  otp: z.string().min(4).max(4).optional(),
  password: z.string().min(8).max(20).optional(),
});
