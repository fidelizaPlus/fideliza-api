import { USER_REPOSITORY } from '@/users/domain/interface/user.interface';
import type { IUserRepository } from '@/users/domain/interface/user.interface';
import { Inject, Injectable } from '@nestjs/common';
import { UserNotFound } from '../Error/user-not-found';
import { Role } from '@/users/domain/enum/user.enum';
import { AUTH_PROVIDER } from '@/users/domain/interface/authProvider';
import type { IAuthProvider } from '@/users/domain/interface/authProvider';

@Injectable()
export class DeleteUserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,

    @Inject(AUTH_PROVIDER)
    private readonly authProvider: IAuthProvider,
  ) {}

  async delete(id: string, expectedRole: Role) {
    const user = await this.userRepository.findUserById(id);

    if (!user || user.role !== expectedRole) throw new UserNotFound();

    // deleting from supabase
    await this.authProvider.deleteAuthUser(user.authUserId);

    // deleting from database
    await this.userRepository.deleteUser(user.id);
  }
}
