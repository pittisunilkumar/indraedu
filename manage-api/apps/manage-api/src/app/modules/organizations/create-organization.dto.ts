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
} from 'class-validator';

import {
  AddressInterface,
  BranchInterface,
  OrganizationFlagsInterface,
  OrganizationEntitlementsInterface,
  KeyInterface,
} from '@application/api-interfaces';

export class CreateOrganizationDto {
  @IsNotEmpty()
  @IsString()
  readonly uuid: string;

  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  readonly type: string;

  @IsOptional()
  @IsString()
  readonly imgUrl?: string;

  @IsOptional()
  @IsObject()
  readonly entitlements: OrganizationEntitlementsInterface;

  @IsNotEmpty()
  @IsObject()
  readonly address?: AddressInterface;

  @IsOptional()
  @IsString()
  readonly phone: string;

  @IsOptional()
  @IsString()
  readonly mobile: number;

  @IsNotEmpty()
  @IsString()
  readonly email: string;

  @IsOptional()
  @IsArray()
  readonly branches?: BranchInterface[];

  @IsOptional()
  @IsArray()
  readonly users?: KeyInterface[];

  @IsNotEmpty()
  @IsString()
  readonly createdOn: String;

  @IsOptional()
  @IsString()
  readonly modifiedOn?: String;

  @IsNotEmpty()
  @IsObject()
  readonly flags: OrganizationFlagsInterface;
}
