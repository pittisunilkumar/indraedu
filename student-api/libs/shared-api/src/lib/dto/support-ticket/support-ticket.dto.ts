import type { EntityInterface, TestAnswerInterface, UserKeyInterface, UserTestStatsInterface } from '@application/api-interfaces';
import { IsArray, IsDateString, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DepartmentListDto {

    @ApiProperty({
        example:  [{
            "_id": "62f7666b5929ed38603fe6c6",
            "uuid": "cc5f84a9-d6dd-4eef-b734-077c0588508c",
            "title": "IT DEP"
      }],
        description: 'Department List'
      })
      data : []
}


export class OpenNewTicketDto {

    @ApiProperty({
        type: String,
        description: "The Department ID"
    })
    @IsNotEmpty()
    @IsString()
    department: string;

    @ApiProperty({
        type: String,
        description: "message"
    })
    @IsNotEmpty()
    @IsString()
    message: string;


    @ApiProperty({
        type: String,
        description: "message"
    })
    @IsNotEmpty()
    priority: String;

    @ApiProperty({
        type: Number,
        description: "Number"
    })
    @IsNotEmpty()
    type: Number;
    
    @ApiProperty({
        type: [String],
        description: "Images"
    })
    @IsOptional()
    image: [String,String];

    @ApiProperty({
        type: [String,String],
        description: "Audio files"
    })
    @IsOptional()
    audio: [String, String];
}
