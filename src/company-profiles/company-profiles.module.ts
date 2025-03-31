import { Module } from '@nestjs/common';
import { CompanyProfilesService } from './company-profiles.service';
import { CompanyProfilesController } from './company-profiles.controller';

@Module({
  controllers: [CompanyProfilesController],
  providers: [CompanyProfilesService],
  exports: [CompanyProfilesService],
})
export class CompanyProfilesModule {}
