import type { EntityInterface, TestAnswerInterface, UserKeyInterface, UserTestStatsInterface } from '@application/api-interfaces';
import { IsArray, IsDateString, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class ReportErrorDTO {

  @IsNotEmpty()
  @IsString()
  uuid: string;

  @IsNotEmpty()
  @IsObject()
  readonly question: EntityInterface;

  @IsNotEmpty()
  @IsObject()
  readonly course: EntityInterface;

  @IsNotEmpty()
  @IsObject()
  readonly test: EntityInterface;

  @IsNotEmpty()
  @IsObject()
  readonly user: EntityInterface;

  @IsNotEmpty()
  @IsObject()
  readonly subject: EntityInterface;

  @IsNotEmpty()
  @IsArray()
  readonly report: string[];

  @IsNotEmpty()
  @IsDateString()
  readonly submittedOn: Date;

}
