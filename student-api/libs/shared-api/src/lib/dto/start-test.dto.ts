import { ObjectId } from 'mongoose';
import type { EntityInterface } from '@application/api-interfaces';
import {  EntityStatusEnumForTestSeries } from '@application/api-interfaces';
import { IsDate, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class StartTestDTO {

  @IsNotEmpty()
  @IsString()
  readonly courseId: ObjectId;

  @IsNotEmpty()
  @IsString()
  readonly categoryUuid: string;

  @IsOptional()
  @IsString()
  readonly subjectId: ObjectId;

  @IsNotEmpty()
  @IsString()
  readonly testSeriesUuid: string;

  @IsNotEmpty()
  @IsEnum(EntityStatusEnumForTestSeries)
  status: string;

  @IsNotEmpty()
  @IsNumber()
  readonly totalTime: number;

  @IsNotEmpty()
  @IsDateString()
  readonly expiryDate: Date;

  @IsNotEmpty()
  @IsDateString()
  readonly startedAt: Date;

}
