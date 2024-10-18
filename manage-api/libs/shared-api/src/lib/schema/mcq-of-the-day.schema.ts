import { FlagsInterface, UserKeyInterface } from '@application/api-interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';
import { Course } from './course.schema';
import { Syllabus } from './syllabus.schema';
import { Question } from './questions.schema';


@Schema()
export class MCQOfTheDay extends mongoose.Document {

    @Prop()
    id: string;

    @Prop({required: true,type: mongoose.Schema.Types.ObjectId, ref: Course.name })
    courseId: string;

    @Prop({required: true,type: mongoose.Schema.Types.ObjectId, ref: Syllabus.name })
    subjectId: string;

    @Prop({required: true,type: mongoose.Schema.Types.ObjectId, ref: Question.name })
    questionId: string;

    @Prop({required: true })
    status: boolean;

    @Prop({required: false,type: Date})
    createdOn?: Date;

    @Prop({required: false,type: Date})
    modifiedOn?: Date;

    @Prop({ required: false, type: Object })
    createdBy: UserKeyInterface;

    @Prop({required: false, type: Object })
    modifiedBy: UserKeyInterface;

}

export const MCQOfTheDaySchema = SchemaFactory.createForClass(MCQOfTheDay);
MCQOfTheDaySchema.set('validateBeforeSave', true);

