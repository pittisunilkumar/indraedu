import { EntityInterface, QuestionEntityInterface, EntityStatusEnum } from '@application/api-interfaces';
import { IsArray, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class StopTestDTO {

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
  @IsNumber()
  readonly elapsedTime: number;

  @IsNotEmpty()
  @IsDateString()
  readonly expiryDate: Date;

  @IsNotEmpty()
  @IsArray()
  readonly questions: QuestionEntityInterface[];

  @IsNotEmpty()
  @IsDateString()
  readonly stoppedAt: Date;

}
