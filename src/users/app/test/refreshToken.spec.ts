import { Role } from '@/users/domain/enum/user.enum';
import { InMemoryAuthProvider } from './in-memory/in-memory-auth-provider';
import { RefreshTokenService } from '../service/refreshToken.service';
import type { AuthSession } from '@/users/domain/interface/authProvider';
import { RefreshTokenError } from '../Error/error-refreshToken';

describe('refresh token', () => {
  let refreshTokenRepository: InMemoryAuthProvider;
  let sut: RefreshTokenService;
  let initialSession: AuthSession;

  beforeEach(async () => {
    refreshTokenRepository = new InMemoryAuthProvider();
    sut = new RefreshTokenService(refreshTokenRepository);

    await refreshTokenRepository.createAuthUser({
      email: 'johndoe@gmail.com',
      password: '123456789',
      name: 'John Doe',
      role: Role.CLIENT,
    });

    initialSession = await refreshTokenRepository.signIn({
      email: 'johndoe@gmail.com',
      password: '123456789',
    });
  });

  it('should generate refresh token', async () => {
    const refreshedSession = await sut.refreshToken(initialSession.refreshToken);

    expect(refreshTokenRepository.sessions).toContain(refreshedSession);
  });

  it('should generate a new access token', async () => {
    const refreshedSession = await sut.refreshToken(initialSession.refreshToken);

    expect(refreshedSession.accessToken).not.toBe(initialSession.accessToken);
  });

  it('should rotate the refresh token', async () => {
    const refreshedSession = await sut.refreshToken(initialSession.refreshToken);

    expect(refreshedSession.refreshToken).not.toBe(initialSession.refreshToken);
  });

  it('should keep the same user after refreshing the session', async () => {
    const refreshedSession = await sut.refreshToken(initialSession.refreshToken);

    expect(refreshedSession.user.id).toBe(initialSession.user.id);
  });

  it('should keep only one active session after refreshing', async () => {
    await sut.refreshToken(initialSession.refreshToken);

    expect(refreshTokenRepository.sessions).toHaveLength(1);
  });

  it('should reject an invalid refresh token', async () => {
    const invalidRefreshToken = 'invalid-refresh-token';

    await expect(sut.refreshToken(invalidRefreshToken)).rejects.toBeInstanceOf(RefreshTokenError);
  });

  it('should reject the old refresh token after rotation', async () => {
    const oldRefreshToken = initialSession.refreshToken;

    await sut.refreshToken(oldRefreshToken);

    await expect(sut.refreshToken(oldRefreshToken)).rejects.toBeInstanceOf(RefreshTokenError);
  });
});
