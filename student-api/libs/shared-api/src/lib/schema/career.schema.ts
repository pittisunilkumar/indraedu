import type {
  CareersFlagsInterface,
  SkillsInterface,
  UserKeyInterface,
} from '@application/api-interfaces';
import { DepartmentENum } from '@application/api-interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema()
export class Career extends mongoose.Document {

  @Prop({ required: true })
  uuid: string;

  @Prop()
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  designation: string;

  @Prop({
    required: true,
    type: String,
    enum: DepartmentENum,
  })
  department: string;

  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  readonly qualifications: string[];

  @Prop({ required: true })
  readonly requirements: string[];

  @Prop({ required: true, type: Object })
  readonly skills: SkillsInterface;

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
  flags: CareersFlagsInterface;

}

export const CareersSchema = SchemaFactory.createForClass(Career);
CareersSchema.set('validateBeforeSave', true);
