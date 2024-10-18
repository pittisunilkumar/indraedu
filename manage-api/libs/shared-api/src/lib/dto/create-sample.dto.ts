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

import {
  FlagsInterface,
  CourseInterface,
  UserKeyInterface,
} from '@application/api-interfaces';

export class CreateSampleDTO {
  @IsNotEmpty()
  @IsString()
  readonly uuid: string;

  @IsNotEmpty()
  @IsString()
  readonly title: string;
}
