import type {
    AddressInterface,
    UserBookmarkInterface,
    UserDeviceInterface,
    UserFlagsInterface,
    UserKeyInterface,
    UserSubmissionInterface,
  } from '@application/api-interfaces';
  import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
  import { ApiProperty } from '@nestjs/swagger';
  import * as mongoose from 'mongoose';
  import { Organization } from './organization.schema';

  @Schema()
  export class Employee extends mongoose.Document {

    @Prop({ required: true })
    @ApiProperty({ example: '0ba7596e-5087-4c72-887d-aaa730cdac23', description: 'Unique Identifier' })
    uuid: string;

    @Prop()
    @ApiProperty({ example: '5fa90d866rttry3001021fd', description: 'Object ID' })
    id: string;

    @Prop({ required: true })
    @ApiProperty({ example: 'Plato Architect', description: 'User name' })
    name: string;

    @Prop({
      required: true,
      type: String,
      enum: [ 'ADMIN', 'SUPER', 'DATAENTRY'],
    })
    @ApiProperty({
      example: 'ADMIN',
      description: 'AWS S3/Cloudinary URL for the image'
    })
    type: string;

    @Prop({
      required: false,
      type: String,
    })
    @ApiProperty({ example: [{ id: 'device-1', isLoggedIn: true }], description: 'Mobile Device Id(IMEI (android) | UDID (ios) ) and its logged in status' })
    devices: UserDeviceInterface[];

    @Prop({
      required: true,
      type: String,
    })
    @ApiProperty({ example: '2020-11-09T19:53:53.032Z', description: 'User Date of Birth' })
    dob?: Date;

    @Prop({
      required: true,
      type: String,
      enum: ['MALE', 'FEMALE', 'OTHER'],
    })
    @ApiProperty({ example: 'MALE', description: 'User Gender' })
    gender: string;

    @Prop({ required: true })
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

    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: Organization.name }])
    @ApiProperty({
      example: [{ uuid: '3457596e-5087-4c72-887d-aaa730cdac23', title: 'Sample Organization' }],
      description: 'User Organizations'
    })
    organizations: Organization;

    @Prop()
    @ApiProperty({ example: 'Plato College', description: 'User Bookmarks' })
    bookmarks: UserBookmarkInterface[];

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



    @Prop({ required: true })
    @ApiProperty({ example: 'user@platononline.com', description: 'User Email' })
    email: string;

    @Prop({ required: true })
    @ApiProperty({ example: 'qwewqeqwe', description: 'User password' })
    password: string;

    @Prop({ required: false })
    @ApiProperty({ example: 'hash-key', description: 'Access Token' })
    accessToken: string;

    @Prop({
      required: false,
      type: String,
    })
    @ApiProperty({ example: '2020-11-09T19:53:53.032Z', description: 'Created On' })
    createdOn?: Date;

    @Prop({
      required: false,
      type: String,
    })
    @ApiProperty({ example: '2020-11-12T19:53:53.032Z', description: 'Modified On' })
    modifiedOn?: Date;

    @Prop({ required: true, type: Object })
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

    @Prop({ required: true, type: Object })
    @ApiProperty({
      example: { active: true, paid: true, isLoggedIn: true },
      description: 'flags to operate on the entity'
    })
    flags: UserFlagsInterface;
  }

  export const EmployeeSchema = SchemaFactory.createForClass(Employee);
  EmployeeSchema.set('validateBeforeSave', true);
