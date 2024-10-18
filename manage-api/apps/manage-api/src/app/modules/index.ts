import { NotificationsModule } from './notifications/notifications.module';
import { BannersModule } from './banners/banners.module';
import { TagsModule } from './tags/tags.module';
import { CouponsModule } from './coupons/coupon.module';
import { CoursesModule } from './courses/courses.module';
import { FacultyModule } from './faculty/faculty.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { PermissionsModule } from './permissions/permissions.module';
import { PortalModule } from './portal/portal.module';
import { QBankModule } from './q-bank/q-bank.module';
import { QuestionsModule } from './questions/questions.module';
import { SampleModule } from './sample/sample.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { SyllabusModule } from './syllabus/syllabus.module';
import { TestSeriesModule } from './test-series/test-series.module';
import { ManageUsersModule } from './users/users.module';
import { VideoCipherModule } from './video-cipher/video-cipher.module';
import { VideosModule } from './videos/videos.module';
import { PearlsModule } from './pearls/pearls.module';
import { ManageEmployeeModule } from './employee/employee.module';
import { UserTransactionsModule } from './user-transactions/user-transactions.module';
import { RoleValuesModule } from './role-values/role-values.module';
import { RoleSubModulesModule } from './role-submodules/role-submodules.module';
import { RolesModule } from './roles/roles.module';
import { AgentTransactionsModule } from './agent-transactions/agent-transactions.module';
import { PearlSubjectsModule } from './pearl-subjects/pearl-subjects.module';
import { SuggestedVideosModule } from './suggested-videos/suggested-videos.module';
import { SuggestedTestsModule } from './suggested-tests/suggested-tests.module';
import { SuggestedQbankModule } from './suggested-qbank/suggested-qbank.module';
import { MCQOfTheDayModule } from './mcq-of-the-day/mcq-of-the-day.module';
import { LogsModule } from './logs/logs.module';
import { PortalFeedbackModule } from './feedback/feedback.module';

import { ManageDepartmentModule } from './department/department.module';


export const modules = [
  BannersModule,
  TagsModule,
  CouponsModule,
  CoursesModule,
  FacultyModule,
  ManageUsersModule,
  ManageEmployeeModule,
  OrganizationsModule,
  PortalModule,
  PermissionsModule,
  QBankModule,
  QuestionsModule,
  SampleModule,
  SubscriptionsModule,
  SyllabusModule,
  VideosModule,
  TestSeriesModule,
  VideoCipherModule,
  PearlsModule,
  UserTransactionsModule,
  RoleValuesModule,
  RoleSubModulesModule,
  RolesModule,
  AgentTransactionsModule,
  PearlSubjectsModule,
  SuggestedVideosModule,
  SuggestedTestsModule,
  SuggestedQbankModule,
  MCQOfTheDayModule,
  NotificationsModule,
  PortalFeedbackModule,
  LogsModule,
  ManageDepartmentModule
];

export * from './coupons/coupon.module';
export * from './courses/courses.module';
export * from './permissions/permissions.module';
export * from './portal/portal.module';
export * from './q-bank/q-bank.module';
export * from './subscriptions/subscriptions.module';
export * from './organizations/organizations.module';
export * from './users/users.module';
export * from './sample/sample.module';
export * from './courses/courses.module';
export * from './syllabus/syllabus.module';
export * from './test-series/test-series.module';
export * from './questions/questions.module';
export * from './video-cipher/video-cipher.module';
export * from './videos/videos.module';
export * from './tags/tags.module';
export * from './pearls/pearls.module';
export * from './user-transactions/user-transactions.module';
export * from './role-values/role-values.module';
export * from './role-submodules/role-submodules.module';
export * from './roles/roles.module';
export * from './agent-transactions/agent-transactions.module';
export * from './pearl-subjects/pearl-subjects.module';
export * from './suggested-videos/suggested-videos.module';
export * from './suggested-tests/suggested-tests.module';
export * from  './suggested-qbank/suggested-qbank.module';
export * from './mcq-of-the-day/mcq-of-the-day.module';
export * from './notifications/notifications.module';
export * from './logs/logs.module';
export * from './feedback/feedback.module';
export * from './department/department.module';