import type {
  CouponInterface,
  CourseInterface,
  FlagsInterface,
  QBankInterface,
  TestInterface,
  UserKeyInterface,
  VideoInterface,
} from '@application/api-interfaces';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateSubscriptionDto {
  @IsNotEmpty()
  @IsString()
  readonly uuid: string;

  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsOptional()
  @IsString()
  readonly description: string;

  @IsNotEmpty()
  @IsNumber()
  readonly order: number;

  @IsNotEmpty()
  @IsNumber()
  readonly count: number;

  // @IsOptional()
  // @IsString()
  // readonly imgUrlVideos?: string;

  // @IsOptional()
  // @IsString()
  // readonly suggestedBanner?: string;

  // @IsOptional()
  // @IsString()
  // readonly imgUrlQBank?: string;

  @IsOptional()
  @IsArray()
  readonly videos: VideoInterface[];

  @IsOptional()
  @IsArray()
  readonly tests: TestInterface[];

  @IsOptional()
  @IsArray()
  readonly qbanks: QBankInterface[];

  // @IsNotEmpty()
  // @IsArray()
  // readonly courses: SubscriptionCourseInterface[];

  @IsNotEmpty()
  @IsString()
  readonly courses: CourseInterface[];

  // @IsNotEmpty()
  // // @IsObject()
  // // readonly coupons: CouponInterface;
  // @IsString()
  // readonly coupons: CouponInterface[];

  @IsOptional()
  @IsNumber()
  readonly period: number;

  @IsNotEmpty()
  @IsNumber()
  readonly actual: number;

  // @IsNotEmpty()
  // @IsNumber()
  // readonly discounted: number;

  @IsOptional()
  readonly validFrom: Date;

  @IsOptional()
  readonly validTo: Date;

  @IsNotEmpty()
  @IsObject()
  readonly flags: FlagsInterface;

  @IsNotEmpty()
  @IsString()
  readonly createdOn: String;

  @IsOptional()
  @IsString()
  readonly modifiedOn?: String;

  @IsNotEmpty()
  @IsObject()
  readonly createdBy: UserKeyInterface;

  @IsOptional()
  @IsObject()
  readonly modifiedBy?: UserKeyInterface;

}
