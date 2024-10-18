import type {
  AddressInterface,
  EntityInterface,
  FlagsInterface,
  KeyInterface,
  QuestionEntityInterface,
  SubscriptionInterface,
  EntityStatusEnum,
  UserBookmarkInterface,
  UserDeviceInterface,
  UserFlagsInterface,
  UserKeyInterface,
  UserQbTopicInterface,
  UserSubmissionInterface,
  TestSeriesSubmissionInterface,
  UserTestInterface,
  UserVideoInterface,
  UserObjectSubscriptionInterface,
  SocialAuthTypes,

} from '@application/api-interfaces';
import { QBankSubject, VideoSubject } from '@application/shared-api';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';
import { Course } from './course.schema';
import { Organization } from './organization.schema';
import { Subscription, SubscriptionSchema } from './subscription.schema';
import { Syllabus } from './syllabus.schema';
import { Question } from './questions.schema';
import { TSCategories } from './ts-categories.schema';

@Schema()
export class User extends mongoose.Document {

  @Prop({ required: true })
  @ApiProperty({ example: '0ba7596e-5087-4c72-887d-aaa730cdac23', description: 'Unique Identifier' })
  uuid: string;

  @Prop()
  @ApiProperty({ example: '5fa90d866rttry3001021fd', description: 'Object ID' })
  id: string;

  @Prop({ required: false })
  @ApiProperty({ example: 'Plato Architect', description: 'User name' })
  name: string;

  // @Prop({
  //   required: false,
  //   type: String,
  //   enum: ['STUDENT', 'ADMIN', 'SUPER', 'DATAENTRY'],
  // })
  // @ApiProperty({
  //   example: 'STUDENT',
  //   description: 'AWS S3/Cloudinary URL for the image'
  // })
  // type: string;

  @Prop({
    required: false,
    type: String,
    default:'STUDENT'
  })
  @ApiProperty({
    example: 'STUDENT',
    description: 'AWS S3/Cloudinary URL for the image'
  })
  type: string;

  @Prop({
    required: false,
    type: Array,
  })
  @ApiProperty({ example: [{ id: 'device-1', isLoggedIn: true }], description: 'Mobile Device Id(IMEI (android) | UDID (ios) ) and its logged in status' })
  devices: UserDeviceInterface[];

  @Prop({
    required: false,
    type: String,
  })
  @ApiProperty({ example: '2020-11-09T19:53:53.032Z', description: 'User Date of Birth' })
  dob?: Date;

  @Prop({
    required: false,
    type: String,
    enum: ['MALE', 'FEMALE', 'OTHER'],
  })
  @ApiProperty({ example: 'MALE', description: 'User Gender' })
  gender: string;

  @Prop({ required: false })
  @ApiProperty({ example: 9999999990, description: 'User Mobile' })
  mobile: number;

  @Prop()
  @ApiProperty({ example: 'Plato College', description: 'User College' })
  college: string;

  @Prop({ required: false })
  @ApiProperty({
    example: 'http://img-url',
    description: 'AWS S3/Cloudinary URL for the image'
  })
  imgUrl: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Course.name })
  @ApiProperty({
    example: [{ uuid: '3457596e-5087-4c72-887d-aaa730cdac23', title: 'Sample Course' }],
    description: 'User Courses'
  })
  courses: Course;

  // @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: Organization.name }])
  // @ApiProperty({
  //   example: [{ uuid: '3457596e-5087-4c72-887d-aaa730cdac23', title: 'Sample Organization' }],
  //   description: 'User Organizations'
  // })
  // organizations: Organization;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: Organization.name }])
  organizations: string[];

  // @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: Subscription.name }])
  @Prop([{
    subscription_id: { type: mongoose.Schema.Types.ObjectId, ref: Subscription.name },
    expiry_date: { type: Date, required: false },
    createdOn: { type: Date, required: false }
  }])

  subscriptions: UserObjectSubscriptionInterface[];

  @Prop(
    [{
      courseId: {required: true,type: mongoose.Schema.Types.ObjectId, ref: Course.name },
      subjectId: {required: false,type: mongoose.Schema.Types.ObjectId, ref: Syllabus.name },
      chapterId: {required: false,type: mongoose.Schema.Types.ObjectId, ref: Syllabus.name },
      topicUuid: {required: false,type: String },
      testUuid: {required: false,type: String },
      type: {required: true,type: String },
      questionId: {required: true,type: mongoose.Schema.Types.ObjectId, ref: Question.name },
      categoryUuid: {required: false,type: String },
      chapterUuid: {required: false,type: String },
      addedDate: {required: true,type: Date },
    }]
  )
  @ApiProperty({ example: 'Plato College', description: 'User Bookmarks' })
  bookmarks: UserBookmarkInterface[];


  // @Prop({ required: false, type: Array })
  @Prop(
    [{
      category_id: { type: mongoose.Schema.Types.ObjectId },
      expiry_date: { required: false, type: Date }
    }])
  tests?: any;

    // @Prop({ required: false, type: Array })
  @Prop(
    [{
     subject_id: { type: mongoose.Schema.Types.ObjectId },
      expiry_date: { required: false, type: Date }
    }])
  qbanks?: any;

  // @Prop({ required: false, type: Object })
  @Prop(
    [{
      subject_id: { type: mongoose.Schema.Types.ObjectId },
      expiry_date: { required: false, type: Date }
    }])
  @ApiProperty({
    example: {
      uuid: '221B ',
      title: 'Video 1',
      vdoCipherId: '12341231',
    },
    description: 'Video Entity array to keep track of user activity'
  })
  videos: any;

  // @Prop({ required: false, type: Object })
  @Prop({ required: false, type: Object })
  @ApiProperty({
    example: {
      uuid: '221B ',
      title: 'Video 1',
      vdoCipherId: '12341231',
    },
    description: 'Video Entity array to keep track of user activity'
  })
  userVideos: UserVideoInterface[];

  @Prop({ required: false, type: Object })
  @ApiProperty({
    example: {
      uuid: '221B ',
      title: 'Video 1',
      vdoCipherId: '12341231',
    },
    description: 'Video Entity array to keep track of user activity'
  })
  userSuggestedVideos: UserVideoInterface[];


  @Prop({ required: false, type: Object })
  qbanksTestSubmissions?: any;

  @Prop({ required: false, type: Object })
  testSeriesSubmissions?: TestSeriesSubmissionInterface[];


  @Prop({ required: false, type: Object })
  submissions?: UserSubmissionInterface;

  @Prop({ required: false, type: Object })
  @ApiProperty({
    example: {
      addressLine1: '221B ',
      addressLine2: 'Baker Street',
      state: 'CAMBRIDGE',
      town: 'LONDON',
      pincode: 123456
    },
    description: 'User Address'
  })
  address: AddressInterface;


  @Prop({required: false,type: String,})
  @ApiProperty({ example: 'GOOGLE', description: 'RAZORPAY/CASH/CHEQUE/POS-MACHINE/UPI' })
  signinType: SocialAuthTypes;

  @Prop({required: false,type: String,})
  @ApiProperty({ example: 'ProfileId', description: 'hgshdsdsdghs7s7d6s6d' })
  profileId: string;

  @Prop({ required: false })
  @ApiProperty({ example: 'user@platononline.com', description: 'User Email' })
  email: string;

  @Prop({ required: false })
  @ApiProperty({ example: 'qwewqeqwe', description: 'User password' })
  password: string;

  @Prop({ required: false })
  @ApiProperty({ example: '123456', description: 'OTP' })
  otp: string;

  @Prop({ required: false })
  @ApiProperty({ example: 'Date', description: 'OTP Expiration' })
  expiration_time: Date;

  @Prop({ required: false })
  @ApiProperty({ example: 'hash-key', description: 'Access Token' })
  accessToken: string;

  @Prop({
    required: false,
    type: Date,
  })
  @ApiProperty({ example: '2020-11-09T19:53:53.032Z', description: 'Created On' })
  createdOn?: Date;

  @Prop()
  timestamps: true;

  @Prop({
    required: false,
    type: String,
  })
  @ApiProperty({ example: '2020-11-12T19:53:53.032Z', description: 'Modified On' })
  modifiedOn?: Date;

  @Prop({ required: false, type: Object })
  @ApiProperty({
    example: { uuid: '0ba7596e-5087-4c72-887d-aaa730cdac23', name: 'Krishna' },
    description: 'UUID & Name of the user created it'
  })
  createdBy: UserKeyInterface;

  @Prop({ type: Object })
  @ApiProperty({
    example: { uuid: '0ba7596e-5087-4c72-887d-aaa730cdac23', name: 'Krishna' },
    description: 'UUID & Name of the user modified it'
  })
  modifiedBy: UserKeyInterface;

  @Prop({ required: false, type: Object })
  @ApiProperty({
    example: { active: true, paid: true, isLoggedIn: true },
    description: 'flags to operate on the entity'
  })
  // flags?: UserFlagsInterface;
  flags?: any;


  @Prop({ required: false})
  @ApiProperty({
    example: { isLoggedIn: true },
    description: 'isLoggedIn'
  })
  isLoggedIn: boolean;

  @Prop({
    required: false,
    type: Date,
  })
  @ApiProperty({ example: '2020-11-12T19:53:53.032Z', description: 'Last LoggedIn' })
  lastLoggedIn?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.set('validateBeforeSave', true);
