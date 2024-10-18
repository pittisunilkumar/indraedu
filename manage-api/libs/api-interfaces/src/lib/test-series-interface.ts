import * as mongoose from 'mongoose';
import { EntityStatusEnum, FlagsInterface } from './api-interfaces';
import { QuestionOptionsInterface } from './question-interface';
import { UserKeyInterface } from './user-interface';

export interface TestSeriesCategoryInterface{
  uuid: string;
  _id?: mongoose.Types.ObjectId;
   title: string;
   order: number;
   count?:number;
   freeTests?:number;
  schedulePdf: string;
  tests:TestInterface[]
}

export interface TestCategoryInterface {
  uuid: string;
  _id?: mongoose.Types.ObjectId;
  //title: string;
  courses: any;
  scheduledDate?:any;
 // order: number;
  categories:TestSeriesCategoryInterface;
  // count?: number;
  // userCompletedCount?: number;
 // schedulePdf: string;
  readonly createdOn: any;
  modifiedOn?: any;
  createdBy: UserKeyInterface;
  modifiedBy?: UserKeyInterface;
  flags: FlagsInterface;

  que:any;
  to_uuid:any;
  to_test:any;
  from_que:any;
  from_test:any;
  tests:any;
}

// export interface TestCategoryInterface {
//   uuid: string;
//   _id?: mongoose.Types.ObjectId;
//   title: string;
//  // courses: string[];
//  courses:any;
//   order: number;
//   //count?: number;
//   //userCompletedCount?: number;
//   schedulePdf: string;
//   readonly createdOn: any;
//   modifiedOn?: any;
//   createdBy: UserKeyInterface;
//   modifiedBy?: UserKeyInterface;
//   flags: FlagsInterface;
//   tests:any;
// }

export interface TestInterface {
  uuid: string;
  _id?: mongoose.Types.ObjectId;
  title: string;
  order: number;
  time: any;
  description: string;
  testType:string;
  scheduledDate: Date;
  expiryDate: Date;
  scheduledTime: any;
  expiryTime: any;
  resultDate?:any;
  resultTime?:any;
  pdf: string;
  count: number;
  imgUrl: string;
  suggestedBanner?:any;
  courses: any;
  categories: any;
  subjects: any;
  que: any;
  status?: EntityStatusEnum;
  testStatus?:any;
  positiveMarks?:number;
  negativeMarks?:any;
  rules?:any;
  testInformation?:any;
  // totalMarks?:number;
  flags: TestFlagsInterface;
  createdOn: any;
  modifiedOn?: any;
  createdBy: UserKeyInterface;
  modifiedBy?: UserKeyInterface;
}

export interface TestFlagsInterface extends FlagsInterface {
  editable: boolean;
  suggested: boolean;
  subscribed: boolean;
  testInfo?:boolean
}

export interface TestQuestionInterface {
  uuid: string;
  _id?: mongoose.Types.ObjectId;
  title: string;
  readonly options?: QuestionOptionsInterface[];
  readonly imgUrl?: string;
  readonly order?: number;
  positive?: number;
  negative?: number;
  flags: FlagsInterface;
}
