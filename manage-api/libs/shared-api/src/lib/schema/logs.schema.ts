import { FlagsInterface, UserKeyInterface,objectInterface } from '@application/api-interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';
import { Course } from './course.schema';
import { Syllabus } from './syllabus.schema';
import { TSCategories } from './ts-categories.schema';


@Schema()
export class Logs extends mongoose.Document {

    @Prop({required: true })
    moduleName: string;

    @Prop({required: true})
    collectionName: string;

    @Prop({required: true, type: Object })
    request: objectInterface;

    @Prop({required: true,type: mongoose.Schema.Types.ObjectId })
    documentId: string;

    @Prop({required: false,type: Date})
    createdOn?: Date;

    @Prop({required: false,type: Date})
    modifiedOn?: Date;

    @Prop({ required: false, type: Object })
    createdBy: UserKeyInterface;

    @Prop({required: false, type: Object })
    modifiedBy: UserKeyInterface;


}

export const LogsSchema = SchemaFactory.createForClass(Logs);
LogsSchema.set('validateBeforeSave', true);