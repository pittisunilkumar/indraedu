import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Syllabus } from './syllabus.schema';

@Schema()
export class PearlBookMarks extends mongoose.Document {

    @Prop()
    id: string;

    @Prop({ required: true })
    uuid: string;

    @Prop({ required: true })
    userUuid: string;

    @Prop({required: true,type: mongoose.Schema.Types.ObjectId, ref: Syllabus.name })
    subjectId: string;

    @Prop({ required: true })
    pearlIds: []
   

    @Prop({required: false,type: Date})
    createdOn?: Date;

    @Prop({required: false,type: Date})
    modifiedOn?: Date;

}

export const PearlBookMarksSchema = SchemaFactory.createForClass(PearlBookMarks);
PearlBookMarksSchema.set('validateBeforeSave', true);