import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { EntityInterface, TestAnswerInterface, UserKeyInterface, UserTestStatsInterface } from '@application/api-interfaces';

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

  @Prop({ required: true, type: Object })
  user: UserKeyInterface;

  @Prop({ required: true, type: Object })
  category: EntityInterface;

  @Prop({ required: true, type: Object })
  course: EntityInterface;

  @Prop({ required: true, type: Object })
  test: EntityInterface;

  @Prop({ required: true, type: Array })
  answers: TestAnswerInterface[];

  @Prop({ required: false, type: Object })
  stats: UserTestStatsInterface;

  @Prop({ required: true })
  submittedOn: Date;

}

export const SubmittedTestSchema = SchemaFactory.createForClass(SubmittedTest);
SubmittedTestSchema.set('validateBeforeSave', true);
