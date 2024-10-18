import {
    IsArray,
    IsDateString,
    IsEnum,
    IsNotEmpty,
    IsObject,
    IsOptional,
    IsString,
  } from 'class-validator';

  import type {
    UserKeyInterface,
    FlagsInterface,
    PearlsQueIdsInterface
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
    readonly subjectUuid: string;

    @IsNotEmpty()
    @IsString()
    readonly topicUuid: string;


    @IsOptional()
    @IsArray()
    readonly queUuids: PearlsQueIdsInterface[];

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
