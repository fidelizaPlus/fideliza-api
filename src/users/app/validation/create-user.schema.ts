import { InvalidEmail } from '@/Error/invalid-email';
import { z } from 'zod';

export const nameSchema = z
  .string()
  .trim()
  .min(2, 'Name is too short')
  .max(100, 'Name is too long')
  .regex(/^[\p{L}\p{M}]+(?:[ '-][\p{L}\p{M}]+)*$/u, 'Invalid name');

export const registerUserSchema = z.object({
  name: nameSchema,
  email: z.email(new InvalidEmail()).trim().toLowerCase(),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;

export const createUserSchema = registerUserSchema.extend({
  authUserId: z.uuid('Invalid authentication user ID'),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
