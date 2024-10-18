import type { CourseFlagsInterface, KeyInterface, UserKeyInterface } from '@application/api-interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Organization } from './organization.schema';
import { Syllabus } from './syllabus.schema';
import { User } from './user.schema';

@Schema()
export class SmsTemplates extends mongoose.Document {

  @Prop({ required: true })
  uuid: string;

  @Prop()
  id: string;
  
  @Prop({ required: true })
  key: string;

  @Prop({ required: true })
  template: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Organization.name })
  organization: Organization;

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

  @Prop({ required: true })
  active: boolean;
}

export const SmsTemplatesSchema = SchemaFactory.createForClass(SmsTemplates);
SmsTemplatesSchema.set('validateBeforeSave', true);
