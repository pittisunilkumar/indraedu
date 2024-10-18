import { CareersFlagsInterface, DepartmentENum, SkillsInterface, UserKeyInterface } from '@application/api-interfaces';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateJobDTO {
  @IsNotEmpty()
  @IsString()
  readonly uuid: string;

  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  readonly designation: string;

  @IsNotEmpty()
  @IsEnum(DepartmentENum)
  readonly department: string;

  @IsNotEmpty()
  @IsString()
  readonly code: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsNotEmpty()
  @IsArray()
  readonly qualifications: string[];

  @IsNotEmpty()
  @IsString()
  readonly requirements: string;

  @IsNotEmpty()
  @IsObject()
  readonly skills: SkillsInterface;

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
  readonly flags: CareersFlagsInterface;
}
