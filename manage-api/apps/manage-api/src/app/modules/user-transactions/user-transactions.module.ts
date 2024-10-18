import { AuthModule } from '@application/auth';
import { UserTransactionsSchema, SharedApiModule } from '@application/shared-api';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserTransactionsController } from './user-transactions.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'UserTransactions',
        schema: UserTransactionsSchema,
      },
    ]),
    SharedApiModule,
    AuthModule,
  ],
  controllers: [UserTransactionsController],
})
export class UserTransactionsModule {}
