import {
  KeyInterface,
  UserKeyInterface,
} from '@application/api-interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

import type{
  AddressInterface,
  BranchInterface,
  OrganizationEntitlementsInterface,
  OrganizationFlagsInterface,
} from '@application/api-interfaces';
import { ApiProperty } from '@nestjs/swagger';
@Schema()
export class Organization extends mongoose.Document {
  @Prop({ required: true })
  uuid: string;

  @Prop()
  id: string;

  @Prop({ required: true })
  title: string;

  // @Prop({ required: true })
  // type: string;

  // @Prop({ required: false })
  // imgUrl: string;

  // @Prop()
  // entitlements?: OrganizationEntitlementsInterface;

  @Prop({type:Object})
  address: AddressInterface;

  // @Prop({ required: false })
  // phone: string;

  @Prop({ required: false })
  mobile: number;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  firebase: string;

  @Prop({ required: true })
  workingkey: string;

  @Prop({ required: false })
  senderId: string;


  @Prop({ required: true })
  razorpayKey: string;

  @Prop({ required: true })
  razorpaySecret: string;

  // @Prop()
  // branches: BranchInterface[];

  // @Prop()
  // subscriptions: KeyInterface[];

  // @Prop()
  // courses: KeyInterface[];

  // @Prop()
  // users: KeyInterface[];

  @Prop({
    required: false,
    type: String,
  })
  createdOn?: String;

  @Prop({
    required: false,
    type: String,
  })
  modifiedOn?: String;

  @Prop({ required: false, type: Object })
  @ApiProperty({
    example: { uuid: '0ba7596e-5087-4c72-887d-aaa730cdac23', name: 'Krishna' },
    description: 'UUID & Name of the user created it'
  })
  createdBy: any;

  @Prop({ required: false, type: Object })
  @ApiProperty({
    example: { uuid: '0ba7596e-5087-4c72-887d-aaa730cdac23', name: 'Krishna' },
    description: 'UUID & Name of the user modified it'
  })
  modifiedBy: any;

  @Prop({ required: true, type: Object })
  flags: any;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
OrganizationSchema.set('validateBeforeSave', true);
