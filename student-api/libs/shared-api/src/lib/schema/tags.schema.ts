import type {
    FlagsInterface,
    UserKeyInterface,
  } from '@application/api-interfaces';
  // import { Subscription } from '@application/shared-api';
  import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
  import { ApiProperty } from '@nestjs/swagger';
  import * as mongoose from 'mongoose';

  @Schema()
export class Tags extends mongoose.Document {

  @Prop({ required: true })
  @ApiProperty({ example: '0ba7596e-5087-4c72-887d-aaa730cdac23', description: 'Unique Identifier' })
  uuid: string;

  @Prop()
  @ApiProperty({ example: '5fa90d866rttry3001021fd', description: 'Object ID' })
  id: string;

  @Prop({ required: false })
  @ApiProperty({ example: 'New Tag', description: 'Tag Title' })
  title: string;

  @Prop({
    required: false,
    type: String,
  })
  @ApiProperty({ example: '2020-11-09T19:53:53.032Z', description: 'Created On' })
  createdOn?: Date;

  @Prop({
    required: false,
    type: String,
  })
  @ApiProperty({ example: '2020-11-12T19:53:53.032Z', description: 'Modified On' })
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
  @ApiProperty({
    example: { active: true, paid: true, },
    description: 'flags to operate on the entity'
  })
  flags: FlagsInterface;

}

export const TagsSchema = SchemaFactory.createForClass(Tags);
TagsSchema.set('validateBeforeSave', true);
