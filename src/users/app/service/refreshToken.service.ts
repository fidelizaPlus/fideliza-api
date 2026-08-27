import { AUTH_PROVIDER } from '@/users/domain/interface/authProvider';
import type { IAuthProvider } from '@/users/domain/interface/authProvider';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class RefreshTokenService {
  constructor(
    @Inject(AUTH_PROVIDER)
    private readonly authProvider: IAuthProvider,
  ) {}

  async refreshToken(refreshSession: string) {
    const session = await this.authProvider.refreshToken(refreshSession);

    return session;
  }
}
