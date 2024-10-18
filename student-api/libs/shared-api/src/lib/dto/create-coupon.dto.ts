import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString
} from 'class-validator';

import type{
  AvailedByInterface,
  CouponFlagsInterface,
  FlagsInterface,
  UserKeyInterface,
} from '@application/api-interfaces';

export class CreateCouponDTO {
  @IsNotEmpty()
  @IsString()
  readonly uuid: string;

  @IsNotEmpty()
  @IsString()
  readonly code: string;

  @IsNotEmpty()
  @IsString()
  readonly discountType: string;

  @IsNotEmpty()
  @IsNumber()
  readonly discount: number;

  @IsNotEmpty()
  @IsNumber()
  readonly totalCoupons: number;

  @IsNotEmpty()
  @IsNumber()
  readonly availableCoupons: number;

  @IsNotEmpty()
  @IsDateString()
  readonly valiedFrom: Date;

  @IsNotEmpty()
  @IsDateString()
  readonly valiedTo: Date;

  @IsNotEmpty()
  @IsString()
  readonly subscription: string;

  @IsNotEmpty()
  @IsString()
  readonly couponType: string;

  @IsOptional()
  @IsArray()
  readonly users: [];

  @IsOptional()
  @IsString()
  readonly agent: string;

  @IsOptional()
  @IsNumber()
  readonly agentCommission: number;

  @IsOptional()
  @IsNumber()
  readonly agentAmount: number;

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
  readonly flags: CouponFlagsInterface;
}
