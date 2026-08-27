import { AUTH_PROVIDER } from '@/users/domain/interface/authProvider';
import type { IAuthProvider } from '@/users/domain/interface/authProvider';
import { Inject, Injectable } from '@nestjs/common';
import { FailedSignOut } from '../Error/failed-signout';

@Injectable()
export class SignOutService {
  constructor(
    @Inject(AUTH_PROVIDER)
    private readonly authProvider: IAuthProvider,
  ) {}

  async signout(accessToken: string) {
    try {
      await this.authProvider.signOut(accessToken);
    } catch {
      throw new FailedSignOut();
    }
  }
}
