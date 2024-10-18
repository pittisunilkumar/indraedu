import { Subscription, User } from '@application/shared-api';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';

@Schema()
export class UserNotifications extends mongoose.Document {

  @Prop({ required: true })
  @ApiProperty({ example: '0ba7596e-5087-4c72-887d-aaa730cdac23', description: 'Unique Identifier' })
  uuid: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  userId?: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  notificationId?: string;

  @Prop({ required: true })
  @ApiProperty({ example: '2020-11-09T19:53:53.032Z', description: 'Created On' })
  createdOn?: Date;

  @Prop({ required: false })
  @ApiProperty({ example: '2020-11-09T19:53:53.032Z', description: 'Read On' })
  readDate?: Date;

  @Prop({ required: true })
  readStatus: number;
  
}

export const UserNotificationsSchema = SchemaFactory.createForClass(UserNotifications);
UserNotificationsSchema.set('validateBeforeSave', true);