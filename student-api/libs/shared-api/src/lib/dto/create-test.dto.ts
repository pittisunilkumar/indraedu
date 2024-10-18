import type { CourseInterface, SyllabusInterface, TestCategoryInterface, TestFlagsInterface, TestQuestionInterface, UserKeyInterface } from '@application/api-interfaces';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTestDTO {

  @IsNotEmpty()
  @IsString()
  readonly uuid: string;

  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  readonly imgUrl?: string;

  @IsNotEmpty()
  @IsString()
  readonly description?: string;

  @IsNotEmpty()
  @IsArray()
  readonly courses: CourseInterface[];

  @IsNotEmpty()
  @IsArray()
  readonly categories: TestCategoryInterface[];

  @IsNotEmpty()
  @IsArray()
  readonly subjects: SyllabusInterface[];

  @IsNotEmpty()
  @IsNumber()
  order: number;

  @IsNotEmpty()
  @IsString()
  time: string;

  @IsNotEmpty()
  @IsDateString()
  scheduledDate: Date;

  @IsNotEmpty()
  @IsDateString()
  expiryDate: Date;

  @IsNotEmpty()
  @IsString()
  pdf: string;

  @IsNotEmpty()
  @IsNumber()
  count: number;

  @IsNotEmpty()
  @IsArray()
  readonly questions: TestQuestionInterface[];

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
  readonly flags: TestFlagsInterface;

}
