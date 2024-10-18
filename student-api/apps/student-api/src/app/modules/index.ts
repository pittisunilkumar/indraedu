import { StudentCoursesModule } from './courses/courses.module';
import { HomeModule } from './home/home.module';
import { PortalModule } from './portal/portal.module';
import { QBankModule } from './q-bank/q-bank.module';
import { StudentsSubscriptionsModule } from './subscriptions/subscriptions.module';
import { TestSeriesModule } from './test-series/test-series.module';
import { StudentUserModule } from './user/user.module';
import { VideosModule } from './videos/videos.module';
import { PaymentGatewayModule } from './payment-gateway/payment-gateway.module';
import { PearlsModule } from './pearls/pearls.module';
import { SumanTvModule } from './suman-tv/suman-tv.module';
import { SupportTicketModule } from './support-tickets/support-ticket.module';
import { PaymentGatewayModuleV1 } from './payment-gateway/v1/payment-gateway.module-v1';

export const modules = [
  HomeModule,
  StudentUserModule,
  PortalModule,
  VideosModule,
  StudentCoursesModule,
  StudentsSubscriptionsModule,
  TestSeriesModule,
  QBankModule,
  PaymentGatewayModule,
  PaymentGatewayModuleV1,
  PearlsModule,
  SumanTvModule,
  SupportTicketModule
];

export * from './courses/courses.module';
export * from './home/home.module';
export * from './portal/portal.module';
export * from './q-bank/q-bank.module';
export * from './subscriptions/subscriptions.module';
export * from './test-series/test-series.module';
export * from './user/user.module';
export * from './pearls/pearls.module';
export * from './videos/videos.module';
export * from './payment-gateway/payment-gateway.module'
export * from './payment-gateway/v1/payment-gateway.module-v1'
export * from './suman-tv/suman-tv.module';
export * from './support-tickets/support-ticket.module';