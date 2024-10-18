import {
  IsEmail,
  IsNotEmpty,
  IsInt,
  IsString,
  IsEnum,
  IsArray,
  IsObject,
  IsBoolean,
  IsDate,
  IsOptional,
  IsDateString,
  IsNumber,
} from 'class-validator';

import {
  FlagsInterface,
  CourseInterface,
  UserKeyInterface,
  SubscriptionInterface,
} from '@application/api-interfaces';

export class CreateBannerDTO {
  @IsNotEmpty()
  @IsString()
  readonly uuid: string;

  // @IsNotEmpty()
  // @IsString()
  @IsOptional()
  readonly title: string;

  @IsOptional()
  @IsString()
  readonly link: string;

  // @IsOptional()
  // @IsString()
  readonly youtubeLink: string;

  // @IsOptional()
  // @IsString()
  readonly subscriptions: SubscriptionInterface[];

  @IsNotEmpty()
  //@IsArray()
  @IsString()
  readonly courses: CourseInterface[];

  @IsNotEmpty()
  @IsString()
  readonly imgUrl?: string;

  @IsNotEmpty()
  @IsNumber()
  readonly order: number;

  @IsNotEmpty()
  @IsDateString()
  readonly createdOn: Date;

  @IsOptional()
  @IsDateString()
  readonly modifiedOn?: Date;

  @IsNotEmpty()
  @IsObject()
  readonly createdBy: UserKeyInterface;

  @IsOptional()
  @IsObject()
  readonly modifiedBy?: UserKeyInterface;

  @IsNotEmpty()
  @IsObject()
  readonly flags: FlagsInterface;
}
