import { SyllabusInterface, UserKeyInterface } from '@application/api-interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import {
  QuestionAnswerInterface,
  QuestionFlagsInterface,
  QuestionOptionsInterface,
} from '@application/api-interfaces';
import { ApiProperty } from '@nestjs/swagger';


@Schema()
export class Question extends Document {
  @Prop({ required: true })
  uuid: string;

  @Prop()
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop({
    required: true,
    type: String,
    enum: ['MULTIPLE', 'SINGLE', 'ESSAY', 'FIB', 'IMG'],
  })
  type: string;

  @Prop()
  options?: QuestionOptionsInterface[];

  @Prop({
    required: false,
  })
  imgUrl?: string;

  @Prop({
    required: false,
  })
  previousAppearances: string;

  @Prop({
    required: false,
  })
  tags: string;

  @Prop({
    required: true,
    type: String,
    enum: ['EASY', 'MEDIUM', 'HARD'],
  })
  difficulty: string;

  @Prop()
  syllabus?: SyllabusInterface[];

  @Prop()
  answer: QuestionAnswerInterface;

  @Prop({ required: true })
  description: string;

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

  @Prop()
  @ApiProperty({
    example: { uuid: '0ba7596e-5087-4c72-887d-aaa730cdac23', name: 'Krishna' },
    description: 'UUID & Name of the user created it'
  })
  createdBy: UserKeyInterface;

  @Prop()
  @ApiProperty({
    example: { uuid: '0ba7596e-5087-4c72-887d-aaa730cdac23', name: 'Krishna' },
    description: 'UUID & Name of the user modified it'
  })
  modifiedBy: UserKeyInterface;

  @Prop()
  flags: QuestionFlagsInterface;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
QuestionSchema.set('validateBeforeSave', true);
