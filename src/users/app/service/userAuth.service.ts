import { Injectable } from '@nestjs/common';
import { registerUserSchema } from '../validation/create-user.schema';
import type { RegisterUserInput } from '../validation/create-user.schema';
import { Role } from '@/users/domain/enum/user.enum';
import { supabaseAdmin } from '@/infra/supabase/createClient';
import { InformEmail } from '@/users/app/Error/email-inform';
import { InformPassword } from '@/users/app/Error/password-inform';
import { InvalidPassword } from '@/users/app/Error/invalid-password';
import { InvalidPasswordLength } from '@/users/app/Error/invalid-password-length';
import { InvalidEmail } from '@/users/app/Error/invalid-email';
import { UserService } from './users.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async registerClient(data: RegisterUserInput) {
    return this.register(data, Role.CLIENT);
  }

  async registerManager(data: RegisterUserInput) {
    return this.register(data, Role.MANAGER);
  }

  async register(data: RegisterUserInput, role: Role) {
    if (data.email.trim() === '') throw new InformEmail();
    if (!data.email.includes('@')) throw new InvalidEmail();
    if (data.password.trim() === '') throw new InformPassword();
    if (data.password !== data.passwordConfirmation) throw new InvalidPassword();
    if (data.password.length < 9) throw new InvalidPasswordLength();

    const validationData = registerUserSchema.parse(data);
    const { name, email, password } = validationData;

    // create auth on supabase
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError || !authData.user) {
      throw new Error(authError?.message ?? 'Could not create authentication user');
    }

    // 2. Agora temos o authUserId
    const createUserData = {
      name,
      email,
      authUserId: authData.user.id,
    };

    try {
      const user =
        role === Role.CLIENT
          ? await this.userService.createClient(createUserData)
          : await this.userService.createManager(createUserData);

      return { user };
    } catch (error) {
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      throw error;
    }
  }
}
