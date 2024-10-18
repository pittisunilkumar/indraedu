import { FlagsInterface, QBankFlagsInterface, OwnPaperInterface, UserKeyInterface } from '@application/api-interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';
import { Course } from './course.schema';
import { Syllabus } from './syllabus.schema';


@Schema()
export class OwnPaper extends mongoose.Document {

    @Prop({ required: true })
    userUuid: string;

    @Prop({ required: true})
    exam: OwnPaperInterface[];

    

}

export const OwnPaperSchema = SchemaFactory.createForClass(OwnPaper);
OwnPaperSchema.set('validateBeforeSave', true);
