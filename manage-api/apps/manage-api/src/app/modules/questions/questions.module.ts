import { AuthModule } from '@application/auth';
import { QuestionSchema, SharedApiModule } from '@application/shared-api';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestionsController } from './questions.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Question',
        schema: QuestionSchema,
      }
    ]),
    SharedApiModule,
    AuthModule
  ],
  controllers: [QuestionsController],
})
export class QuestionsModule {}
