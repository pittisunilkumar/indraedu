import type { CourseInterface, TestCategoryInterface, TestSeriesCategoryInterface, UserKeyInterface,FlagsInterface } from '@application/api-interfaces';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

// export class CreateTSCategoriesDTO {
  // @IsNotEmpty()
  // @IsString()
  // readonly uuid: string;

  // @IsNotEmpty()
  // @IsString()
  // readonly title: string;

  // @IsNotEmpty()
  // @IsArray()
  // readonly courses: CourseInterface[];

  // @IsNotEmpty()
  // @IsString()
  // readonly schedulePdf?: string;

  // @IsNotEmpty()
  // @IsNumber()
  // readonly order: number;

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
  // readonly flags: FlagsInterface;
// }

export class CreateTSCategoriesDTO {
  @IsNotEmpty()
  @IsString()
  readonly uuid: string;

  @IsNotEmpty()
  @IsObject()
  readonly categories: any;

  // @IsNotEmpty()
  // // @IsArray()
  // readonly categories: TestCategoryInterface;

  // @IsNotEmpty()
  // @IsString()
  // readonly title: string;


  @IsNotEmpty()
  //@IsArray()
  //readonly courses: CourseInterface[];
  @IsString()
  readonly courses: CourseInterface[];


  // @IsNotEmpty()
  // @IsString()
  // readonly schedulePdf?: string;

  // @IsNotEmpty()
  // @IsNumber()
  // readonly order: number;

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
