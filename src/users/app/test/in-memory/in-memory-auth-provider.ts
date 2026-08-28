/* eslint-disable @typescript-eslint/require-await */
import type {
  AuthSession,
  CreateAuthUserInput,
  IAuthProvider,
  SignInInput,
} from '@/users/domain/interface/authProvider';
import { InMemoryAuthUser } from '@/users/domain/interface/inMemoryAuthUser';
import { randomUUID } from 'crypto';
import { UserNotFound } from '../../Error/user-not-found';
import { RefreshTokenError } from '../../Error/error-refreshToken';

export class InMemoryAuthProvider implements IAuthProvider {
  public items: InMemoryAuthUser[] = [];
  public sessions: AuthSession[] = [];
  public signedOutTokens: string[] = [];

  async createAuthUser(data: CreateAuthUserInput) {
    const auth: InMemoryAuthUser = {
      id: randomUUID(),
      email: data.email,
      password: data.password,
      name: data.name,
      role: data.role,
    };

    this.items.push(auth);

    return { id: auth.id };
  }

  async deleteAuthUser(authUserId: string) {
    const index = this.items.findIndex((item) => item.id === authUserId);

    if (index === -1) throw new UserNotFound();

    this.items.splice(index, 1);
  }

  async signIn(data: SignInInput) {
    const user = this.items.find((item) => item.email === data.email);

    if (!user || user.password !== data.password) throw new UserNotFound();

    const session: AuthSession = {
      accessToken: randomUUID(),
      refreshToken: randomUUID(),
      expiresIn: 3600,
      user,
    };

    this.sessions.push(session);

    return session;
  }

  async signOut(accessToken: string) {
    this.signedOutTokens.push(accessToken);
  }

  async changeEmail(authUserId: string, email: string) {
    const user = this.items.find((item) => item.id === authUserId);

    if (!user) throw new UserNotFound();

    user.email = email;
  }

  async refreshToken(refreshToken: string) {
    const sessionIndex = this.sessions.findIndex(
      (session) => session.refreshToken === refreshToken,
    );

    if (sessionIndex === -1) throw new RefreshTokenError();

    const currentSession = this.sessions[sessionIndex];
    const refreshedSession: AuthSession = {
      accessToken: randomUUID(),
      refreshToken: randomUUID(),
      expiresIn: 3600,
      user: currentSession.user,
    };

    this.sessions[sessionIndex] = refreshedSession;

    return refreshedSession;
  }

  async verifyToken(token: string) {
    if (this.signedOutTokens.includes(token)) {
      throw new Error('Invalid token');
    }

    const session = this.sessions.find((item) => item.accessToken === token);

    if (!session) throw new Error('Invalid token');

    return {
      authUserId: session.user.id,
      email: session.user.email,
    };
  }
}
