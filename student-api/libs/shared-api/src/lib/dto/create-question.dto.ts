import type { SyllabusInterface, UserKeyInterface ,QuestionAnswerInterface,QuestionFlagsInterface,
  QuestionOptionsInterface,} from '@application/api-interfaces';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

import {
  QuestionDifficultyEnum,
  QuestionTypeEnum,
} from '@application/api-interfaces';
import { ApiProperty } from '@nestjs/swagger';

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
  @IsDateString()
  @ApiProperty({ example: '2020-11-09T19:53:53.032Z', description: 'Created On' })
  readonly createdOn: Date;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ example: '2020-11-12T19:53:53.032Z', description: 'Modified On' })
  readonly modifiedOn?: Date;

  @IsNotEmpty()
  @IsObject()
  @ApiProperty({
    example: { uuid: '0ba7596e-5087-4c72-887d-aaa730cdac23', name: 'Krishna' },
    description: 'UUID & Name of the user created it'
  })
  readonly createdBy: UserKeyInterface;

  @IsOptional()
  @IsObject()
  @ApiProperty({
    example: { uuid: '0ba7596e-5087-4c72-887d-aaa730cdac23', name: 'Krishna' },
    description: 'UUID & Name of the user modified it'
  })
  readonly modifiedBy?: UserKeyInterface;

  @IsNotEmpty()
  @IsObject()
  readonly flags: QuestionFlagsInterface;
}
