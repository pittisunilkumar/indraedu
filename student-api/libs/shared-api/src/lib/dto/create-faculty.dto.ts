import {
  IsArray,
  IsBoolean,
  IsDate,
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

import type {
  UserKeyInterface,
  BankInterface,
  CourseInterface,
  FlagsInterface,
  SyllabusKeyInterface,
} from '@application/api-interfaces';

export class CreateFacultyDTO {
  @IsNotEmpty()
  @IsString()
  readonly uuid: string;

  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly gender: string;

  @IsNotEmpty()
  @IsString()
  readonly designation: string;

  /*@IsNotEmpty()
  @IsArray()
  readonly courses: CourseInterface[];

  @IsNotEmpty()
  @IsArray()
  readonly syllabus: SyllabusKeyInterface[];*/
  //@IsNotEmpty()
  // @IsArray()//cosmmented
  @IsOptional()
  @IsString()
  readonly courses: CourseInterface[];

  @IsOptional()
  // @IsArray() // commented
  @IsString()
  readonly syllabus: SyllabusKeyInterface[];

  @IsNotEmpty()
  @IsString()
  readonly imgUrl?: string;

  @IsNotEmpty()
  @IsObject()
  readonly bank: BankInterface;

  @IsNotEmpty()
  @IsString()
  readonly specialization: string;

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
