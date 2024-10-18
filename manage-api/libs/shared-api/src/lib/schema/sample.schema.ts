import {
  CourseInterface,
  FlagsInterface,
  KeyInterface,
  UserKeyInterface,
} from '@application/api-interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';
import { Course } from './course.schema';

@Schema()
export class Sample extends mongoose.Document {

  @Prop({ required: true })
  @ApiProperty({ example: '0ba7596e-5087-4c72-887d-aaa730cdac23', description: 'Unique Identifier' })
  uuid: string;

  @Prop()
  @ApiProperty({ example: '5fa90d866rttry3001021fd', description: 'Object ID' })
  id: string;

  @Prop({ required: true })
  @ApiProperty({ example: 'New Banner', description: 'Banner Title' })
  title: string;
}

export const SampleSchema = SchemaFactory.createForClass(Sample);
SampleSchema.set('validateBeforeSave', true);
