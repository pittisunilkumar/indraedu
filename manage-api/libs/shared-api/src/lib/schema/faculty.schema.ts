import {
  BankInterface,
  FlagsInterface,
  KeyInterface,
  UserKeyInterface,
  AgentsFlagsInterface
} from '@application/api-interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Course } from './course.schema';
import { Syllabus } from './syllabus.schema';

@Schema()
export class Faculty extends mongoose.Document {
  @Prop({ required: true })
  uuid: string;

  @Prop()
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  mobile: number;

  @Prop({ required: true })
  password: string;

  @Prop({ required: false })
  accessToken: string;

  @Prop({
    required: true,
    type: String,
    enum: ['MALE', 'FEMALE', 'OTHER'],
  })
  gender: string;

  @Prop({ required: false })
  designation: string;

  @Prop({ required: true })
  specialization: string;

  /*@Prop([{ type: mongoose.Schema.Types.ObjectId, ref: Course.name }])
  courses: KeyInterface[];

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: Syllabus.name }])
  syllabus: KeyInterface[];*/
  
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Course.name })
  courses: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Syllabus.name })
  syllabus: string;

  @Prop({ required: false })
  imgUrl: string;

  @Prop({ required: true, type: Object })
  bank: BankInterface;

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
  flags: AgentsFlagsInterface;
}

const CourseSchema = SchemaFactory.createForClass(Course);
export const FacultySchema = SchemaFactory.createForClass(Faculty);
const SyllabusSchema = SchemaFactory.createForClass(Syllabus);
FacultySchema.set('validateBeforeSave', true);
