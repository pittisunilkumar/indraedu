import { SyllabusInterface } from '@application/api-interfaces';
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
} from 'class-validator';

import {
  QuestionTypeEnum,
  QuestionOptionsInterface,
  QuestionDifficultyEnum,
  QuestionClassficationInterface,
  QuestionFlagsInterface,
  QuestionAnswerInterface,
} from '@application/api-interfaces';

export class CreateQuestionDto {
  @IsNotEmpty()
  @IsString()
  readonly uuid: string;

  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsEnum(QuestionTypeEnum)
  readonly type: string;

  // @IsArray()
  readonly options: QuestionOptionsInterface[];

  @IsOptional()
  @IsString()
  readonly imgUrl: string;

  @IsOptional()
  @IsString()
  readonly previousAppearances: string;

  @IsOptional()
  @IsString()
  readonly tags: string;

  @IsNotEmpty()
  @IsEnum(QuestionDifficultyEnum)
  readonly difficulty: string;

  @IsNotEmpty()
  @IsArray()
  readonly syllabus: SyllabusInterface[];

  // @IsObject()
    readonly answer: QuestionAnswerInterface;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsNotEmpty()
  @IsObject()
  readonly flags: QuestionFlagsInterface;

  @IsNotEmpty()
  @IsString()
  readonly createdOn: String;

  @IsOptional()
  @IsString()
  readonly modifiedOn?: String;
}
