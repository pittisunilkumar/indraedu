import type{ SyllabusInterface, UserKeyInterface } from '@application/api-interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Question } from './questions.schema';
import * as mongoose from 'mongoose';
import { Syllabus } from './syllabus.schema';
import { Pearls } from './pearls.schema'

import {
    
    FlagsInterface,
   
    
    PeralInputSubjectInterface,

  } from '@application/api-interfaces';
  import { ApiProperty } from '@nestjs/swagger';

  @Schema()
export class PearlSubjects extends mongoose.Document {

    @Prop()
    id: string;

    @Prop({ required: true })
    uuid: string;

    @Prop({ required: true })
    qUuid: string;

    @Prop({required: true,type: mongoose.Schema.Types.ObjectId, ref: Syllabus.name })
    subjectId: string;

    @Prop([{
      chapterId: {required: true,type: mongoose.Schema.Types.ObjectId, ref: Syllabus.name },
     // pearlIds: [{required: true,type: mongoose.Schema.Types.ObjectId, ref: Pearls.name }],
      pearlIds: [],

    }])
   
    chapter: PeralInputSubjectInterface[];

    @Prop({required: false,type: Date})
    createdOn?: Date;

    @Prop({required: false,type: Date})
    modifiedOn?: Date;

    @Prop({ required: false, type: Object })
    createdBy: UserKeyInterface;

    @Prop({required: false, type: Object })
    modifiedBy: UserKeyInterface;
}

export const PearlSubjectsSchema = SchemaFactory.createForClass(PearlSubjects);
PearlSubjectsSchema.set('validateBeforeSave', true);