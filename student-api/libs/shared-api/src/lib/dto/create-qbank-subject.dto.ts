import type {
  CourseInterface,
  FlagsInterface,
  QBankFlagsInterface,
  QBankInterface,
  QBankSubjectChapterInterface,
  SyllabusInterface,
  UserKeyInterface,
} from '@application/api-interfaces';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateQBankSubjectDto {

  @IsNotEmpty()
  @IsString()
  readonly uuid: string;

  @IsOptional()
  // @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsNumber()
  readonly order: number;

  @IsNotEmpty()
  // @IsArray()//cosmmented
  @IsString()
  readonly courses: CourseInterface[];

  @IsNotEmpty()
  // @IsArray() // commented
  @IsString()
  readonly syllabus: SyllabusInterface[];

  @IsNotEmpty()
  @IsArray()
  readonly chapters: QBankSubjectChapterInterface[];

  @IsNotEmpty()
  @IsString()
  readonly imgUrl?: string;

  @IsNotEmpty()
  @IsObject()
  readonly flags: QBankFlagsInterface;

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
