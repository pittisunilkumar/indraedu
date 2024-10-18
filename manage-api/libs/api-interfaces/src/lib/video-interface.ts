import * as mongoose from 'mongoose';
import { FacultyInterface, FlagsInterface, SyllabusInterface, UserKeyInterface } from '..';


export interface VideoSubjectInterface {
  uuid: string;
  _id?: mongoose.Types.ObjectId;
  // title: string;
  order: number;
  count: number;
  imgUrl: string;
  courses: any;
  syllabus:any;
  chapters: VideoSubjectChapterInterface[];
  readonly createdOn: any;
  modifiedOn?: any;
  flags: VideoFlagsInterface;
  createdBy: UserKeyInterface;
  modifiedBy?: UserKeyInterface;
}

export interface VideoSubjectChapterInterface {
  _id:string;
  uuid: string;
  title: string;
  order: number;
  videos: VideoInterface[];
}


export interface VideoInterface {
  uuid: string;
  title: string;
  totalTime: string;
  videoType?:string;
  videoId: string;
  order: number;
  youtubeUrl: string;
  androidUrl:string;
  accessToken?:string;
  iosUrl:string;
  videoSubjectUuid: any;
  // chapter: { title: string; uuid: string; };
  chapter: any;
  faculty: any;
  // faculty:mongoose.ObjectId;
  topics: VideoCheckpointsInterface[];
  // slides: string[];
  videos:any;
  count:number;
  slides: string;
  notes: string;
  bannerName:string;
  suggestedBanner?: string;
  publishOn: Date;
  flags: VideoFlagsInterface;
  createdOn: Date;
  modifiedOn?: Date;
  createdBy: UserKeyInterface;
  modifiedBy?: UserKeyInterface;
  
  to_subject:string;
  to_chapter:string;
  from_subject:string;
  from_chapter:string;
  from_video:string
}

export interface VideoCheckpointsInterface {
  name: string;
  time: string;
  faculty: any;
  topicOrder:number
}

export interface VideoFlagsInterface extends FlagsInterface {
  suggested: boolean;
}

export enum UserVideoStatusEnum {
  PAUSED = 'PAUSED',
  YET_TO_START = 'YET_TO_START',
  COMPLETED = 'COMPLETED'
}

export interface UserVideoInterface {
  uuid: string;
  title: string;
  vdoCipherId: string;
  status: UserVideoStatusEnum;
  remainingTime: string;
}

export interface VideoPlaybackInfoInterface {
  userUuid: string;
  vdoCipherId: string;
  title: string;
  totalTime: string;
}
