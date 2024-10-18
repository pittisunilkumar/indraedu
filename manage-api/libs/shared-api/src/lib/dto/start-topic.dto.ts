import { EntityInterface, EntityStatusEnum } from '@application/api-interfaces';
import { IsDate, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class StartTopicDTO {

  @IsNotEmpty()
  @IsObject()
  readonly course: EntityInterface;

  @IsNotEmpty()
  @IsObject()
  readonly topic: EntityInterface;

  @IsOptional()
  @IsObject()
  readonly subject: EntityInterface;

  @IsNotEmpty()
  @IsObject()
  readonly chapter: EntityInterface;

  @IsNotEmpty()
  @IsEnum(EntityStatusEnum)
  status: string;

  @IsNotEmpty()
  @IsDateString()
  readonly startedAt: Date;

}
