import { BankModule } from './bank/bank.module';
import { ManageModule } from './manage/manage.module';
import { TestingModule } from './manage/modules/testing/testing.module';
import { PortalsModule } from './portals/portals.module';
import { QBankModule } from './q-bank/q-bank.module';
import { TestSeriesModule } from './test-series/test-series.module';
import { VideosModule } from './videos/videos.module';

export const modules = [
  BankModule,
  ManageModule,
  QBankModule,
  TestSeriesModule,
  PortalsModule,
  VideosModule,
  TestingModule
];

export * from './bank/bank.module';
export * from './manage/manage.module';
export * from './manage/modules/testing/testing.module';
export * from './q-bank/q-bank.module';
export * from './test-series/test-series.module';
export * from './bank/bank.module';
export * from './manage/manage.module'
export * from './portals/portals.module';
export * from './videos/videos.module';
