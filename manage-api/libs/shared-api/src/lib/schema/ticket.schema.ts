import {
    UserKeyInterface,
} from '@application/api-interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { ObjectID } from 'mongodb';
import * as mongoose from 'mongoose';
import { Department } from './department.schema';
import { Employee } from './employee.schema';
import { User } from './user.schema';
import { Course } from './course.schema';

@Schema()
export class Ticket extends mongoose.Document {

    @Prop({ required: true })
    uuid: string;

    @Prop()
    id: string;

    @Prop({ required: true })
    ticketId: string;

    @Prop({ required: true })
    message: string;

    @Prop({ required: true,type: mongoose.Schema.Types.ObjectId, ref: User.name  })
    user: string;

    @Prop({ required: true,type: mongoose.Schema.Types.ObjectId, ref: Department.name  })
    @ApiProperty({
        example: '3457596efdfdfd',
        description: 'department'
      })
      department: string;
    

    @Prop({ required: false,type: mongoose.Schema.Types.ObjectId, ref: Employee.name  })
    assignee: string;

    @Prop({ required: false,type: mongoose.Schema.Types.ObjectId, ref: Course.name  })
    courses: any;

    @Prop({
        required: false,
        type: Date,
    })
    createdOn?: Date;

    @Prop({
        required: false,
        type: Date,
    })
    lastUpdated?: Date;
    
    @Prop({
        required: false,
        type: Date,
    })
    closedDateTime?: Date;

    @Prop({
        required: false,
        type: Date,
    })
    modifiedOn?: Date;

    @Prop({ type: Object })
    modifiedBy: UserKeyInterface;

    @Prop({ required: true, type : Number})
    status: Number;

    @Prop({ required: true, type: String})
    priority: {
        type: String,
        enum : ['high','medium','low'],
        default: 'low'
    };
    
    @Prop({ required: true, type : Number})
    type: Number;
    
    // @Prop({ required: false })
    // reply_message: string;

    @Prop({ required: false })
    @ApiProperty({ example: 'image Path', description: 'image Path' })
    reply: [];

    @Prop({ required: false })
    @ApiProperty({ example: 'image Path', description: 'image Path' })
    image: [];

    @Prop({ required: false })
    @ApiProperty({ example: 'image Path', description: 'image Path' })
    audio: [];
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
TicketSchema.set('validateBeforeSave', true);
