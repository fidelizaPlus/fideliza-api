import { z } from 'zod';

export const nameSchema = z
  .string()
  .trim()
  .min(2, 'Name is too short')
  .max(100, 'Name is too long')
  .regex(/^[\p{L}\p{M}]+(?:[ '-][\p{L}\p{M}]+)*$/u, 'Invalid name');

const userBaseSchema = z.object({
  name: nameSchema,
  email: z.email('Invalid email').trim().toLowerCase(),
});

export const registerUserSchema = userBaseSchema
  .extend({
    password: z.string().min(9, 'Password must have at least 9 characters'),

    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation'],
  });

export type RegisterUserInput = z.infer<typeof registerUserSchema>;

export const createUserSchema = userBaseSchema.extend({
  authUserId: z.uuid('Invalid authentication user ID'),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
