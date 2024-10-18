import { CourseFlagsInterface, KeyInterface, UserKeyInterface } from '@application/api-interfaces';
import { Organization } from '@application/shared-api';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Syllabus } from './syllabus.schema';
import { User } from './user.schema';

@Schema()
export class Course extends mongoose.Document {

  @Prop({ required: true })
  uuid: string;

  @Prop()
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: false })
  imgUrl: string;

  @Prop({ required: true })
  order: number;

  // @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: User.name }])
  // users: string[];

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: Syllabus.name }])
  syllabus: string[];

  @Prop([{ type: mongoose.Schema.Types.ObjectId }])
  organizations: string[];

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
  flags: CourseFlagsInterface;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
CourseSchema.set('validateBeforeSave', true);
