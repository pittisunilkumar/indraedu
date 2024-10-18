import { EntityInterface, TestAnswerInterface, UserKeyInterface, UserTestStatsInterface } from '@application/api-interfaces';
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
  @IsObject()
  readonly user: UserKeyInterface;

  @IsNotEmpty()
  @IsObject()
  readonly category: EntityInterface;

  @IsNotEmpty()
  @IsObject()
  readonly course: EntityInterface;

  @IsNotEmpty()
  @IsObject()
  readonly test: EntityInterface;

  @IsNotEmpty()
  @IsArray()
  readonly answers: TestAnswerInterface[];

  @IsOptional()
  @IsObject()
  stats: UserTestStatsInterface;

  @IsNotEmpty()
  @IsDateString()
  readonly submittedOn: Date;

}
