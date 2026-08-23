import { PrismaModule } from '@/shared/prisma/prismaService.module';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { CustomHealthController } from './customHealthIndicator/customHealth.controller';
import { DatabaseHealthIndicator } from './customHealthIndicator/databaseHealthIndicator';
import { HealthController } from './http/health.controller';
import { MemoryHealthController } from './memory/memoryHealth.controller';

@Module({
  imports: [TerminusModule, HttpModule, PrismaModule],
  controllers: [HealthController, MemoryHealthController, CustomHealthController],
  providers: [DatabaseHealthIndicator],
})
export class HealthModule {}
