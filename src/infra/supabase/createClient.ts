import { envSchema } from '@/env/envSchema';
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const env = envSchema.parse(process.env);

const supabaseUrl = env.SUPABASE_URL;
const supabaseKey = env.SUPABASE_KEY;
const supabaseServiceRole = env.SUPABASE_SERVICE_ROLE;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_KEY');
}

if (!supabaseServiceRole) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    flowType: 'pkce',
  },
});

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRole, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
