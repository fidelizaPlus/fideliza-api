import { USER_REPOSITORY } from '@/users/domain/interface/user.interface';
import type { IUserRepository } from '@/users/domain/interface/user.interface';
import { Inject, Injectable } from '@nestjs/common';
import { UserNotFound } from '../Error/user-not-found';
import { AUTH_PROVIDER } from '@/users/domain/interface/authProvider';
import type { IAuthProvider } from '@/users/domain/interface/authProvider';

@Injectable()
export class UpdateUsersService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,

    @Inject(AUTH_PROVIDER)
    private readonly authProvider: IAuthProvider,
  ) {}

  async update(id: string, data: { name?: string; email?: string }) {
    const user = await this.userRepository.findUserById(id);

    if (!user) throw new UserNotFound();

    const userName = data.name ?? user.name;
    const userEmail = data.email ?? user.email;

    if (data.email && data.email !== user.email) {
      await this.authProvider.changeEmail(user.authUserId, data.email);

      try {
        return await this.userRepository.updateUser({
          ...user,
          name: userName,
          email: userEmail,
        });
      } catch (error) {
        await this.authProvider.changeEmail(user.authUserId, user.email);
        throw error;
      }
    }

    return this.userRepository.updateUser({
      ...user,
      name: userName,
      email: userEmail,
    });
  }
}
