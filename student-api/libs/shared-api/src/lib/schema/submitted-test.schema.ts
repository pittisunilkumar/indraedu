import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

import type { EntityInterface, EntityStatusEnumForTestSeries, TestAnswerInterface, UserKeyInterface, UserTestStatsInterface } from '@application/api-interfaces';
import { Course, TSCategories, User, Syllabus } from '@application/shared-api';

@Schema()
export class SubmittedTest extends Document {

  @Prop({ required: true })
  uuid: string;

  @Prop({ required: false })
  count: number;

  @Prop({ required: false })
  rank: number;

  @Prop({ required: false })
  totalUsers: number;

  // @Prop({ required: true, type: Object })
  // user: UserKeyInterface;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  userId: string;

  @Prop({ required: true })
  status: number;

  @Prop({ required: false })

  lastAttemptedQuestion: number;

  @Prop({ required: true, type: Object })
  categoryUuid: string;
  // @Prop({ required: true, type: Object })
  // course: EntityInterface;
  @Prop({ required: true,type: mongoose.Schema.Types.ObjectId })
  courseId: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  subjectId: string;

  @Prop({ required: false, type: Object })
  users:any;

  // @Prop({ required: true, type: Object })
  // test: EntityInterface;
  @Prop({ required: true, type: Object })
  testSeriesUuid: string;

  @Prop({ required: true, type: Array })
  answers: TestAnswerInterface[];

  @Prop({ required: false, type: Object })
  stats: UserTestStatsInterface;

  @Prop({ required: true })
  submittedOn: Date;z

}

export const SubmittedTestSchema = SchemaFactory.createForClass(SubmittedTest);
SubmittedTestSchema.set('validateBeforeSave', true);
