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
  videoId: string;
  order: number;
  youtubeUrl: string;
  androidUrl:string;
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
  videoSubjectId: string;
  courseId: string;
  syllabusId: string;
  status: number;
  remainingTime: string;
  totalTime: string;
  watchTime?:number;
}

export interface VideoSubjectInterface {
  status: boolean
  code: number
  message: string
  data: Array<{
    id: string
    uuid: string
    subjectName: string
    image: string
    completedCount: number
    courseId: string
    totalCount: number
    order: number
  }>
}


export interface VideoPlaybackInfoInterface {
  userUuid: string;
  videoUuid: string;
  vdoCipherId: string;
  title: string;
  totalTime: string;
}
