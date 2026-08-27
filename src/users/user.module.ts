import { PrismaModule } from '@/shared/prisma/prismaService.module';
import { Module } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { UserService } from './app/service/users.service';
import { USER_REPOSITORY } from './domain/interface/user.interface';
import { AuthService } from './app/service/userAuth.service';
import { RegisterClientController } from './presentation/controllers/auth/registerClient.controller';
import { RegisterManagerController } from './presentation/controllers/auth/registerManager.controller';
import { DeleteManagerController } from './presentation/controllers/user/deleteManager.controller';
import { DeleteClientController } from './presentation/controllers/user/deleteClient.controller';
import { DeleteUserService } from './app/service/deleteUser.service';
import { AUTH_PROVIDER } from './domain/interface/authProvider';
import { SupabaseAuthProvider } from '@/infra/supabase/supabaseAuthProvider';
import { AuthGuard } from './presentation/guards/auth/auth.guard';
import { LoginController } from './presentation/controllers/auth/login.controller';
import { SignOutController } from './presentation/controllers/auth/signout.controller';
import { SignInService } from './app/service/signin.service';
import { SignOutService } from './app/service/signout.service';
import { RefreshTokenService } from './app/service/refreshToken.service';
import { RefreshTokenController } from './presentation/controllers/auth/refreshToken.controller';

@Module({
  imports: [PrismaModule],
  providers: [
    UserService,
    AuthService,
    DeleteUserService,
    AuthGuard,
    SignInService,
    SignOutService,
    RefreshTokenService,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    {
      provide: AUTH_PROVIDER,
      useClass: SupabaseAuthProvider,
    },
  ],
  controllers: [
    RegisterClientController,
    RegisterManagerController,
    DeleteManagerController,
    DeleteClientController,
    LoginController,
    SignOutController,
    RefreshTokenController,
  ],

  exports: [UserService],
})
export class UserModule {}
