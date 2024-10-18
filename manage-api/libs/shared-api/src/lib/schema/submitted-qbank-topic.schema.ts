import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import type { EntityInterface, QBankTopicAnswerInterface, UserKeyInterface, UserQBankTopicStatsInterface } from '@application/api-interfaces';
import { Course } from './course.schema';
import { QBankSubject } from './qbank-subject.schema';
import { User } from './user.schema';

@Schema()
export class SubmittedQBankTopic extends Document {

  @Prop({ required: true })
  uuid: string;

  @Prop({ required: false })
  count: number;

  @Prop({ required: false })
  rank: number;

  @Prop({ required: false })
  totalUsers: number;

  @Prop({ required: false })
  lastAttemptedQuestion: number;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: User.name })
  userId: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: QBankSubject.name })
  subjectId: string;

  @Prop({ required: true,type: mongoose.Schema.Types.ObjectId, ref: Course.name })
  courseId: string;

  @Prop({ required: true, type: Object })
  qbankTopicUuid: string;

  @Prop({ required: true, type: Array })
  answers: QBankTopicAnswerInterface[];

  @Prop({ required: false, type: Object })
  stats: UserQBankTopicStatsInterface;

  @Prop({ required: true })
  submittedOn: Date;

  @Prop({ required: true })
  status: number;
}

export const SubmittedQBankTopicSchema = SchemaFactory.createForClass(SubmittedQBankTopic);
SubmittedQBankTopicSchema.set('validateBeforeSave', true);
