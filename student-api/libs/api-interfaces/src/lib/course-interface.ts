import { KeyInterface, UserKeyInterface } from '@application/api-interfaces';
import * as mongoose from 'mongoose';
import { FlagsInterface } from './api-interfaces';

export interface CourseInterface {
  uuid: string;
  _id?: mongoose.Types.ObjectId;
  title: string;
  imgUrl?: string;
  order: number;
  readonly createdOn: Date;
  modifiedOn?: Date;
  flags: CourseFlagsInterface;
  syllabus: any;
  organizations?: any;
  createdBy: UserKeyInterface;
  modifiedBy?: UserKeyInterface;
}

export interface CourseFlagsInterface extends FlagsInterface {
  qBank: boolean;
  testSeries: boolean;
  videos: boolean;
}
