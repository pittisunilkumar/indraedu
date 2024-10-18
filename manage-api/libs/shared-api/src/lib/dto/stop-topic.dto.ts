import { EntityInterface, EntityStatusEnum, QuestionEntityInterface } from '@application/api-interfaces';
import { IsArray, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional } from 'class-validator';

export class StopTopicDTO {

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
  @IsArray()
  readonly questions: QuestionEntityInterface[];

  @IsNotEmpty()
  @IsDateString()
  readonly stoppedAt: Date;

}
