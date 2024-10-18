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
  } from 'class-validator';

  import type {
    FlagsInterface,
    UserKeyInterface,
  } from '@application/api-interfaces';

  export class CreateTagsDTO {
    @IsNotEmpty()
    @IsString()
    readonly uuid: string;

    @IsNotEmpty()
    @IsString()
    readonly title: string;

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
