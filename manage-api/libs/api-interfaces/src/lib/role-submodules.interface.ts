import { FlagsInterface, UserKeyInterface } from '@application/api-interfaces';
import * as mongoose from 'mongoose';

export interface RoleSubModuleInterface {
  uuid: string;
  _id?: mongoose.Types.ObjectId;
  title: string;
  createdOn: Date;
  modifiedOn?: Date;
  createdBy: UserKeyInterface;
  modifiedBy?: UserKeyInterface;
  flags: FlagsInterface;
}