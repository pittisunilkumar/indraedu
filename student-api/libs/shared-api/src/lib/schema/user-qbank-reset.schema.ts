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
export class UserQbankReset extends mongoose.Document {

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  @ApiProperty({ example: '5fa90d866rttry3001021fd', description: 'Object ID' })
  userId: string;

  @Prop({ required: true, type: Object })
  qbankTopicUuid: string;

  @Prop({ required: true })
  count: number;

}

export const UserQbankResetSchema = SchemaFactory.createForClass(UserQbankReset);
UserQbankResetSchema.set('validateBeforeSave', true);
