import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CompanyProfilesModule } from './company-profiles/company-profiles.module';
import { CandidateProfilesModule } from './candidate-profiles/candidate-profiles.module';
import { JobPostingsModule } from './job-postings/job-postings.module';
import { ApplicationsModule } from './applications/applications.module';
import { MessagesModule } from './messages/messages.module';
import { InterviewsModule } from './interviews/interviews.module';
import { SavedJobsModule } from './saved-jobs/saved-jobs.module';
import { ReviewsModule } from './reviews/reviews.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { NotificationsModule } from './notifications/notifications.module';
import { JobAlertsModule } from './job-alerts/job-alerts.module';
import { PasswordModule } from './password/password.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    CompanyProfilesModule,
    CandidateProfilesModule,
    JobPostingsModule,
    ApplicationsModule,
    MessagesModule,
    InterviewsModule,
    SavedJobsModule,
    ReviewsModule,
    SubscriptionsModule,
    NotificationsModule,
    JobAlertsModule,
    PasswordModule
  ],
})
export class AppModule {}
