import { FlagsInterface, UserKeyInterface } from '@application/api-interfaces';
import { CourseInterface } from './course-interface';

export interface TagsInterface {
  uuid: string;
  title: string;
  createdOn: Date;
  modifiedOn?: Date;
  createdBy: UserKeyInterface;
  modifiedBy?: UserKeyInterface;
  flags: FlagsInterface;
}
