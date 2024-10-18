import { BannersRepositoryService } from './banners-repository.service';
import { CareersRepositoryService } from './careers-repository.service';
import { CouponsRepositoryService } from './coupons-repository.service';
import { CourseRepositoryService } from './course-repository.service';
import { EmployeeRepositoryService } from './employee-repository.service';
import { FacultyRepositoryService } from './faculty-repository.service';
import { HomeRepositoryService } from './home-repository.service';
import { OrganizationRepositoryService } from './organization-repository.service';
import { PortalRepositoryService } from './portal-repository.service';
import { QBankRepositoryService } from './qbank-repository.service';
import { QuestionsRepositoryService } from './questions-repository.service';
import { SubscriptionsRepositoryService } from './subscriptions-repository.service';
import { SyllabusRepositoryService } from './syllabus-repository.service';
import { TagsRepositoryService } from './tags-repository.service';
import * as tsRepos from './test-series';
import { UserTransactionsService } from './user-transactions.service';
import { UsersRepositoryService } from './users-repository.service';
import { VideoCipherRepositoryService } from './video-cipher-repository.service';
import { VideosRepositoryService } from './videos-repository.service';

export const repositories = [
  BannersRepositoryService,
  CareersRepositoryService,
  CouponsRepositoryService,
  CourseRepositoryService,
  FacultyRepositoryService,
  HomeRepositoryService,
  OrganizationRepositoryService,
  PortalRepositoryService,
  QBankRepositoryService,
  QuestionsRepositoryService,
  SyllabusRepositoryService,
  VideoCipherRepositoryService,
  VideosRepositoryService,
  UsersRepositoryService,
  EmployeeRepositoryService,
  SubscriptionsRepositoryService,
  TagsRepositoryService,
  UserTransactionsService,
  ...tsRepos.repositories,
];

export * from './banners-repository.service';
export * from './careers-repository.service';
export * from './coupons-repository.service';
export * from './course-repository.service';
export * from './faculty-repository.service';
export * from './home-repository.service';
export * from './organization-repository.service';
export * from './portal-repository.service';
export * from './qbank-repository.service';
export * from './questions-repository.service';
export * from './syllabus-repository.service';
export * from './users-repository.service';
export * from './employee-repository.service';
export * from './video-cipher-repository.service';
export * from './videos-repository.service';
export * from './test-series';
export * from './subscriptions-repository.service';
export * from './tags-repository.service';
export * from './user-transactions.service';