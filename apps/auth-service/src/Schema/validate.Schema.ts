import z from "zod";

export const registerUserSchema = z.object({
  name: z.string().min(3).max(15),
  email: z.email().min(1).max(255),
  password: z.string().min(8).max(20).optional(),
  userAgent: z.string().optional(),
});

export const verifyUserSchema = registerUserSchema.extend({
  otp: z.string().min(4).max(4),
});
