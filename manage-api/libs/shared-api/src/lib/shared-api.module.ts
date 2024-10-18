import { Global, HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import * as fromHelpers from './helpers';
import * as fromMobileServices from './mobile-services';
import {
  AboutUsSchema,
  BannerSchema,
  CareersSchema,
  CouponSchema,
  CourseSchema,
  FacultySchema,
  QBankSchema,
  QBankSubjectSchema,
  QuestionSchema,
  ReportErrorSchema,
  SampleSchema,
  SubmittedQBankTopicSchema,
  SubmittedTestSchema,
  SubscriptionSchema,
  SyllabusSchema,
  TagsSchema,
  TestSchema,
  TSCategoriesSchema,
  UserMessageSchema,
  UserSchema,
  VideoSchema,
  VideoSubjectSchema,
  PearlsSchema,
  EmployeeSchema,
  UserTransactionsSchema,
  RoleModuleSchema,
  RoleSubModulesSchema,
  RolesSchema,
  AgentTransactionsSchema,
  PearlSubjectsSchema,
  SuggestedVideosSchema,
  SuggestedTestsSchema,
  SuggestedQbankSchema,
  MCQOfTheDaySchema,
  NotificationsSchema,
  UserNotificationsSchema,
  LogsSchema,
  DailyTestQuestionsSchema,
  DisableuserfortestsubmitSchema,
  OrganizationSchema,

  FeedbackSheema,
  DepartmentSchema,
  TicketSchema,

} from './schema';
import * as fromServices from './services';

const videoCipherApiKey = '';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'AboutUs',
        schema: AboutUsSchema,
      },
      {
        name: 'Banner',
        schema: BannerSchema,
      },
      {
        name: 'Sample',
        schema: SampleSchema,
      },
      {
        name: 'Career',
        schema: CareersSchema,
      },
      {
        name: 'Course',
        schema: CourseSchema,
      },
      {
        name: 'Coupon',
        schema: CouponSchema,
      },
      {
        name: 'Faculty',
        schema: FacultySchema,
      },
      {
        name: 'QBank',
        schema: QBankSchema,
      },
      {
        name: 'QBankSubject',
        schema: QBankSubjectSchema,
      },
      {
        name: 'Question',
        schema: QuestionSchema,
      },
      {
        name: 'ReportError',
        schema: ReportErrorSchema,
      },
      {
        name: 'Subscription',
        schema: SubscriptionSchema,
      },
      {
        name: 'Syllabus',
        schema: SyllabusSchema,
      },
      {
        name: 'Tags',
        schema: TagsSchema,
      },
      {
        name: 'Test',
        schema: TestSchema,
      },
      {
        name: 'TSCategories',
        schema: TSCategoriesSchema,
      },
      {
        name: 'User',
        schema: UserSchema,
      },
      {
        name: 'UserMessage',
        schema: UserMessageSchema,
      },
      {
        name: 'Video',
        schema: VideoSchema,
      },
      {
        name: 'VideoSubject',
        schema: VideoSubjectSchema,
      },
      {
        name: 'SubmittedTest',
        schema: SubmittedTestSchema,
      },
      {
        name: 'SubmittedQBankTopic',
        schema: SubmittedQBankTopicSchema,
      },
      {
        name: 'Pearls',
        schema: PearlsSchema,
      },
      {
        name: 'Employee',
        schema: EmployeeSchema,
      },
      {

        name: 'UserTransactions',
        schema: UserTransactionsSchema,
      },
      {
        name: 'RoleModules',
        schema: RoleModuleSchema,
      },
      {
        name: 'RoleSubModules',
        schema: RoleSubModulesSchema,
      },
      {
        name: 'Roles',
        schema: RolesSchema,
      },
      {
        name: 'AgentTransactions',
        schema: AgentTransactionsSchema,
      },
      {
        name: 'PearlSubjects',
        schema: PearlSubjectsSchema,
      },
      {
        name: 'SuggestedVideos',
        schema: SuggestedVideosSchema,
      },
      {
        name: 'SuggestedTests',
        schema: SuggestedTestsSchema,
      },
      {
        name: 'SuggestedQbank',
        schema: SuggestedQbankSchema,
      },
      {
        name: 'Notifications',
        schema: NotificationsSchema,
      },
      {
        name: 'UserNotifications',
        schema: UserNotificationsSchema,
      },
      {

        name: 'MCQOfTheDay',
        schema: MCQOfTheDaySchema,
      },
      {
        name: 'Logs',
        schema: LogsSchema
      },
      {
        name: 'DailyTestQuestions',
        schema: DailyTestQuestionsSchema
      },
      {
        name: 'Disableuserfortestsubmits',
        schema: DisableuserfortestsubmitSchema
      },
      {
        name: 'Organization',
        schema: OrganizationSchema
      },
      {
        name: 'Feedbacks',
        schema: FeedbackSheema
      },

      {
        name: 'Department',
        schema: DepartmentSchema
      },
      {
        name: 'Ticket',
        schema: TicketSchema
      },

    ]),
    HttpModule.registerAsync({
      useFactory: () => ({
        maxRedirects: 5,
        headers: {
          'Accept': 'application/json',
          'Authorization': `Apisecret ${videoCipherApiKey}`,
          'Content-Type': 'application/json'
        }
      }),
    }),
  ],
  providers: [
    ...fromServices.services,
    ...fromMobileServices.mobileServices,
    ...fromHelpers.apiHelpers,
  ],
  exports: [...fromServices.services, ...fromMobileServices.mobileServices],
})
export class SharedApiModule {}
