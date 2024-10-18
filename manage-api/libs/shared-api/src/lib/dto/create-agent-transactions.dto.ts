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
    IsNumber,
    isNotEmpty,
  } from 'class-validator';
  
  import {
      BankInterface,
    FlagsInterface,
    UserKeyInterface,
  } from '@application/api-interfaces';

  export class CreateAgentTransactionsDTO {

    @IsNotEmpty()
    @IsString()
    readonly uuid: string;


    @IsOptional()
    readonly transactionId: string;


    @IsNotEmpty()
    //@IsDate()
    readonly dateOfPayment: Date;

    

    @IsNotEmpty()
    @IsNumber()
    readonly paidAmount: Number;

    @IsNotEmpty()
    //@IsString()
    readonly couponId: String;

    @IsNotEmpty()
    //@IsString()
    readonly agent: String;


    @IsNotEmpty()
    @IsString()
    readonly modeOfPayment: String;

    @IsOptional()
    @IsString()
    readonly filePath: String;

    @IsNotEmpty()
    @IsString()
    readonly paymentStatus: String;


    @IsOptional()
    @IsString()
    readonly billNumber: String;

    @IsOptional()
    @IsString()
    readonly chequeNumber: String;

    @IsOptional()
    //@IsDate()
    readonly chequeDate: Date;

    @IsNotEmpty()
    @IsObject()
    readonly bank: BankInterface;
  

    @IsOptional()
    @IsString()
    readonly referenceNumber: String;
    
    @IsOptional()
    @IsString()
    mode_transactionNumber:String;

    @IsOptional()
    @IsString()
    readonly upiId: String;

    @IsNotEmpty()
    @IsObject()
    readonly createdBy: UserKeyInterface;

    @IsOptional()
    @IsDateString()
    readonly modifiedOn?: Date;

    @IsOptional()
    @IsObject()
    readonly modifiedBy?: UserKeyInterface;
  }