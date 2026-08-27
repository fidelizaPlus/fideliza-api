import type { Role } from '../enum/user.enum';

export interface CreateAuthUserInput {
  email: string;
  password: string;
  name: string;
  role: Role;
}

export interface AuthUser {
  id: string;
}

export interface AuthenticatedUser {
  authUserId: string;
  email?: string;
}

export interface SignInInput {
  email: string;
  password: string;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    email?: string;
  };
}

export interface IAuthProvider {
  createAuthUser(data: CreateAuthUserInput): Promise<AuthUser>;

  deleteAuthUser(authUserId: string): Promise<void>;

  signIn(data: SignInInput): Promise<AuthSession>;

  signOut(accessToken: string): Promise<void>;

  refreshToken(refreshToken: string): Promise<AuthSession>;

  verifyToken(token: string): Promise<AuthenticatedUser>;
}

export const AUTH_PROVIDER = Symbol('AUTH_PROVIDER');
