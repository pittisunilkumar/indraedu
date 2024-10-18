import { AuthModule } from '@application/auth';
import { SharedApiModule } from '@application/shared-api';
import { Module } from '@nestjs/common';
import { QBankSubjectController } from './qbank-subjects.controller';
import { QBankController } from './qbank.controller';

@Module({
  imports: [SharedApiModule, AuthModule],
  controllers: [QBankController, QBankSubjectController],
  providers: [],
})
export class QBankModule {}
