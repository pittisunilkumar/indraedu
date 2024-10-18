import {
    UserKeyInterface,
} from '@application/api-interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Employee } from './employee.schema';

@Schema()
export class Department extends mongoose.Document {

    @Prop({ required: true })
    uuid: string;

    @Prop()
    id: string;

    @Prop({ required: true })
    title: string;

    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: Employee.name }])
    employee: string[];

    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: Employee.name }])
    hod: string;

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

export const DepartmentSchema = SchemaFactory.createForClass(Department);
DepartmentSchema.set('validateBeforeSave', true);
