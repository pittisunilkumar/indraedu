import {
  KeyInterface,
  SyllabusFlagsInterface, UserKeyInterface,
} from '@application/api-interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';
import { CourseSchema } from './course.schema';

@Schema()
export class Syllabus extends mongoose.Document {

  @Prop({ required: true })
  uuid: string;

  @Prop()
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  shortcut: string;

  @Prop({ required: true })
  order: number;

  @Prop({ required: false })
  totalVideos?: number;

  @Prop({
    required: true,
    type: String,
    enum: ['SUBJECT', 'CHAPTER', 'TOPIC', 'SUBTOPIC'],
  })
  type: string;

  @Prop({ required: false })
  imgUrlVideos: string;

  @Prop()
  imgUrlQbank?: string;

  @Prop()
  suggestedBanner?: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: Syllabus.name }])
  parents?: string[];

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: Syllabus.name }])
  children?: string[];

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
  @ApiProperty({
    example: { uuid: '0ba7596e-5087-4c72-887d-aaa730cdac23', name: 'Krishna' },
    description: 'UUID & Name of the user created it'
  })
  createdBy: UserKeyInterface;

  @Prop({ type: Object })
  @ApiProperty({
    example: { uuid: '0ba7596e-5087-4c72-887d-aaa730cdac23', name: 'Krishna' },
    description: 'UUID & Name of the user modified it'
  })
  modifiedBy: UserKeyInterface;

  @Prop({ required: true, type: Object })
  flags: SyllabusFlagsInterface;
}

export const SyllabusSchema = SchemaFactory.createForClass(Syllabus);
SyllabusSchema.set('validateBeforeSave', true);
