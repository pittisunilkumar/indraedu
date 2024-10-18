import {
  IsArray,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

import {
  FlagsInterface,
  KeyInterface,
  UserKeyInterface,
} from '@application/api-interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '0ba7596e-5087-4c72-887d-aaa730cdac23', description: 'Unique Identifier' })
  uuid: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Plato Architect', description: 'User name' })
  readonly name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'STUDENT',
    description: 'AWS S3/Cloudinary URL for the image'
  })
  readonly type: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ example: '2020-11-09T19:53:53.032Z', description: 'User Date of Birth' })
  readonly dob: Date;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'http://img-url',
    description: 'AWS S3/Cloudinary URL for the image'
  })
  readonly imgUrl?: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 9999999990, description: 'User Mobile' })
  readonly mobile: number;

  @IsOptional()
  @ApiProperty({ example: 'user@platononline.com', description: 'User Email' })
  readonly email: string;

  @IsOptional()
  // @IsArray()
  @ApiProperty({
    example: [{ uuid: '3457596e-5087-4c72-887d-aaa730cdac23', title: 'Sample Course' }],
    description: 'User Courses'
  })
  // readonly courses: KeyInterface[];
  readonly courses: any;

  @IsOptional()
  @IsArray()
  @ApiProperty({
    example: [{ uuid: '3457596e-5087-4c72-887d-aaa730cdac23', title: 'Full Package' }],
    description: 'User Subscriptions'
  })
  readonly subscriptions?: KeyInterface[];

  @IsOptional()
  @IsArray()
  @ApiProperty({
    example: [{ uuid: '3457596e-5087-4c72-887d-aaa730cdac23', title: 'Sample Organization' }],
    description: 'User Organizations'
  })
  readonly organizations: KeyInterface[];

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Plato College', description: 'User College' })
  readonly college: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'qwewqeqwe', description: 'User password' })
  password: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: '123456', description: 'OTP' })
  otp: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'MALE', description: 'User Gender' })
  readonly gender: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ example: '2020-11-09T19:53:53.032Z', description: 'Created On' })
  readonly createdOn: Date;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ example: '2020-11-12T19:53:53.032Z', description: 'Modified On' })
  readonly modifiedOn?: Date;

  @IsOptional()
  @IsObject()
  @ApiProperty({
    example: { uuid: '0ba7596e-5087-4c72-887d-aaa730cdac23', name: 'Krishna' },
    description: 'UUID & Name of the user created it'
  })
  readonly createdBy: UserKeyInterface;

  @IsOptional()
  @IsObject()
  @ApiProperty({
    example: { uuid: '0ba7596e-5087-4c72-887d-aaa730cdac23', name: 'Krishna' },
    description: 'UUID & Name of the user created it'
  })
  readonly modifiedBy?: UserKeyInterface;

  @IsOptional()
  @IsObject()
  @ApiProperty({
    example: { active: true, paid: true },
    description: 'flags to operate on the entity'
  })
  readonly flags: FlagsInterface;
}
