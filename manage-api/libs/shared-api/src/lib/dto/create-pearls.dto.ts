import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

import {
  UserKeyInterface,
  FlagsInterface,
  PearlsQueIdsInterface,
  PeralSubjectInterface
} from '@application/api-interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePearlsDto {
  @IsNotEmpty()
  @IsString()
  readonly uuid: string;

  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  readonly explaination: string;


  @IsOptional()
  @IsNumber()
  number : number;

@IsNotEmpty()
@IsArray()
readonly queIds: PearlsQueIdsInterface[];

@IsNotEmpty()
@IsDateString()
@ApiProperty({ example: '2020-11-09T19:53:53.032Z', description: 'Created On' })
readonly createdOn: Date;

@IsOptional()
@IsDateString()
@ApiProperty({ example: '2020-11-12T19:53:53.032Z', description: 'Modified On' })
readonly modifiedOn?: Date;

@IsNotEmpty()
@IsObject()
@ApiProperty({
  example: { uuid: '0ba7596e-5087-4c72-887d-aaa730cdac23', name: 'Krishna' },
  description: 'UUID & Name of the user created it'
})
readonly createdBy: UserKeyInterface

@IsOptional()
@IsObject()
@ApiProperty({
  example: { uuid: '0ba7596e-5087-4c72-887d-aaa730cdac23', name: 'Krishna' },
  description: 'UUID & Name of the user modified it'
})
readonly modifiedBy?: UserKeyInterface;

@IsNotEmpty()
@IsObject()
readonly flags: FlagsInterface;
}