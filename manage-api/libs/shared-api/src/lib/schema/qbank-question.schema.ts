import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import {
  QuestionFlagsInterface,
  QuestionOptionsInterface,
} from '@application/api-interfaces';

@Schema()
export class QBankQuestion extends Document {

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

export const QBankQuestionSchema = SchemaFactory.createForClass(QBankQuestion);
QBankQuestionSchema.set('validateBeforeSave', true);
