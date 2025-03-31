import { Module } from '@nestjs/common';
import { JobAlertsService } from './job-alerts.service';
import { JobAlertsController } from './job-alerts.controller';

@Module({
  controllers: [JobAlertsController],
  providers: [JobAlertsService],
  exports: [JobAlertsService],
})
export class JobAlertsModule {}
