import { FlagsInterface, UserKeyInterface } from '@application/api-interfaces';

export interface TagInterface {
  uuid: string;
  title: string;
  createdOn: Date;
  modifiedOn?: Date;
  createdBy: UserKeyInterface;
  modifiedBy?: UserKeyInterface;
  flags: FlagsInterface;
}