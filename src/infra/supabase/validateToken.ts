import { UnauthorizedException } from '@nestjs/common';
import { supabase } from './createClient';

export async function validateToken(token: string) {
  const { data, error } = await supabase.auth.getUser(token);

  if (error) throw new UnauthorizedException('Invalid token');

  return data.user;
}
