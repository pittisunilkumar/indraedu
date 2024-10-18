import * as mongoose from 'mongoose';
import { FlagsInterface } from './api-interfaces';
import { UserKeyInterface } from './user-interface';

export interface SubscriptionInterface {
  uuid: string;
  _id?: mongoose.Types.ObjectId;
  title: string;
  description: string;
  order: number;
  courses: any;
  videos?: any;
  tests?: any;
  qbanks?: any;
  // coupons: any;
  validFrom:Date;
  validTo:Date;
  period: number;
  actual: number;
  // discounted: number;
  createdOn: string;
  modifiedOn: any;
  flags: FlagsInterface;
  createdBy: UserKeyInterface;
  modifiedBy?: UserKeyInterface;
  count:number;
}



