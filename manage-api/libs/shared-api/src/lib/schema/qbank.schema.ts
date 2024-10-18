import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

import { QBankFlagsInterface, QBankSubjectInterface, TestFlagsInterface, TestQuestionInterface, UserKeyInterface } from '@application/api-interfaces';
import { Course } from './course.schema';
import { Syllabus } from './syllabus.schema';

@Schema()
export class QBank extends Document {

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

  @Prop({ required: false })
  iconUrl: string;

  @Prop({ type: Object, required: true })
  readonly subject: QBankSubjectInterface;

  @Prop({ type: Object, required: true })
  chapter: { title: string; uuid: string; };

  @Prop({ required: true })
  order: number;

  @Prop({ required: true })
  scheduledDate: Date;

  @Prop({ required: true })
  pdf: string;

  @Prop({ required: true })
  count: number;

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
  flags: QBankFlagsInterface;

}

export const QBankSchema = SchemaFactory.createForClass(QBank);
QBankSchema.set('validateBeforeSave', true);
