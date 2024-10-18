import {
    UserKeyInterface,
    objectInterface
  
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
 
 export class CreatelogsDto {

    @IsNotEmpty()
    @IsString()
    readonly moduleName: string;
  
    @IsNotEmpty()
    @IsString()
    readonly collectionName: string;
  
    @IsNotEmpty()
    @IsString()
    readonly documentId: string;

    @IsNotEmpty()
    @IsObject()
    readonly request: objectInterface;

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