import { AuthModule } from '@application/auth';
import {  SharedApiModule, AgentTransactionsSchema } from '@application/shared-api';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AgentTransactionsController } from './agent-transactions.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'AgentTransactions',
        schema: AgentTransactionsSchema,
      },
    ]),
    SharedApiModule,
    AuthModule,
  ],
  controllers: [AgentTransactionsController],
})
export class AgentTransactionsModule {}
