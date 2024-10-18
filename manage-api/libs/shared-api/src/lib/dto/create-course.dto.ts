import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

import {
  CourseFlagsInterface,
  FlagsInterface,
  SyllabusInterface,
  UserKeyInterface,
} from '@application/api-interfaces';

export class CreateCourseDTO {

  @IsNotEmpty()
  @IsString()
  readonly uuid: string;

  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsOptional()
  @IsString()
  readonly imgUrl?: string;

  @IsNotEmpty()
  @IsNumber()
  readonly order: number;

  // @IsOptional()
  // @IsArray()
  // readonly users: UserKeyInterface[];

  @IsNotEmpty()
  @IsArray()
  readonly syllabus: SyllabusInterface[];

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
  readonly flags: CourseFlagsInterface;
}
