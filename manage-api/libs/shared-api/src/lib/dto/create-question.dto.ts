import { SyllabusInterface, UserKeyInterface } from '@application/api-interfaces';
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
  QuestionAnswerInterface,
  QuestionDifficultyEnum,
  QuestionFlagsInterface,
  QuestionOptionsInterface,
  QuestionTypeEnum,
  matchLeftOptionsInterface,
  matchRightOptionsInterface,
} from '@application/api-interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class CreateQuestionDto {
  @IsNotEmpty()
  @IsString()
  readonly uuid: string;

  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsOptional()
  shortTitle:string

  @IsNotEmpty()
  @IsEnum(QuestionTypeEnum)
  readonly type: string;

  // @IsArray()
  @IsOptional()
  readonly options: QuestionOptionsInterface[];

  @IsOptional()
  @IsArray()
  readonly matchLeftSideOptions: matchLeftOptionsInterface[];

  @IsOptional()
  @IsArray()
  readonly matchRightSideOptions: matchRightOptionsInterface[];

  @IsOptional()
  @IsString()
  readonly imgUrl: string;

  @IsOptional()
  @IsString()
  readonly descriptionImgUrl: string;


  @IsNotEmpty()
 // @IsString()
  readonly mathType: string;


  @IsOptional()
  @IsString()
  readonly previousAppearances: string;

  @IsOptional()
  //@IsString()
  readonly tags: string;

  @IsNotEmpty()
  @IsEnum(QuestionDifficultyEnum)
  readonly difficulty: string;

  @IsNotEmpty()
  @IsArray()
  readonly syllabus: SyllabusInterface[];

  @IsOptional()
 // @IsArray()
  readonly perals: any;

  // @IsObject()
  @IsOptional()
  readonly answer: QuestionAnswerInterface;

  @IsOptional()
  readonly matchAnswer:[];

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
