import type{
  BankInterface,
  FacultyInterface,
  FlagsInterface,
  UserKeyInterface,
  VideoCheckpointsInterface,
  VideoFlagsInterface,
  VideoSubjectInterface,
} from '@application/api-interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Course } from './course.schema';
import { Faculty } from './faculty.schema';
import { Syllabus } from './syllabus.schema';

@Schema()
export class Video extends mongoose.Document {

  @Prop({ required: true })
  uuid: string;

  @Prop()
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  totalTime: string;

  @Prop({ required: false })
  videoId: string;

  @Prop({ required: false })
  youtubeUrl: string;

  @Prop({ type: Object, required: true })
  readonly subject: VideoSubjectInterface;

  @Prop({ type: Object, required: true })
  chapter: { title: string };

  // @Prop({ required: true, type: Object})
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Faculty.name })
  faculty: string;

  @Prop()
  topics: VideoCheckpointsInterface[];

  @Prop()
  slides: string[];

  @Prop()
  notes: string;

  @Prop()
  suggestedBanner: string;

  @Prop({
    required: false,
    type: String,
  })
  publishOn?: Date;

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
  flags: VideoFlagsInterface;
}

export const VideoSchema = SchemaFactory.createForClass(Video);
VideoSchema.set('validateBeforeSave', true);
