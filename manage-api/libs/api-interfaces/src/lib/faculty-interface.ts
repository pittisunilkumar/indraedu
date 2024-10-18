import { UserKeyInterface } from '@application/api-interfaces';
import * as mongoose from 'mongoose';
import { AgentsFlagsInterface, FlagsInterface, GenderEnum } from './api-interfaces';

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
  mobile:number;
  password:string;
  designation: string;
  courses: any;
  syllabus: any;
  bank: BankInterface;
  gender: GenderEnum;
  imgUrl: string;
  // flags: FlagsInterface;
  flags: AgentsFlagsInterface;
  createdOn: Date;
  modifiedOn?: Date;
  createdBy: UserKeyInterface;
  modifiedBy?: UserKeyInterface;
}

export interface AgentTransactonsInterface {
  uuid: string;
  dateOfPayment?:Date;
  paidAmount:number;
  couponId:string;
  agent:string;
  modeOfPayment: string;
  paymentStatus:string;
  filePath: string;
  billNumber: string;
  chequeNumber:string;
  chequeDate?: Date;
  bankName: string;
  referenceNumber: string;
  upiId:string;
  mode_transactionNumber:string;
  paymentCreatedOn?: Date;
  createdBy?:UserKeyInterface;
  transactionId:string;
}
