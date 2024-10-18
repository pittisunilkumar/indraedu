import {
  CourseInterface,
  FlagsInterface,
  KeyInterface,
  UserKeyInterface,
} from '@application/api-interfaces';
// import { Subscription } from '@application/shared-api';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';
import { Course } from './course.schema';
import { Subscription } from './subscription.schema';
// import { Subscription } from '@application/shared-api';


@Schema()
export class Banner extends mongoose.Document {

  @Prop({ required: true })
  @ApiProperty({ example: '0ba7596e-5087-4c72-887d-aaa730cdac23', description: 'Unique Identifier' })
  uuid: string;

  @Prop()
  @ApiProperty({ example: '5fa90d866rttry3001021fd', description: 'Object ID' })
  id: string;

  @Prop({ required: false })
  @ApiProperty({ example: 'New Banner', description: 'Banner Title' })
  title: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: Course.name }])
  @ApiProperty({ example: [Course], description: 'Assigned Courses' })
  courses: any;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: Subscription.name, required: false }])
  @ApiProperty({ example: [Subscription], description: 'Assigned Subscriptions' })
  subscriptions: any;

  @Prop({ required: false })
  @ApiProperty({ example: 'http://url', description: 'Banner Title' })
  link: string;

  @Prop({ required: false })
  @ApiProperty({ example: 'http://url', description: 'Banner Youtube Link' })
  youtubeLink: string;

  @Prop({ required: false })
  @ApiProperty({
    example: 'http://img-url',
    description: 'AWS S3/Cloudinary URL for the image'
  })
  imgUrl: string;

  @Prop({ required: true ,dropDups: true})
  @ApiProperty({ example: '1', description: 'Banner Order' })
  order: number;

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

export const BannerSchema = SchemaFactory.createForClass(Banner);
BannerSchema.set('validateBeforeSave', true);
