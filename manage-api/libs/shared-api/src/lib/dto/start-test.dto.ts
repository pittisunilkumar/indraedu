import { EntityInterface, EntityStatusEnum } from '@application/api-interfaces';
import { IsDate, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class StartTestDTO {

  @IsNotEmpty()
  @IsObject()
  readonly course: EntityInterface;

  @IsNotEmpty()
  @IsObject()
  readonly test: EntityInterface;

  @IsOptional()
  @IsObject()
  readonly subject: EntityInterface;

  @IsNotEmpty()
  @IsObject()
  readonly category: EntityInterface;

  @IsNotEmpty()
  @IsEnum(EntityStatusEnum)
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
