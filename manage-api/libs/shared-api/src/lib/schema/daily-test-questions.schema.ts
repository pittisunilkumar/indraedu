import { FlagsInterface, UserKeyInterface,objectInterface } from '@application/api-interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';
import { Course } from './course.schema';
import { Syllabus } from './syllabus.schema';
import { TSCategories } from './ts-categories.schema';


@Schema()
export class DailyTestQuestions extends mongoose.Document {

    @Prop({required: true,type: mongoose.Schema.Types.ObjectId, ref: Course.name })
    courseId: string;

    @Prop({required: true})
    questionIds: string[];

    @Prop({required: false,type: Date})
    createdOn?: Date;

    @Prop({required: false,type: Date})
    modifiedOn?: Date;

    @Prop({ required: false, type: Object })
    createdBy: UserKeyInterface;

    @Prop({required: false, type: Object })
    modifiedBy: UserKeyInterface;


}

export const DailyTestQuestionsSchema = SchemaFactory.createForClass(DailyTestQuestions);
DailyTestQuestionsSchema.set('validateBeforeSave', true);