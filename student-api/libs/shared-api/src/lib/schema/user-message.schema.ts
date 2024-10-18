import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';

@Schema()
export class UserMessage extends mongoose.Document {

  @Prop({ required: true })
  @ApiProperty({ example: '0ba7596e-5087-4c72-887d-aaa730cdac23', description: 'Unique Identifier' })
  uuid: string;

  @Prop()
  @ApiProperty({ example: '5fa90d866rttry3001021fd', description: 'Object ID' })
  id: string;

  @Prop({ required: true })
  @ApiProperty({ example: 'Plato Architect', description: 'User name' })
  name: string;

  @Prop({ required: true })
  @ApiProperty({ example: 9999999990, description: 'User Mobile' })
  mobile: number;

  @Prop({ required: true })
  @ApiProperty({ example: 'user@platononline.com', description: 'User Email' })
  email: string;

  @Prop({ required: true })
  @ApiProperty({ example: 'Say Hi', description: 'User Message' })
  message: string;

}

export const UserMessageSchema = SchemaFactory.createForClass(UserMessage);
UserMessageSchema.set('validateBeforeSave', true);
