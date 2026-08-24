import { USER_REPOSITORY } from '@/users/domain/interface/user.interface';
import type { IUserRepository } from '@/users/domain/interface/user.interface';
import { BadGatewayException, Inject } from '@nestjs/common';
import { UserNotFound } from '../Error/user-not-found';
import { supabaseAdmin } from '@/infra/supabase/createClient';

export class DeleteUserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async delete(id: string): Promise<void> {
    const user = await this.userRepository.findUserByAuthUserId(id);

    if (!user) throw new UserNotFound();

    // deleting from supabase
    const { error } = await supabaseAdmin.auth.admin.deleteUser(user.authUserId);

    if (error) {
      throw new BadGatewayException(`Could not delete user from Supabase: ${error.message}`);
    }

    // deleting from database
    await this.userRepository.deleteUser(user.id);
  }
}
