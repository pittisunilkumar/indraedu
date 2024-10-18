import { CourseInterface, QBankFlagsInterface, QBankSubjectInterface, SyllabusInterface, TestCategoryInterface, TestFlagsInterface, TestInterface, TestQuestionInterface, UserKeyInterface } from '@application/api-interfaces';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateQBankDTO {

  @IsNotEmpty()
  @IsString()
  readonly chapter?: string;

  @IsNotEmpty()
  @IsString()
  readonly courses?: string;

  @IsOptional()
  @IsString()
  readonly subject?: string;

  // @IsOptional()
  // @IsString()
  // readonly iconUrl?: string;

  // @IsNotEmpty()
  // @IsString()
  // readonly description?: string;

  // @IsNotEmpty()
  // @IsObject()
  // readonly subject: QBankSubjectInterface;

  // @IsNotEmpty()
  // @IsObject()
  // readonly chapter: { title: string };

  // @IsNotEmpty()
  // @IsNumber()
  // order: number;

  // @IsNotEmpty()
  // @IsDateString()
  // scheduledDate: Date;

  // @IsOptional()
  // @IsString()
  // pdf?: string;

  // @IsNotEmpty()
  // @IsNumber()
  // count: number;

  // @IsNotEmpty()
  // @IsArray()
  // readonly questions: TestQuestionInterface[];

  @IsNotEmpty()
  @IsObject()
  readonly topics: TestInterface[];

  // @IsNotEmpty()
  // @IsDateString()
  // readonly createdOn: Date;

  // @IsOptional()
  // @IsDateString()
  // readonly modifiedOn?: Date;

  // @IsNotEmpty()
  // @IsObject()
  // readonly createdBy: UserKeyInterface;

  // @IsOptional()
  // @IsObject()
  // readonly modifiedBy?: UserKeyInterface;

  // @IsNotEmpty()
  // @IsObject()
  // readonly flags: QBankFlagsInterface;

}
