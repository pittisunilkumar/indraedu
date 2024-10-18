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
  PearlSubjectsSchema,
  EmployeeSchema,
  UserTransactionsSchema,
  OwnPaperSchema,
  SuggestedVideosSchema,
  SuggestedQbankSchema,
  SuggestedTestsSchema,
  MCQOfTheDaySchema,
  NotificationsSchema,
  UserNotificationsSchema,
  UserQbankResetSchema,
  DisableUserForTestSubmitSchema,
  PearlBookMarksSchema,
  PaymentHookResponseSchema,
  OrganizationSchema,
  TicketSchema,
  DepartmentSchema,
  FeedbackSheema,
  SmsTemplatesSchema,
  GroupSchema
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
        name: 'PearlSubjects',
        schema: PearlSubjectsSchema,
      },
      {
        name: 'PearlBookMarks',
        schema: PearlBookMarksSchema,
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
        name: 'OwnPaper',
        schema: OwnPaperSchema,
      },
      {
        name: 'SuggestedVideos',
        schema: SuggestedVideosSchema,
      },
      {
        name: 'SuggestedQbank',
        schema: SuggestedQbankSchema,
      },
      {
        name: 'SuggestedTests',
        schema: SuggestedTestsSchema,
      },
      {
        name: 'MCQOfTheDay',
        schema: MCQOfTheDaySchema,
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
        name: 'UserQbankReset',
        schema: UserQbankResetSchema,
      },
      {
        name: 'DisableUserForTestSubmit',
        schema: DisableUserForTestSubmitSchema,
      },
      {
        name: 'PaymentHookResponse',
        schema: PaymentHookResponseSchema,
      },{
        name: 'Organization',
        schema: OrganizationSchema
      },{
        name: 'Department',
        schema: DepartmentSchema
      },
      {
        name: 'Ticket',
        schema: TicketSchema
      },{
        name: 'Feedback',
        schema: FeedbackSheema
      },
      {
        name: 'SmsTemplate',
        schema: SmsTemplatesSchema
      },
      {
        name: 'Groups',
        schema: GroupSchema
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
