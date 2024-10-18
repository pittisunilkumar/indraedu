import { SyllabusInterface, UserKeyInterface } from '@application/api-interfaces';
import * as mongoose from 'mongoose';

export enum QuestionTypeEnum {
  MULTIPLE = 'MULTIPLE',
  SINGLE = 'SINGLE',
  ESSAY = 'ESSAY',
  FIB = 'FIB',
  IMG = 'IMG',
  FILL_IN_THE_BLANK="FILL_IN_THE_BLANK",
  TRUE_OR_FALSE="TRUE_OR_FALSE",
  MATCH_THE_FOLLOWING="MATCH_THE_FOLLOWING"
}

export interface matchLeftOptionsInterface {
  name: string;
  value: number;
  imgUrl?: string;
  upload:boolean;
}

export interface matchRightOptionsInterface {
  name: string;
  value: any;
  imgUrl?: string;
  upload:boolean;
}

export enum QuestionDifficultyEnum {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

export enum QuestionClassficationEnum {
  SUBJECT = 'SUBJECT',
  CHAPTER = 'CHAPTER',
  TOPIC = 'TOPIC',
  SUBTOPIC = 'SUBTOPIC',
}

export interface QuestionOptionsInterface {
  name: string;
  value: number;
  imgUrl?: string;
  weightage?: number;
}

export interface RoleValueOptionsInterface {
  name: string;
  value: number;
}

export interface PeralSubjectChapterInterface {
  subject: any;
  chapter: any;
 // value: number;
}

export interface QuestionFollowingOptionsInterface {
  name: string;
  value: any;
  imgUrl?: string;
  weightage?: number;
}

export interface MatchQuestionAnswerInterface {
  name: any;
  // value: any;
}


export interface QuestionClassficationInterface {
  uuid: string;
  name: string;
  type: QuestionClassficationEnum;
}

// free - it defines if the question is available only for free users.
// pro - it defines if the question is available only for pro users.
// status - allow whether to be added to the tests.
// editable - open for editions. available only for admins.
// relationship - allow if the question can be assignable to-
// single/multiple topic.

export interface QuestionFlagsInterface {
  pro: boolean;
  editable: boolean;
  active: boolean;
  qBank: boolean;
  testSeries: boolean;
  paid?:boolean;
}

export interface QuestionAnswerInterface {
  options?: number[];
  fib?: string[];
  comprehension?: string;
}

export interface TestSeries {
  uuid: string;
  name: string;
}

export interface QuestionInterface {
  _id?: mongoose.Types.ObjectId;
  uuid: string;
  title: string;
  type: string;
  options: QuestionOptionsInterface[];
  followingOptions:QuestionFollowingOptionsInterface[];
  imgUrl?: string;
  descriptionImgUrl?:string;
  previousAppearances?: string;
  difficulty: string;
  syllabus: any;
  perals:any;
  answer: QuestionAnswerInterface;
  description: string;
  flags: QuestionFlagsInterface;
  toggle?: boolean;
  tags?: string;
  mathType?:string;
  testSeries: TestSeries[];
  createdOn: Date;
  modifiedOn?: Date;
  createdBy: UserKeyInterface;
  modifiedBy?: UserKeyInterface;
  checked?: boolean;
  questionId?:any;
}

export interface QbankQuestionInterface {
  qbank_subject:any;
  qbank_chapter:any;
  qbank_topic:any;
  que:any;
  qbank_que:any;
}

export interface TestSeriesQuestionInterface {
  ts_uuid:any;
  test:any;
  que:any;
  test_que:any;
}

export interface SelectedQuestionInterface {
  que: QuestionInterface;
  isSelected: boolean;
  positive: number;
  negative: number;
  order: number;
  // question:any
}

export interface QuestionEntityInterface {
  uuid: string;
  _id: string;
  selectedOption: number;
  title?: string;
  type?: string;
  options?: QuestionOptionsInterface[];
  imgUrl?: string;
  previousAppearances?: string;
  difficulty?: string;
  syllabus?: any;
  answer?: QuestionAnswerInterface;
  description?: string;
}
