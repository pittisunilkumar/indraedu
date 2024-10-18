import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import type {
  QuestionFlagsInterface,
  QuestionOptionsInterface,
} from '@application/api-interfaces';

@Schema()
export class TestQuestion extends Document {

  @Prop({ required: true })
  uuid: string;

  @Prop()
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  options?: QuestionOptionsInterface[];

  @Prop({
    required: false,
  })
  imgUrl?: string;

  @Prop({
    required: false,
    type: String,
  })
  createdOn?: String;

  @Prop({
    required: false,
    type: String,
  })
  modifiedOn?: String;

  @Prop({ required: true })
  order?: Number;

  @Prop({ required: true })
  positive?: Number;

  @Prop({ required: true })
  negative?: Number;

  @Prop({ required: true, type: Object })
  flags: QuestionFlagsInterface;

}

export const TestQuestionSchema = SchemaFactory.createForClass(TestQuestion);
TestQuestionSchema.set('validateBeforeSave', true);
