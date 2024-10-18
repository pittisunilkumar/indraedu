import {
  CourseInterface,
  SyllabusFlagsInterface,
  SyllabusKeyInterface,
  SyllabusTypeEnum,
  UserKeyInterface,
} from '@application/api-interfaces';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateSyllabusDto {
  @IsNotEmpty()
  @IsString()
  readonly uuid: string;

  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsEnum(SyllabusTypeEnum)
  readonly type: string;

  @IsNotEmpty()
  @IsString()
  readonly shortcut: string;

  @IsNotEmpty()
  @IsNumber()
  readonly order: number;

  @IsOptional()
  @IsString()
  readonly imgUrlVideos?: string;

  @IsOptional()
  @IsString()
  readonly suggestedBanner?: string;

  @IsOptional()
  @IsString()
  readonly imgUrlQBank?: string;

  @IsOptional()
  @IsArray()
  readonly parents?: SyllabusKeyInterface[];

  @IsOptional()
  @IsArray()
  readonly children?: SyllabusKeyInterface[];

  @IsNotEmpty()
  @IsObject()
  readonly flags: SyllabusFlagsInterface;

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

}
