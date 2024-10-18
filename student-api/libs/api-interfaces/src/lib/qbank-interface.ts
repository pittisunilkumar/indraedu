import * as mongoose from 'mongoose';
import { EntityStatusEnum, FlagsInterface } from './api-interfaces';
import { QuestionOptionsInterface } from './question-interface';
import { UserKeyInterface } from './user-interface';

export interface QBankChapterInterface {
  // subjectId: string;
  uuid: string;
  _id?: mongoose.Types.ObjectId;
  title: string;
}
export interface QBankSubjectInterface {
  uuid: string;
  _id?: mongoose.Types.ObjectId;
  // title: string; // removed
  order: number;
  count: number;
  imgUrl: string;
  courses: any;
  syllabus: any; //added extra
  chapters: QBankSubjectChapterInterface[];
  readonly createdOn: Date;
  modifiedOn?: Date;
  flags: QBankFlagsInterface;
  createdBy: UserKeyInterface;
  modifiedBy?: UserKeyInterface;
}

export interface QBankSubjectChapterInterface {
  // uuid: string;
  _id: string;
  uuid:string,
  // _id?: mongoose.Types.ObjectId;
  title: string;
  order: number;
  topics: QBankInterface[];
}

export interface QBankInterface {
  uuid: string;
  _id?: mongoose.Types.ObjectId;
  title: string;
  order: number;
  description: string;
  scheduledDate: Date;
  pdf: any;
  count: number;
  imgUrl: string;
  iconUrl: string;
  image:any;
  icon:any;
  subject: any;
  courses: any;
  chapter:any;
  // chapter: { title: string; uuid: string; };
  topics:any;
  chapters:any;
  from_subject:any;
  to_subject:any;
  from_chapter:any;
  to_chapter:any;
  from_topic:any;
  to_topic:any;
  from_que:any;
  que: any;
  chapter_uuid:string;
  topic_uuid:string;
  qbank_subject_uuid:string;
  status?: string;
  readonly createdOn: Date;
  modifiedOn?: Date;
  flags: QBankFlagsInterface;
  createdBy: UserKeyInterface;
  modifiedBy?: UserKeyInterface;
}


export interface QBankFlagsInterface extends FlagsInterface {
  editable?: boolean;
  suggested: boolean;
  subscribed?: boolean;
}

export interface QBankQuestionInterface {
  uuid: string;
  _id?: mongoose.Types.ObjectId;
  title: string;
  readonly options?: QuestionOptionsInterface[];
  readonly imgUrl?: string;
  readonly order?: number;
  flags: FlagsInterface;
}
