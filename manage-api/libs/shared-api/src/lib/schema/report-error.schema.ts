import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { EntityInterface, UserKeyInterface } from '@application/api-interfaces';

@Schema()
export class ReportError extends Document {

  @Prop({ required: true })
  uuid: string;

  @Prop({ required: true, type: Object })
  user: UserKeyInterface;

  @Prop({ required: true, type: Object })
  question: EntityInterface;

  @Prop({ required: true, type: Object })
  course: EntityInterface;

  @Prop({ required: true, type: Object })
  test: EntityInterface;

  @Prop({ required: true, type: Object })
  subject: EntityInterface;

  @Prop({ required: true, type: Array })
  report: string[];

  @Prop({ required: true })
  submittedOn: Date;

}

export const ReportErrorSchema = SchemaFactory.createForClass(ReportError);
ReportErrorSchema.set('validateBeforeSave', true);
