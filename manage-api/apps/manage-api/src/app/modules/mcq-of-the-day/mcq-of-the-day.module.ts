import { AuthModule } from '@application/auth';
import { MCQOfTheDaySchema, SharedApiModule } from '@application/shared-api';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MCQOfTheDayController } from './mcq-of-the-day.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'MCQOfTheDay',
        schema: MCQOfTheDaySchema,
      },
    ]),
    SharedApiModule,
    AuthModule,
  ],
  controllers: [MCQOfTheDayController],
})
export class MCQOfTheDayModule {}
