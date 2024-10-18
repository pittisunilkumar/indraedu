import {
  AvailedByInterface,
  CouponFlagsInterface,
  UserKeyInterface,
} from '@application/api-interfaces';
import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from './user.schema';
import { Faculty } from './faculty.schema';
import { Subscription } from './subscription.schema';

@Schema()
export class Coupon extends Document {
  @Prop({ required: true })
  uuid: string;

  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  discountType: string;

  @Prop({ required: true })
  discount: number;

  @Prop({ required: true })
  totalCoupons: number; 
  
  @Prop({ required: true })
  availableCoupons: number;

  @Prop({
    required: true,
    // type: String,
  })
  valiedFrom?: Date;

  @Prop({
    required: true,
    // type: String,
  })
  valiedTo?: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Subscription.name })
  subscription: string;

  @Prop({ required: false })
  couponType: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: User.name }])
  users: string[];
  

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Faculty.name })
  agent: string;

  @Prop({ required: false })
  agentCommission: number;

  @Prop({ required: false })
  agentAmount: number;

  @Prop({ required: false })
  agentTotalAmount: number;

  @Prop({ required: false })
  agentDueAmount: number;

  @Prop({ required: false })
  appliedUsersCount:number

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
  flags: CouponFlagsInterface;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);
CouponSchema.set('validateBeforeSave', true);
