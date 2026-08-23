import { z } from 'zod';

export const envSchema = z.object({
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3001),
  NODE_ENV: z.enum(['dev', 'production', 'test']).default('dev'),
  SUPABASE_URL: z.string(),
  SUPABASE_KEY: z.string(),
  SUPABASE_SERVICE_ROLE: z.string(),
});

export type Env = z.infer<typeof envSchema>;
