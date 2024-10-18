import { EntityInterface, EntityStatusEnum } from '@application/api-interfaces';
import { IsDate, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class StartTopicDTO {

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

  @IsNotEmpty()
  @IsDateString()
  readonly startedAt: Date;

}
