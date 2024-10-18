import { EntityInterface, QBankTopicAnswerInterface, UserKeyInterface, UserTestStatsInterface } from '@application/api-interfaces';
import { IsArray, IsDateString, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class SubmitUserQBankTopicDTO {

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
  readonly subject: EntityInterface;

  @IsNotEmpty()
  @IsObject()
  readonly course: EntityInterface;

  @IsNotEmpty()
  @IsObject()
  readonly topic: EntityInterface;

  @IsNotEmpty()
  @IsArray()
  readonly answers: QBankTopicAnswerInterface[];

  @IsOptional()
  @IsObject()
  stats: UserTestStatsInterface;

  @IsNotEmpty()
  @IsDateString()
  readonly submittedOn: Date;

}
