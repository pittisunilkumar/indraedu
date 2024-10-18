import type {
    FlagsInterface,
    ModeOfPaymentEnum,
    PaymentStatusEnum,
    UserKeyInterface,
  } from '@application/api-interfaces';
import { User,Subscription, Coupon } from '@application/shared-api';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';

  @Schema()
export class DisableUserForTestSubmit extends mongoose.Document {

  @Prop({ required: true })
    uuid: string;

    @Prop()
    id: string;

    @Prop({ required: true })
    mobile: string;

    @Prop({ required: true })
    status: boolean;

    @Prop({ required: true })
    subscription: boolean;

    @Prop({ required: true })
    submission: boolean;

    @Prop({ required: true })
    showInActiveCourses: boolean;

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

}

export const DisableUserForTestSubmitSchema = SchemaFactory.createForClass(DisableUserForTestSubmit);
DisableUserForTestSubmitSchema.set('validateBeforeSave', true);
