import { Role } from '@/users/domain/enum/user.enum';
import type { User } from '@/users/domain/entity/user.entity';
import type { CreateUserInput } from '@/users/domain/interface/createUserInput.interface';
import { USER_REPOSITORY } from '@/users/domain/interface/user.interface';
import type { IUserRepository } from '@/users/domain/interface/user.interface';
import { Inject, Injectable } from '@nestjs/common';
import { UserAlreadyExist } from '@/Error/user-already-exist';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async createManager(data: CreateUserInput): Promise<User> {
    return this.createUser(data, Role.MANAGER);
  }

  async createClient(data: CreateUserInput): Promise<User> {
    return this.createUser(data, Role.CLIENT);
  }

  // save in db
  async createUser(data: CreateUserInput, role: Role): Promise<User> {
    const user = await this.userRepository.findUserByEmail(data.email);

    if (user) {
      throw new UserAlreadyExist();
    }

    return this.userRepository.createUser({
      ...data,
      role,
    });
  }
}
