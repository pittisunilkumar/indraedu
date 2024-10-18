import {
    UserKeyInterface,
  
 } from '@application/api-interfaces';
 import {
   IsArray,
   IsBoolean,
   IsDateString,
   IsNotEmpty,
   IsNumber,
   IsObject,
   IsOptional,
   IsString,
 } from 'class-validator';
 
 export class CreateSuggestedQbankDto {

  @IsNotEmpty()
  @IsString()
  readonly courseId: string;

  @IsNotEmpty()
  @IsString()
  readonly subjectId: string;

  @IsNotEmpty()
  @IsString()
  readonly chapterId: string;

  @IsNotEmpty()
  @IsString()
  readonly qbankUuid: string;

  @IsNotEmpty()
  @IsBoolean()
  readonly status: boolean;

  @IsOptional()
  @IsDateString()
  readonly createdOn: Date;

  @IsOptional()
  @IsDateString()
  readonly modifiedOn?: Date;

  @IsOptional()
  @IsObject()
  readonly createdBy: UserKeyInterface;

  @IsOptional()
  @IsObject()
  readonly modifiedBy?: UserKeyInterface;

}