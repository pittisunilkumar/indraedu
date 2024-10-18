import {
  FlagsInterface,
  GenderEnum,
  KeyInterface,
} from '@application/api-interfaces';

export class UserCSVModel {
  // firstName: string;
  // lastName: string;
  name: string;
  mobile: number;
  email: string;
  location: string;
  college: string;
  flags: FlagsInterface;
  imgUrl: string;
  createdOn: Date;
  modifiedOn: Date;
  subscriptions: string[];
  courses: { name: string; paymentType: string }[];
  gender: GenderEnum;
  password: string;
}
