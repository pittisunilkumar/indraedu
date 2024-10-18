import { FlagsInterface, UserKeyInterface } from '@application/api-interfaces';
import { CourseInterface } from './course-interface';

export interface BannerInterface {
  uuid: string;
  title: string;
  link: string;
  youtubeLink:string;
  imgUrl: string;
  courses: any;
  subscriptions:any;
  order: number;
  createdOn: Date;
  modifiedOn?: Date;
  createdBy: UserKeyInterface;
  modifiedBy?: UserKeyInterface;
  flags: FlagsInterface;
}
