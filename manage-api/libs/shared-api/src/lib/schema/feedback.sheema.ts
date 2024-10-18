import {
    feedbackUsersRatingInterface,
    UserKeyInterface,
} from '@application/api-interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Course } from './course.schema';
import { Employee } from './employee.schema';
import { User } from './user.schema';

@Schema()
export class Feedbacks extends mongoose.Document {

    @Prop({ required: true })
    uuid: string;

    @Prop()
    id: string;

    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    feedback_type: string;

    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: Course.name }])
    course: string[];

    // @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: User.name }])
    // users: string[];

    @Prop([{
        user_id: { required: false, type: mongoose.Schema.Types.ObjectId, ref: User.name },
        rating: {type:Number, required: false },
        createdOn: { type: Date, required: false },
        message:{required:false}
    }])
    replies: feedbackUsersRatingInterface[];

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
    createdBy: UserKeyInterface;

    @Prop({ type: Object })
    modifiedBy: UserKeyInterface;

    @Prop({ required: true, type: Object })
    flags: any;
}

export const FeedbackSheema = SchemaFactory.createForClass(Feedbacks);
FeedbackSheema.set('validateBeforeSave', true);
