import { AUTH_PROVIDER } from '@/users/domain/interface/authProvider';
import type { IAuthProvider, SignInInput } from '@/users/domain/interface/authProvider';
import { Inject, Injectable } from '@nestjs/common';
import { FailedSignIn } from '../Error/failed-signIn';

@Injectable()
export class SignInService {
  constructor(
    @Inject(AUTH_PROVIDER)
    private readonly authProvider: IAuthProvider,
  ) {}

  async signin(data: SignInInput) {
    try {
      const session = await this.authProvider.signIn(data);
      return session;
    } catch {
      throw new FailedSignIn();
    }
  }
}
