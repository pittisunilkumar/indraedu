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
    
    PeralInputSubjectInterface
  } from '@application/api-interfaces';
  import { ApiProperty } from '@nestjs/swagger';

  export class CreatePearlSubjectsDto {
    @IsNotEmpty()
    @IsString()
    readonly uuid: string;



    @IsNotEmpty()
    @IsArray()
    readonly subject: PeralInputSubjectInterface[];
    
    @IsOptional()
    // @IsDateString()
    readonly createdOn: Date;

    @IsOptional()
    @IsDateString()
    readonly modifiedOn?: Date;

    @IsOptional()
    // @IsObject()
    readonly createdBy: UserKeyInterface;

    @IsOptional()
    @IsObject()
    readonly modifiedBy?: UserKeyInterface;


  }