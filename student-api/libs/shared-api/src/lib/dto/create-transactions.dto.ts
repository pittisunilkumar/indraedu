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
  } from 'class-validator';

  import type {
    FlagsInterface,
    UserKeyInterface,
  } from '@application/api-interfaces';

  export class CreateUserTransactionsDTO {

    @IsNotEmpty()
    @IsString()
    readonly uuid: string;

    @IsNotEmpty()
    @IsString()
    readonly userId: string;

    @IsOptional()
    readonly transactionId: string;

    @IsNotEmpty()
    @IsString()
    readonly subscriptionId: string;

    @IsNotEmpty()
    //@IsDate()
    readonly dateOfPayment: Date;

    @IsNotEmpty()
    //@IsDate()
    readonly expiryDate: Date;

    @IsNotEmpty()
    @IsNumber()
    readonly actualPrice: Number;

    @IsOptional()
    @IsNumber()
    readonly discountPrice: Number;

    @IsNotEmpty()
    @IsNumber()
    readonly finalPaidAmount: Number;

    @IsOptional()
    //@IsString()
    readonly couponId: String;

    @IsNotEmpty()
    @IsString()
    readonly paymentType: String;

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
    readonly razorpayOrderId: String;

    @IsOptional()
    @IsString()
    readonly razorPayPaymentId: String;

    @IsOptional()
    @IsString()
    readonly razoraySignature: String;

    @IsOptional()
    @IsString()
    readonly paymentMessage: String;

    @IsOptional()
    @IsString()
    readonly billNumber: String;

    @IsOptional()
    @IsString()
    readonly chequeNumber: String;

    @IsOptional()
    //@IsDate()
    readonly chequeDate: Date;

    @IsOptional()
    @IsString()
    readonly bankName: String;

    @IsOptional()
    @IsString()
    readonly referenceNumber: String;

    @IsOptional()
    @IsString()
    readonly CardType: String;

    @IsOptional()
    @IsString()
    readonly creditORdebitCard: String;


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
