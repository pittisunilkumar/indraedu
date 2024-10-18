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
    UserKeyInterface,
    rolePermissionsInterface
  } from '@application/api-interfaces';

  export class CreateRolesDTO {
    @IsNotEmpty()
    @IsString()
    readonly uuid: string;
  
    @IsNotEmpty()
    @IsString()
    readonly title: string;

    @IsNotEmpty()
    @IsArray()
    readonly rolePermissions: rolePermissionsInterface[];

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
    readonly flags: FlagsInterface;
  }