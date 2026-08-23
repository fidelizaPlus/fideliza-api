import { USER_REPOSITORY } from '@/users/domain/interface/user.interface';
import type { IUserRepository } from '@/users/domain/interface/user.interface';
import { Inject, Injectable } from '@nestjs/common';
import { registerUserSchema } from '../validation/create-user.schema';
import type { RegisterUserInput } from '../validation/create-user.schema';
import { EmailAlreadyExists } from '@/Error/email-already-exists';
import { Role } from '@/users/domain/enum/user.enum';
import { supabaseAdmin } from '@/infra/supabase/createClient';
import { InformEmail } from '@/Error/email-inform';
import { InformPassword } from '@/Error/password-inform';
import { InvalidPassword } from '@/Error/invalid-password';
import { InvalidPasswordLength } from '@/Error/invalid-password-length';
import { InvalidEmail } from '@/Error/invalid-email';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async register(data: RegisterUserInput) {
    if (data.email.trim() === '') throw new InformEmail();
    if (!data.email.includes('@')) throw new InvalidEmail();
    if (data.password.trim() === '') throw new InformPassword();
    if (data.password !== data.passwordConfirmation) throw new InvalidPassword();
    if (data.password.length < 9) throw new InvalidPasswordLength();

    const validationData = registerUserSchema.parse(data);
    const { name, email, password } = validationData;

    const userEmail = await this.userRepository.findUserByEmail(email);

    if (userEmail) {
      throw new EmailAlreadyExists();
    }

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError || !authData.user) {
      throw new Error(authError?.message ?? 'Could not create authentication user');
    }

    try {
      const user = await this.userRepository.createUser({
        name,
        email,
        authUserId: authData.user.id,
        role: Role.MANAGER,
      });

      return { user };
    } catch (error) {
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      throw error;
    }
  }
}
