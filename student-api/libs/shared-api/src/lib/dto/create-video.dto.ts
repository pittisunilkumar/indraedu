import type{ FacultyInterface, SyllabusInterface, UserKeyInterface, VideoCheckpointsInterface, VideoFlagsInterface, VideoInterface, VideoSubjectInterface } from '@application/api-interfaces';
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

import {
  BankInterface,
  CourseInterface,
  FlagsInterface,
  SyllabusKeyInterface,
} from '@application/api-interfaces';
import { isObject } from 'util';

export class CreateVideoDTO {
  // @IsNotEmpty()
  // @IsString()
  // readonly uuid: string;

  @IsNotEmpty()
  @IsString()
  readonly videoSubjectUuid: string;

  @IsNotEmpty()
  @IsString()
  readonly chapter: string;

  @IsNotEmpty()
  @IsObject()
  readonly videos: VideoInterface[];

  // @IsNotEmpty()
  // @IsString()
  // readonly title: string;

  // @IsNotEmpty()
  // @IsString()
  // readonly totalTime: string;

  // @IsNotEmpty()
  // @IsString()
  // readonly videoId: string;



  // @IsOptional()
  // @IsString()
  // readonly youtubeUrl: string;

  // @IsNotEmpty()
  // @IsString()
  // readonly androidUrl: string;

  // @IsNotEmpty()
  // @IsString()
  // readonly iosUrl: string;

  // @IsNotEmpty()
  // @IsObject()
  // readonly subject: VideoSubjectInterface;
  // @IsNotEmpty()
  // @IsString()
  // readonly videoSubjectUuid: string;

  // // @IsNotEmpty()
  // // @IsObject()
  // // readonly chapter: { title: string; uuid: string; };
  // @IsNotEmpty()
  // @IsString()
  // readonly chapter: string;

  // @IsNotEmpty()
  // @IsObject()
  // readonly faculty?: FacultyInterface;

  // @IsNotEmpty()
  // @IsString()
  // readonly faculty: string;

  // @IsNotEmpty()
  // @IsArray()
  // readonly topics: VideoCheckpointsInterface[];

  // @IsOptional()
  // @IsArray()
  // readonly slides: string[];

  // @IsOptional()
  // @IsString()
  // readonly slides: string;

  // @IsOptional()
  // @IsString()
  // readonly notes: string;

  // @IsOptional()
  // @IsString()
  // readonly suggestedBanner?: string;

  // @IsNotEmpty()
  // @IsDateString()
  // readonly publishOn: Date;

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
  // readonly flags: VideoFlagsInterface;

}
