import * as mongoose from 'mongoose';
import { FlagsInterface, KeyInterface } from './api-interfaces';
import { UserKeyInterface } from './user-interface';

export enum SyllabusTypeEnum {
  SUBJECT = 'SUBJECT',
  CHAPTER = 'CHAPTER',
  // TOPIC = 'TOPIC',
  // SUBTOPIC = 'SUBTOPIC',
}

export interface SyllabusFlagsInterface {
  editable: boolean;
  testSeries: boolean;
  videos: boolean;
  materials: boolean;
  flashCards: boolean;
  questionBank: boolean;
  mcq: boolean;
  suggested: boolean;
  active:boolean;
}

export interface SyllabusInterface {
  uuid: string;
  _id?: mongoose.Types.ObjectId;
  title: string;
  shortcut: string;
  order: number;
  type: SyllabusTypeEnum;
  imgUrlVideos?: string;
  suggestedBanner?: string;
  imgUrlQBank?: string;
  parents?: any;
  children?: any;
  createdOn: Date;
  modifiedOn: Date;
  readonly flags: SyllabusFlagsInterface;
  createdBy: UserKeyInterface;
  modifiedBy?: UserKeyInterface;
}

export interface SyllabusKeyInterface extends KeyInterface {
  type: string;
}
