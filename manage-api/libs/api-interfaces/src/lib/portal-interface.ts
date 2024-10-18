import { UserKeyInterface } from './user-interface';

export interface PortalInterface {
  about: AboutInterface;
}

export interface AboutInterface {
  uuid: string;
  title: string;
  content: string;
  createdOn: Date;
  modifiedOn?: Date;
  createdBy: UserKeyInterface;
  modifiedBy?: UserKeyInterface;
}
