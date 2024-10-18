import type{ SyllabusInterface, UserKeyInterface } from '@application/api-interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

import type {
  QuestionAnswerInterface,
  QuestionFlagsInterface,
  QuestionOptionsInterface,
  matchLeftOptionsInterface,
  matchRightOptionsInterface
} from '@application/api-interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { Syllabus } from './syllabus.schema';
// import { QBankSubject } from './qbank-subject.schema';

@Schema()
export class Question extends mongoose.Document {

  @Prop({ required: true })
  uuid: string;

  @Prop()
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  questionId: string;

  @Prop({
    required: false,
  })
  descriptionImgUrl?: string;

  @Prop({
    required: true,
  })
  mathType?: string;

  @Prop({
    required: true,
    type: String,
    enum: ['MULTIPLE', 'SINGLE', 'ESSAY', 'FIB', 'IMG','FILL_IN_THE_BLANK','TRUE_OR_FALSE','MATCH_THE_FOLLOWING'],
  })
  type: string;

  @Prop({
    required: false,
  })
  options?: QuestionOptionsInterface[];

  @Prop({
    required: false,
  })
  matchLeftSideOptions?: matchLeftOptionsInterface[];

  @Prop({
    required: false,
  })
  matchRightSideOptions?: matchRightOptionsInterface[];

  @Prop({
    required: false,
  })
  imgUrl?: string;

  @Prop({
    required: false,
  })
  previousAppearances: string;

  // @Prop({ type: mongoose.Schema.Types.ObjectId,required: false })
  // tags: any;

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

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: Syllabus.name }])
  syllabus: string[];

  // @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: QBankSubject.name }])
  // Syllabus: string[];

  @Prop({ required: false, type: Object })
  answer: QuestionAnswerInterface;

  @Prop({ required:false, type: Array })
  matchAnswer: [];

  @Prop({ required: true })
  description: string;

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
  flags: QuestionFlagsInterface;

}

export const QuestionSchema = SchemaFactory.createForClass(Question);
QuestionSchema.set('validateBeforeSave', true);
