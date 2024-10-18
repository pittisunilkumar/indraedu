import { UserKeyInterface } from '@application/api-interfaces';
import * as mongoose from 'mongoose';
import { FlagsInterface, GenderEnum } from './api-interfaces';

export interface BankInterface {
  accountNumber: number;
  branch: string;
  ifsc: string;
}

export interface FacultyInterface {
  uuid: string;
  _id?: mongoose.Types.ObjectId;
  name: string;
  // discountPercentage:number;
  specialization:string;
  designation: string;
  courses: any;
  syllabus: any;
  bank: BankInterface;
  gender: GenderEnum;
  imgUrl: string;
  flags: FlagsInterface;
  createdOn: Date;
  modifiedOn?: Date;
  createdBy: UserKeyInterface;
  modifiedBy?: UserKeyInterface;
}
