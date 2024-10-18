import { EntityInterface, EntityStatusEnum, QuestionEntityInterface } from '@application/api-interfaces';
import { IsArray,IsString, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional } from 'class-validator';

export class StopTopicDTO {

  // @IsNotEmpty()
  // @IsObject()
  // readonly course: EntityInterface;

  @IsNotEmpty()
  @IsString()
  readonly qbankTopicUuid: string;

  // @IsOptional()
  // @IsObject()
  // readonly subject: EntityInterface;

  // @IsNotEmpty()
  // @IsObject()
  // readonly chapter: EntityInterface;

  @IsNotEmpty()
  @IsNumber()
  status: number;

  // @IsNotEmpty()
  // @IsArray()
  // readonly questions: QuestionEntityInterface[];

  @IsNotEmpty()
  @IsDateString()
  readonly stoppedAt: Date;
  startedAt: string;

}
