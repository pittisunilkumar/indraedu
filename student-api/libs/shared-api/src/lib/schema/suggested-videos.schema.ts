import type{ FlagsInterface, UserKeyInterface } from '@application/api-interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';
import { Course } from './course.schema';
import { Syllabus } from './syllabus.schema';
import { Video } from './video.schema';


@Schema()
export class SuggestedVideos extends mongoose.Document {

    @Prop()
    id: string;

    // @Prop({ required: true })
    // uuid: string;

    @Prop({required: true,type: mongoose.Schema.Types.ObjectId, ref: Course.name })
    courseId: string;

    @Prop({required: true,type: mongoose.Schema.Types.ObjectId, ref: Syllabus.name })
    subjectId: string;

    @Prop({required: true,type: mongoose.Schema.Types.ObjectId, ref: Syllabus.name })
    chapterId: string;

    @Prop({required: true })
    videoUuid: string;

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

export const SuggestedVideosSchema = SchemaFactory.createForClass(SuggestedVideos);
SuggestedVideosSchema.set('validateBeforeSave', true);
