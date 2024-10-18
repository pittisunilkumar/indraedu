import {
  CouponInterface,
  FlagsInterface, UserKeyInterface,
} from '@application/api-interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';
import { Course } from './course.schema';
import { QBankSubject } from './qbank-subject.schema';
import { QBank } from './qbank.schema';
import { Test } from './test.schema';
import { VideoSubject } from './video-subject.schema';
import { Video } from './video.schema';

@Schema()
export class Subscription extends mongoose.Document {

  @Prop({ required: true })
  uuid: string;

  @Prop()
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: false })
  description: string;

  @Prop({ required: true })
  order: number;

  @Prop({ required: false })
  periodType: string;

  @Prop({ required: false })
  period: number;

  @Prop({ required: true })
  actual: number;

  @Prop({ required: true })
  originalPrice: number;

  @Prop({ required: true })
  count: number;

  // @Prop({ required: true })
  // discounted: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Course.name })
  courses: string;

  // @Prop({ required: true})
  // courses: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: Test.name }])
  tests: string[];

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: QBankSubject.name }])
  qbanks: string[];

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: VideoSubject.name }])
  videos: string[];

  //   @Prop({ type: Object })
  //   coupon: CouponInterface;
  //  @Prop({ required: false })
  //   @Prop({ type: mongoose.Schema.Types.ObjectId })
  //   coupons: string;

  @Prop({
    required: false,
  })
  validFrom: Date;

  @Prop({
    required: false,
  })
  validTo: Date;

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
  @ApiProperty({
    example: { uuid: '0ba7596e-5087-4c72-887d-aaa730cdac23', name: 'Krishna' },
    description: 'UUID & Name of the user created it'
  })
  createdBy: UserKeyInterface;

  @Prop({ type: Object })
  @ApiProperty({
    example: { uuid: '0ba7596e-5087-4c72-887d-aaa730cdac23', name: 'Krishna' },
    description: 'UUID & Name of the user modified it'
  })
  modifiedBy: UserKeyInterface;

  @Prop({ required: true, type: Object })
  flags: FlagsInterface;

}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
SubscriptionSchema.set('validateBeforeSave', true);