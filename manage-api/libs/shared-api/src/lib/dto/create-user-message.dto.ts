import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateUserMessageDto {

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '0ba7596e-5087-4c72-887d-aaa730cdac23', description: 'Unique Identifier' })
  readonly uuid: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Krishna', description: 'User name' })
  readonly name: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 9999999990, description: 'User Mobile' })
  readonly mobile: number;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'user@platononline.com', description: 'User Email' })
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Say Hi', description: 'User Message' })
  readonly message: string;

}
