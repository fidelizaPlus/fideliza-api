import type {
  CreateAuthUserInput,
  IAuthProvider,
  SignInInput,
} from '@/users/domain/interface/authProvider';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { supabase, supabaseAdmin } from './createClient';
import { RefreshTokenError } from '@/users/app/Error/error-refreshToken';

@Injectable()
export class SupabaseAuthProvider implements IAuthProvider {
  async signIn(data: SignInInput) {
    const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (!authData?.user || !authData.session || authError)
      throw new UnauthorizedException(authError?.message ?? 'Invalid data');

    return {
      accessToken: authData.session.access_token,
      refreshToken: authData.session.refresh_token,
      expiresIn: authData.session.expires_in,
      user: authData.user,
    };
  }

  async signOut(accessToken: string) {
    const { error: authError } = await supabaseAdmin.auth.admin.signOut(accessToken);

    if (authError)
      throw new UnauthorizedException(authError?.message ?? 'Not possible to sign out');
  }

  async createAuthUser(data: CreateAuthUserInput) {
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      email_confirm: true,
      password: data.password,
      app_metadata: {
        role: data.role,
      },
      user_metadata: {
        name: data.name,
      },
    });

    if (!authData?.user || authError)
      throw new Error(authError?.message ?? 'Could not create authentication user');

    return { id: authData.user.id };
  }

  async deleteAuthUser(authUserId: string) {
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(authUserId);

    if (authError) throw new Error(authError?.message ?? 'Could not delete user');
  }

  async verifyToken(token: string) {
    const { data: authData, error: authError } = await supabase.auth.getUser(token);

    if (!authData?.user || authError)
      throw new Error(authError?.message ?? 'Could not verify token');

    return { authUserId: authData.user.id };
  }

  async refreshToken(refreshToken: string) {
    const { data: authData, error: authError } = await supabaseAdmin.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (!authData.session || authError) throw new RefreshTokenError();

    return {
      accessToken: authData.session.access_token,
      refreshToken: authData.session.refresh_token,
      expiresIn: authData.session.expires_in,
      user: authData.session.user,
    };
  }
}
