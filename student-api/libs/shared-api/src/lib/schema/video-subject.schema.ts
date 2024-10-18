import type { FlagsInterface, UserKeyInterface, VideoFlagsInterface, VideoInterface, VideoSubjectChapterInterface } from '@application/api-interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';
import { Course } from './course.schema';
import { Syllabus } from './syllabus.schema';
import { Video } from './video.schema';

@Schema()
export class VideoSubject extends mongoose.Document {

  @Prop({ required: true })
  uuid: string;

  @Prop()
  id: string;

  @Prop({ required: false })
  title: string;

  @Prop({ required: true })
  order: number;

  @Prop({ required: false })
  count?: number;

  @Prop({ required: true })
  chapters: VideoSubjectChapterInterface[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Course.name })
  courses: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Syllabus.name })
  syllabus: string;

  // @Prop({ required:false })
  // videos: video;

  @Prop({ required: true })
  imgUrl: string;

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

  @Prop({ required: false })
  publishOn: Date;

  @Prop({ type: Object })
  @ApiProperty({
    example: { uuid: '0ba7596e-5087-4c72-887d-aaa730cdac23', name: 'Krishna' },
    description: 'UUID & Name of the user modified it'
  })
  modifiedBy: UserKeyInterface;

  @Prop({ required: true, type: Object })
  flags: VideoFlagsInterface;

}

export const VideoSubjectSchema = SchemaFactory.createForClass(VideoSubject);
VideoSubjectSchema.set('validateBeforeSave', true);
