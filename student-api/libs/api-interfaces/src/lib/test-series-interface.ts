import * as mongoose from 'mongoose';
import { EntityStatusEnum, FlagsInterface } from './api-interfaces';
import { QuestionOptionsInterface } from './question-interface';
import { UserKeyInterface } from './user-interface';

export interface TestSeriesCategoryInterface{
  uuid: string;
  _id?: mongoose.Types.ObjectId;
   title: string;
   order: number;
  schedulePdf: string;
  tests:TestInterface[]
}

export interface TestCategoryInterface {
  uuid: string;
  _id?: mongoose.Types.ObjectId;
  //title: string;
  courses: any;
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
  testStatus: number;
  uuid: string;
  _id?: mongoose.Types.ObjectId;
  title: string;
  order: number;
  time: string;
  description: string;
  scheduledDate: Date;
  resultDate : Date;
  expiryDate: Date;
  pdf: string;
  count: number;
  imgUrl: string;
  courses: any;
  categories: any;
  subjects: any;
  que: any;
  status?: EntityStatusEnum;
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
