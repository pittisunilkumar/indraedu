import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

import type{ TestFlagsInterface, TestQuestionInterface, UserKeyInterface } from '@application/api-interfaces';
import { Course } from './course.schema';
import { Syllabus } from './syllabus.schema';
import { TSCategories } from './ts-categories.schema';

@Schema()
export class Test extends Document {

  @Prop({ required: true })
  uuid: string;

  @Prop()
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  imgUrl: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: Course.name }])
  courses: string[];

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: TSCategories.name }])
  categories: any;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: Syllabus.name }])
  subjects: string[];

  @Prop({ required: true })
  order: number;

  @Prop({ required: true })
  time: string;

  @Prop({ required: true })
  scheduledDate: Date;

  @Prop({ required: true })
  expiryDate: Date;

  @Prop({ required: true })
  pdf: string;

  @Prop({ required: true })
  count: number;

  @Prop({
    required: false,
    type: String,
    enum: ['PAUSED', 'SUBMITTED', 'YET_TO_START'],
  })
  status: string;

  @Prop({ required: false })
  startedAt: Date;

  @Prop({ required: false })
  stoppedAt: Date;

  @Prop({ required: true })
  questions: TestQuestionInterface[];

  @Prop({
    required: false,
    type: String,
  })
  createdOn?: Date;

  @Prop({
    required: false,
    type: String,
  })
  modifiedOn?: Date;

  @Prop({ required: true, type: Object })
  createdBy: UserKeyInterface;

  @Prop({ type: Object })
  modifiedBy: UserKeyInterface;

  @Prop({ required: true, type: Object })
  flags: TestFlagsInterface;

}

export const TestSchema = SchemaFactory.createForClass(Test);
TestSchema.set('validateBeforeSave', true);
