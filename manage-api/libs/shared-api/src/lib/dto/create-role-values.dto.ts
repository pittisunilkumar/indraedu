import {
    IsEmail,
    IsNotEmpty,
    IsInt,
    IsString,
    IsEnum,
    IsArray,
    IsObject,
    IsBoolean,
    IsDate,
    IsOptional,
    IsDateString,
  } from 'class-validator';
  
  import {
    FlagsInterface,
    RoleSubModuleInterface,
    UserKeyInterface,
  } from '@application/api-interfaces';

  export class CreateRoleValuesDTO {
    @IsNotEmpty()
    @IsString()
    readonly uuid: string;
  
    @IsNotEmpty()
    @IsString()
    readonly title: string;

    @IsNotEmpty()
    @IsArray()
    readonly subModules: RoleSubModuleInterface[];

    @IsNotEmpty()
    @IsDateString()
    readonly createdOn: Date;

    @IsOptional()
    @IsDate()
    readonly modifiedOn?: Date;

    @IsNotEmpty()
    @IsObject()
    readonly createdBy: UserKeyInterface;

    @IsOptional()
    @IsObject()
    readonly modifiedBy?: UserKeyInterface;

    @IsNotEmpty()
    @IsObject()
    readonly flags: FlagsInterface;
  }