import { Subscription, User } from '@application/shared-api';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';
import { Course } from './course.schema';

@Schema()
export class Notifications extends mongoose.Document {

  @Prop({ required: true })
  @ApiProperty({ example: '0ba7596e-5087-4c72-887d-aaa730cdac23', description: 'Unique Identifier' })
  uuid: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId }])
  users?: string[];

  @Prop([{ type: mongoose.Schema.Types.ObjectId }])
  subscriptions?: string[];

  // @Prop({required: false, type: mongoose.Schema.Types.ObjectId })
  // courses?: string;
  @Prop([{required: false,type: mongoose.Schema.Types.ObjectId, ref: Course.name }])
  courses: string[];

  @Prop({ required: true })
  @ApiProperty({ example: 'Plato', description: 'Title' })
  title: string;

  @Prop({ required: true })
  @ApiProperty({ example: 'Message', description: 'User Message' })
  message: string;

  @Prop({ required: false })
  @ApiProperty({ example: 'image Path', description: 'image Path' })
  icon: string;

  @Prop({ required: false })
  @ApiProperty({ example: 'branchUrl', description: 'branchUrl' })
  branchUrl: string;

  @Prop({ required: true })
  @ApiProperty({ example: 'user@platononline.com', description: 'User Email' })
  notificationType: string;
  @Prop({
    required: false,
    type: Date,
  })
  @ApiProperty({ example: '2020-11-09T19:53:53.032Z', description: 'Created On' })
  scheduleDate?: Date;

  @Prop({
    required: true,
    type: Number,
  })
  @ApiProperty({ example: '2020-11-09T19:53:53.032Z', description: 'Created On' })
  sendStatus : Number;

  @Prop({ required: false })
  @ApiProperty({ example: 'Campaign', description: 'Campaign' })
  campaign: string;

  @Prop({
    required: false,
    type: String,
  })
  @ApiProperty({ example: '2020-11-09T19:53:53.032Z', description: 'Created On' })
  createdOn?: any;

  @Prop({ required: false, type: Object })
  @ApiProperty({
    example: { uuid: '0ba7596e-5087-4c72-887d-aaa730cdac23', name: 'Krishna' },
    description: 'UUID & Name of the user created it'
  })
  createdBy: any;

}

export const NotificationsSchema = SchemaFactory.createForClass(Notifications);
NotificationsSchema.set('validateBeforeSave', true);
