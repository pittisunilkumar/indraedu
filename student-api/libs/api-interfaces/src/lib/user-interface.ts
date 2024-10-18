import { EntityInterface, FlagsInterface, SubmitUserQBankTopicInterface, SubmitUserTestInterface } from '@application/api-interfaces';
import * as mongoose from 'mongoose';
import { AddressInterface } from './organization-interface';
import { QuestionEntityInterface, QuestionInterface } from './question-interface';

export interface UserKeyInterface {
  _id?: string;
  uuid: string;
  mobile?: number;
  imgUrl?: string;
  name: string;
}

export interface feedbackUsersRatingInterface {
  _id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  rating: Number;
  message: string;
  createdOn: Date;
 }
 
 export interface UserDeviceInterface {
  id: string;
  isLoggedIn: boolean;
  device_type: string;
  device_id : string;
  fcm_token:string;
}

export enum UserTypeEnum {
  STUDENT = 'STUDENT',
  // ADMIN = 'ADMIN',
  // SUPER = 'SUPER',
  // FACULTY = 'FACULTY',
  // DATAENTRY = 'DATAENTRY'
}

export enum PaymentStatusEnum {
  ORDERCREATED = 'ORDERCREATED',
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',

}

export enum ModeOfPaymentEnum {
  MasterAdvise = 'MasterAdvise',
  RAZORPAY = 'RAZORPAY',
  PHONEPE = 'PHONEPE',
  CASH = 'CASH',
  POSMACHINE = 'POSMACHINE',
  UPI = 'UPI',
  OFFLINE = 'OFFLINE',

}

export enum SocialAuthTypes {
  MOBILE = 'MOBILE',
  GOOGLE = 'GOOGLE',
  GITHUB = 'GITHUB',
  LINKEDIN = 'LINKEDIN',
}

export enum EmployeeTypeEnum {
  ADMIN = 'ADMIN',
  SUPER = 'SUPER',
  // FACULTY = 'FACULTY',
  DATAENTRY = 'DATAENTRY'
}

export interface UserSubscriptionInterface {
  uuid: string;
  _id: string;
  title: string;
  paid?: number;
}

export interface UserObjectSubscriptionInterface {
  tests?: any;
  qbanks?: any;
  subscription_id: mongoose.Types.ObjectId;
  expiry_date: Date;
  createdOn: Date;
}

export enum BookmarkSourceTypeEnum {
  TEST = 'TEST',
  QB = 'QB'
}

export interface UserBookmarkedQuestionMetadataInterface {
  _id: string;
  type: BookmarkSourceTypeEnum;
  title: string;
  uuid: string;
}

export interface UserBookmarkInterface {
  uuid: string;
  question: {type : mongoose.Schema.Types.ObjectId, ref : 'Question'};
  metadata: UserBookmarkedQuestionMetadataInterface;
  createdOn: Date;

  type:string;
  userId: {type : mongoose.Schema.Types.ObjectId, ref : 'User'} ;
  questionId: {type : mongoose.Schema.Types.ObjectId, ref : 'Question'} ;
  courseId: {type : mongoose.Schema.Types.ObjectId, ref : 'Course'} ;
  subjectId: {type : mongoose.Schema.Types.ObjectId, ref : 'Syllabus'} ;
  chapterId: {type : mongoose.Schema.Types.ObjectId, ref : 'Syllabus'} ;
  topicUuid: string ;
  categoryUuid: string;
  chapterUuid: string;
  testUuid: string;
  addedDate:Date;
}

export interface UserSubmissionInterface {
  tests: SubmitUserTestInterface[];
  qbanks: SubmitUserQBankTopicInterface[];
}

export interface UserFlagsInterface extends FlagsInterface {
  isLoggedIn: boolean;
  isActive:boolean;
}

export interface ResetPasswordInterface { oldPassword: string; newPassword: string; }
export interface ResetEmployeePasswordInterface {  newPassword: string; }


export interface UserTestInterface {
  category: EntityInterface;
  course: EntityInterface;
  test: EntityInterface;
  subject?: EntityInterface;
  elapsedTime?: number;
  totalTime: number;
  expiryDate: Date;
  status: string;
  questions?: QuestionEntityInterface[];
  startedAt: Date;
  stoppedAt?: Date;
  category_id?:any;
  expiry_date?:any;
}

export interface UserQbTopicInterface {
  chapter: EntityInterface;
  course: EntityInterface;
  topic: EntityInterface;
  subject?: EntityInterface;
  status: string;
  questions?: QuestionEntityInterface[];
  startedAt: Date;
  stoppedAt?: Date;
}


export interface UserInterface {
  uuid: string;
  mobile: number;
  email: string;
  name: string;
  dob?: Date;
  college?: string;
  type: UserTypeEnum;
  courses?: any;
  videos?: any;
  // tests?: UserTestInterface[];
  // qbanks?: UserQbTopicInterface[];
  qbanks?: any;
  tests?:any;
  subscriptions?: any;
  // QUESTION BOOKMARKS
  bookmarks?: UserBookmarkInterface[];
  devices?: UserDeviceInterface[];
  submissions?: UserSubmissionInterface;
  organizations?: any;
  address: AddressInterface;
  flags: UserFlagsInterface;
  imgUrl?: any;
  readonly createdOn: Date;
  readonly modifiedOn?: Date;
  gender: string;
  password?: string;
  otp?: number;
  createdBy: UserKeyInterface;
  modifiedBy?: UserKeyInterface;
  accessToken?: string;
}

export interface EmployeeInterface {
  uuid: string;
  mobile: number;
  email: string;
  name: string;
  dob?: Date;
  college?: string;
  type: UserTypeEnum;
  courses?: any;
  bookmarks?: UserBookmarkInterface[];
  devices?: UserDeviceInterface[];
  submissions?: UserSubmissionInterface;
  organizations?: any;
  address: AddressInterface;
  flags: UserFlagsInterface;
  imgUrl?: any;
  readonly createdOn: Date;
  readonly modifiedOn?: Date;
  gender: string;
  password?: string;
  createdBy: UserKeyInterface;
  modifiedBy?: UserKeyInterface;
  accessToken?: string;
}
export interface UserTransactonsInterface {
  uuid: string;
  userId:string;
  subscriptionId: string;
  dateOfPayment?:Date;
  expiryDate?: Date;
  actualPrice:number;
  discountPrice:number;
  finalPaidAmount:number;
  couponId:string;
  paymentType:string;
  modeOfPayment: string;
  paymentStatus:string;
  filePath: string;
  billNumber: string;
  chequeNumber:string;
  chequeDate?: Date;
  bankName: string;
  referenceNumber: string;
  creditORdebitCard: string;
  cardType:string;
  upiId:string;
  mode_transactionNumber:string;
  paymentCreatedOn?: Date;
  createdBy?:UserKeyInterface;

}

export interface TransactionsDateInterface{

  fromDate: Date;
  toDate: Date;

}

export interface TestSeriesSubmissionInterface{
  categoryUuid: string;
  courseId: string;
  testSeriesUuid: string;
  subjectId?: string;
  leftOverTime?: number;
  totalTime: number;
  expiryDate: Date;
  status: any;
  completedMcq? : number;
  startedAt: Date;
  stoppedAt?: Date;
}


