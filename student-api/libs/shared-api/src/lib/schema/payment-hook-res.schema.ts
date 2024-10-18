import type { objectInterface } from '@application/api-interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';


@Schema()
export class PaymentHookResponse extends mongoose.Document {


    @Prop({required: true})
    activated?: boolean;

    @Prop({required: true, type: Object })
    body: objectInterface;

    @Prop({required: false,type: Date})
    createdOn?: Date;

    @Prop({required: false,type: Date})
    activatedOn?: Date;
}

export const PaymentHookResponseSchema = SchemaFactory.createForClass(PaymentHookResponse);
PaymentHookResponseSchema.set('validateBeforeSave', true);