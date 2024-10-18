import type{ UserQBankTopicStatsInterface } from './../../../../api-interfaces/src/lib/submit-user-qbank-topic-interface';
import type { EntityInterface, QBankTopicAnswerInterface, UserKeyInterface, UserTestStatsInterface } from '@application/api-interfaces';
import { IsArray, IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString ,IsDate} from 'class-validator';

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

  @IsOptional()
  @IsNumber()
  lastAttemptedQuestion: number;

  @IsNotEmpty()
  @IsString()
  readonly userId: string;

  @IsNotEmpty()
  @IsString()
  readonly subjectId: string;

  @IsNotEmpty()
  @IsString()
  readonly courseId: string;

  @IsNotEmpty()
  @IsString()
  readonly qbankTopicUuid: string;


  @IsNotEmpty()
  @IsArray()
  readonly answers: QBankTopicAnswerInterface[];

  @IsOptional()
  @IsObject()
  stats: UserQBankTopicStatsInterface;

  @IsOptional()
  @IsNumber()
  status: number;

  @IsNotEmpty()
  @IsDateString()
  startedAt: Date;

  @IsNotEmpty()
  @IsDateString()
  stoppedAt: Date;

  @IsNotEmpty()
  @IsDateString()
  readonly submittedOn: Date;

}
