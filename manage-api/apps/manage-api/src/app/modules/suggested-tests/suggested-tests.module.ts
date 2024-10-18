import { AuthModule } from '@application/auth';
import { SuggestedTestsSchema, SharedApiModule } from '@application/shared-api';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SuggestedTestsController } from './suggested-tests.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'SuggestedTests',
        schema: SuggestedTestsSchema,
      },
    ]),
    SharedApiModule,
    AuthModule,
  ],
  controllers: [SuggestedTestsController],
})
export class SuggestedTestsModule {}
