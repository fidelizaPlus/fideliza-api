import { envSchema } from './env/envSchema';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './shared/prisma/prismaService.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    PrismaModule,
  ],
})
export class AppModule {}
