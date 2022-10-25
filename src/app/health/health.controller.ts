import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';


@Controller('health')
export class HealthController {
  constructor(
    private healthCheckService: HealthCheckService,
    private healthIndicator: HttpHealthIndicator,
  ) { }

  @Get()
  @HealthCheck()
  check() {
    return this.healthCheckService.check([
      async () => {
        return {
          apiVersion: {
            status: 'up',
          },
        };
      },
    ])
  }
}

