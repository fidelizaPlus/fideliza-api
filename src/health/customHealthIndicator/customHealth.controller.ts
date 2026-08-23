import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { DatabaseHealthIndicator } from './databaseHealthIndicator';

@Controller('health')
export class CustomHealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly database: DatabaseHealthIndicator,
  ) {}

  @Get('database')
  @HealthCheck()
  check() {
    return this.health.check([() => this.database.isHealthy('database')]);
  }
}
