import type { EntityInterface, TestAnswerInterface, UserKeyInterface, UserTestStatsInterface } from '@application/api-interfaces';
import { IsArray, IsDateString, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FeedbackListDto {

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