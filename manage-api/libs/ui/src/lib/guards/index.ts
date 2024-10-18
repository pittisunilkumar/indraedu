
import { AuthGuard } from './auth.guard';
import { UserCanAccessGuard } from './user-can-access.guard';
// import { MainModuleGuard } from './role-permissions guards/main-module.guard';
// import { SubModuleGuard } from './role-permissions guards/sub-module-view.guard';
import { CreateGuard } from './role-permissions guards/create.guard';

import { AccessToBankGuard } from './bank/bank.guard';
import { AccessToManageGuard } from './manage/manage.guard';
import { BannersGuard } from './bank/banner.guard';
import { VideoCypherGuard } from './bank/video-cypher.guard';
import { SyllabusGuard } from './bank/syllabus.guard';
import { QuestionTagsGuard } from './bank/question-tags.guard';
import { QuestionsGuard } from './bank/questions.guard';
import { CouponsGuard } from './manage/coupons.guard';

import { CoursesGuard } from './manage/courses.guard';
import { EmployeeGuard } from './manage/employee.guard';
import { UsersGuard } from './manage/user.guard';
import { UserPaymentsGuard } from './manage/user-payments.guard';
import { AgentGuard } from './manage/agents.guard';
import { SubscriptionsGuard } from './manage/subscriptions.guard';
import { RolesGuard } from './manage/roles.guard';
import { RoleSubModuleGuard } from './manage/role-sub-module.guard';
import { RoleModuleGuard } from './manage/role-module.guard';

import { TestSeriesGuard } from './test-series/test-category.guard';
import { VideoSubjectGuard } from './videos/video-subject.guard';
import { QBankSubjectGuard } from './qbank/qbank-subject.guard';
import { CareersGuard } from './portals/careers.guard';
import { AboutUsGuard } from './portals/aboutUs.guard';
import { UserMessageGuard } from './portals/user-messages.guard';
import { EditGuard } from './role-permissions guards/edit.guard';
import { CreateTestGuard } from './test-series/create-test.guard';
import { EditTestGuard } from './test-series/edit-test.guard';
import { ViewTestQuestionGuard } from './test-series/view-questions.guard';
import { QBankChapterGuard } from './qbank/q-chapters.guard';
import { CreateQTopicGuard } from './qbank/create-topic.guard';
import { EditQTopicGuard } from './qbank/edit-topic.guard';
import { ViewQTopicQueGuard } from './qbank/view-q-questions.guard';
import { VideoChapterGuard } from './videos/video.guard';
import { CreateVideoGuard } from './videos/create-video.guard';
import { EditVideoGuard } from './videos/edit-video.guard';
import { AgentTransactionsGuard } from './manage/agent-transactrions.gouard';
import { AgentCouponsGuard } from './manage/agent-coupon.guard';
import { SuggestedVideosGuard } from './videos/suggested-videos.guard';
import { SuggestedTopicsGuard } from './qbank/suggested-topic.guard';
import { SuggestedTestsGuard } from './test-series/suggested-tests.guard';
import { NotificationGuard } from './portals/notification.guard';
import { MCQGuard } from './bank/mcq.guard';
import { PaymentDashboardGuard } from './dashboard/payment-dashboard';
import { MasterAdviceGuard } from './bank/master-advice.guard';
import { OrganizationGuard } from './manage/organization.guard';
import { FeedbackGuard } from './portals/feedback.guard';

import { DepartmentGuard } from './manage/department.guard';



export const guards = [
  AuthGuard, 
  UserCanAccessGuard,
  MasterAdviceGuard,

  // SubModuleGuard,
  // MainModuleGuard,

  CreateGuard,
  EditGuard,
  
  AccessToBankGuard,
  BannersGuard,
  VideoCypherGuard,
  SyllabusGuard,
  QuestionTagsGuard,
  QuestionsGuard,
  MCQGuard,

  AccessToManageGuard,
  CouponsGuard,
  CoursesGuard,
  EmployeeGuard,
  UsersGuard,
  UserPaymentsGuard,
  AgentGuard,
  AgentTransactionsGuard,
  AgentCouponsGuard,
  SubscriptionsGuard,
  RolesGuard,
  RoleSubModuleGuard,
  RoleModuleGuard,
  DepartmentGuard,

  TestSeriesGuard,
  CreateTestGuard,
  EditTestGuard,
  ViewTestQuestionGuard,
  SuggestedTestsGuard,

  VideoSubjectGuard,
  VideoChapterGuard,
  CreateVideoGuard,
  EditVideoGuard,
  SuggestedVideosGuard,

  QBankSubjectGuard,
  QBankChapterGuard,
  ViewQTopicQueGuard,
  CreateQTopicGuard,
  EditQTopicGuard,
  SuggestedTopicsGuard,

  AboutUsGuard,
  CareersGuard,
  UserMessageGuard,
  NotificationGuard,
  PaymentDashboardGuard,
  OrganizationGuard,
  FeedbackGuard
];

export * from './auth.guard';
export * from './user-can-access.guard';
export * from './bank/master-advice.guard'

// export * from './role-permissions guards/sub-module-view.guard';
// export * from './role-permissions guards/main-module.guard';

export * from './role-permissions guards/create.guard';
export * from './role-permissions guards/edit.guard';

export * from './bank/bank.guard';
export * from './bank/banner.guard';
export * from './bank/video-cypher.guard';
export * from './bank/syllabus.guard';
export * from './bank/question-tags.guard';
export * from './bank/questions.guard';
export * from './bank/mcq.guard';


export * from './manage/manage.guard';
export * from './manage/coupons.guard';
export * from './manage/agents.guard';
export * from './manage/agent-coupon.guard';
export * from './manage/agent-transactrions.gouard';
export * from './manage/courses.guard';
export * from './manage/employee.guard';
export * from './manage/role-module.guard';
export * from './manage/role-sub-module.guard';
export * from './manage/roles.guard';
export * from './manage/subscriptions.guard';
export * from './manage/user-payments.guard';
export * from './manage/user.guard';
export * from './manage/organization.guard';
export * from './manage/department.guard';


export * from './test-series/test-category.guard';
export * from './test-series/create-test.guard';
export * from './test-series/edit-test.guard';
export * from './test-series/view-questions.guard';
export * from './test-series/suggested-tests.guard';


export * from './qbank/qbank-subject.guard';
export * from './qbank/q-chapters.guard';
export * from './qbank/create-topic.guard';
export * from './qbank/edit-topic.guard';
export * from './qbank/view-q-questions.guard';
export * from './qbank/suggested-topic.guard';


export * from './videos/video-subject.guard';
export * from './videos/video.guard';
export * from './videos/edit-video.guard';
export * from './videos/create-video.guard';
export * from './videos/suggested-videos.guard'

export * from './portals/aboutUs.guard';
export * from './portals/careers.guard';
export * from './portals/user-messages.guard';
export * from './portals/notification.guard';
export * from './portals/feedback.guard';

export * from './dashboard/payment-dashboard'







