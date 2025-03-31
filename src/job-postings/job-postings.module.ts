import { Module } from '@nestjs/common';
import { JobPostingsService } from './job-postings.service';
import { JobPostingsController } from './job-postings.controller';

@Module({
  controllers: [JobPostingsController],
  providers: [JobPostingsService],
  exports: [JobPostingsService],
})
export class JobPostingsModule {}
