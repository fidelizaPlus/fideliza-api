import { PrismaModule } from '@/shared/prisma/prismaService.module';
import { Module } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { UserService } from './app/service/users.service';
import { USER_REPOSITORY } from './domain/interface/user.interface';
import { AuthService } from './app/service/userAuth.service';
import { RegisterClientController } from './presentation/controllers/auth/registerClient.controller';
import { RegisterManagerController } from './presentation/controllers/auth/registerManager.controller';

@Module({
  imports: [PrismaModule],
  providers: [
    UserService,
    AuthService,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
  ],
  controllers: [RegisterClientController, RegisterManagerController],

  exports: [UserService],
})
export class UserModule {}
