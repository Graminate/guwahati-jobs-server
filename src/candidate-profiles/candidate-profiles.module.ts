import { Module } from '@nestjs/common';
import { CandidateProfilesService } from './candidate-profiles.service';
import { CandidateProfilesController } from './candidate-profiles.controller';

@Module({
  controllers: [CandidateProfilesController],
  providers: [CandidateProfilesService],
  exports: [CandidateProfilesService],
})
export class CandidateProfilesModule {}
