import {
  CourseInterface,
  SyllabusInterface,
  FlagsInterface,
  UserKeyInterface,
  VideoFlagsInterface,
  VideoSubjectChapterInterface,
} from '@application/api-interfaces';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateVideoSubjectDto {

  @IsNotEmpty()
  @IsString()
  readonly uuid: string;

  //@IsNotEmpty()
  @IsOptional()
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
  readonly chapters: VideoSubjectChapterInterface[];

  @IsNotEmpty()
  @IsString()
  readonly imgUrl?: string;

  @IsNotEmpty()
  @IsObject()
  readonly flags: VideoFlagsInterface;

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
