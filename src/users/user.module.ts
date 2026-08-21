import { PrismaModule } from '@/shared/prisma/prismaService.module';
import { Module } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { UserService } from './app/service/users.service';
import { USER_REPOSITORY } from './domain/interface/user.interface';

@Module({
  imports: [PrismaModule],
  providers: [
    UserService,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
  ],

  exports: [UserService],
})
export class UserModule {}
