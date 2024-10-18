import { AuthModule } from '@application/auth';
import { SuggestedQbankSchema, SharedApiModule } from '@application/shared-api';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SuggestedQbankController } from './suggested-qbank.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'SuggestedQbank',
        schema: SuggestedQbankSchema,
      },
    ]),
    SharedApiModule,
    AuthModule,
  ],
  controllers: [SuggestedQbankController],
})
export class SuggestedQbankModule {}
