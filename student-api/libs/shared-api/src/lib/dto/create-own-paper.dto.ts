import {
    CourseInterface,
    FlagsInterface,
    QBankFlagsInterface,
    QBankInterface,
    QBankSubjectChapterInterface,
    SyllabusInterface,
    UserKeyInterface,
    OwnPaperInterface
  } from '@application/api-interfaces';
  import {
    IsArray,
    IsDateString,
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsOptional,
    IsString,
  } from 'class-validator';
  
  export class CreateOwnPaperDto {

  @IsNotEmpty()
  @IsString()
  readonly userUuid: string;

  @IsNotEmpty()
  //@IsString()
  readonly exam: OwnPaperInterface[];
  
  

  }

