import { USER_REPOSITORY } from '@/users/domain/interface/user.interface';
import type { IUserRepository } from '@/users/domain/interface/user.interface';
import { Inject, Injectable } from '@nestjs/common';
import { registerUserSchema } from '../validation/create-user.schema';
import type { RegisterUserInput } from '../validation/create-user.schema';
import { EmailAlreadyExists } from '@/Error/email-already-exists';
import { Role } from '@/users/domain/enum/user.enum';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async register(data: RegisterUserInput) {
    const validationData = registerUserSchema.parse(data);

    const name = validationData.name;
    const email = validationData.email;

    // verifying if already has an e-mail
    const userEmail = await this.userRepository.findUserByEmail(email);

    if (userEmail) throw new EmailAlreadyExists();

    // save in db
    const user = await this.userRepository.createUser({
      name: name,
      email: email,
      authUserId: '', // !todo falta integrar o supabase
      role: Role.MANAGER,
    });

    return { user };
  }
}
