import type { EntityInterface, TestAnswerInterface, UserKeyInterface, UserTestStatsInterface } from '@application/api-interfaces';
import { IsArray, IsDateString, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class SubmitUserTestDTO {

  @IsNotEmpty()
  @IsString()
  uuid: string;

  @IsOptional()
  @IsNumber()
  count: number;

  @IsOptional()
  @IsNumber()
  rank: number;

  @IsOptional()
  @IsNumber()
  totalUsers: number;

  @IsNotEmpty()
  @IsString()
  readonly userId: string;

  @IsNotEmpty()
  @IsString()
  readonly categoryUuid: string;
  // @IsNotEmpty()
  // @IsObject()
  // readonly category: EntityInterface;

  @IsNotEmpty()
  @IsString()
  readonly courseId: string;

  @IsNotEmpty()
  @IsString()
  readonly testSeriesUuid: string;

  @IsNotEmpty()
  @IsString()
  readonly subjectId: string;

  @IsNotEmpty()
  @IsArray()
  readonly answers: TestAnswerInterface[];

  @IsOptional()
  @IsObject()
  stats: UserTestStatsInterface;

  @IsNotEmpty()
  @IsNumber()
  status: number;

  @IsOptional()
  @IsNumber()
  lastAttemptedQuestion: number;

  @IsNotEmpty()
  @IsDateString()
  readonly submittedOn: Date;

}
