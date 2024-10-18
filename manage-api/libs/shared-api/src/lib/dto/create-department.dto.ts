import {
    IsArray,
    IsDateString,
    IsNotEmpty,
    IsObject,
    IsOptional,
    IsString,
  } from 'class-validator';
  
  import {
    UserKeyInterface,
  } from '@application/api-interfaces';
  import { ApiProperty } from '@nestjs/swagger';
  
  export class CreateDepartmentDto {
  
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: '0ba7596e-5087-4c72-887d-aaa730cdac23', description: 'Unique Identifier' })
    uuid: string;
  
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'Plato Architect', description: 'User name' })
    readonly title: string;
  
    @IsNotEmpty()
    @IsArray()
    employee: string[];
  
    @IsNotEmpty()
    @IsArray()
    hod: string;
  
    @IsNotEmpty()
    @IsDateString()
    readonly createdOn: Date;
  
    @IsOptional()
    @IsDateString()
    readonly modifiedOn?: Date;
  
    @IsNotEmpty()
    @IsObject()
    readonly createdBy: UserKeyInterface;
  
    @IsOptional()
    @IsObject()
    readonly modifiedBy?: UserKeyInterface;
  
    @IsNotEmpty()
    @IsObject()
    readonly flags: any;
  }
  