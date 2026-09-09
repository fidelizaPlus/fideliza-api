import { envSchema } from './env/envSchema';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './shared/prisma/prismaService.module';
import { UserModule } from './users/user.module';
import { HealthModule } from './health/health.module';
import { CampaignModule } from './campaign/campaign.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    UserModule,
    HealthModule,
    CampaignModule,
  ],
})
export class AppModule {}
