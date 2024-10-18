import { AuthModule } from '@application/auth';
import { QBankSchema, QBankSubjectSchema, SharedApiModule } from '@application/shared-api';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QBankSubjectController } from './qbank-subjects.controller';
import { QBankController } from './qbank.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'QBank',
        schema: QBankSchema,
      },
      {
        name: 'QBankSubject',
        schema: QBankSubjectSchema,
      },
    ]),
    SharedApiModule,
    AuthModule
  ],
  controllers: [QBankController, QBankSubjectController]
})
export class QBankModule {}
