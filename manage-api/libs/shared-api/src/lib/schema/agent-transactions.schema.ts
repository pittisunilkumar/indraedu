import {
    BankInterface,
    FlagsInterface,
    ModeOfPaymentEnum,
    PaymentStatusEnum,
    UserKeyInterface,
  } from '@application/api-interfaces';
import { User,Subscription, Coupon } from '@application/shared-api';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';

  @Schema()
export class AgentTransactions extends mongoose.Document {
  @Prop({ required: true })
  @ApiProperty({ example: '0ba7596e-5087-4c72-887d-aaa730cdac23', description: 'Unique Identifier' })
  uuid: string;

   @Prop({ type: String ,required: false })
   @ApiProperty({ example: '5fa90d866rttry3001021fd', description: 'Transaction ID' })
   transactionId: string;

  @Prop({required: true,type: Date})
  @ApiProperty({ example: '2020-11-09T19:53:53.032Z', description: 'Date Of Payment' })
  dateOfPayment?: Date;

  @Prop({required: true})
  @ApiProperty({ example: '4000', description: 'Final Paid Amount' })
  paidAmount?: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId,required: true })
  @ApiProperty({ example: '5fa90d866rttry3001021fd', description: 'Coupon ID' })
  couponId: String;

  @Prop({ type: mongoose.Schema.Types.ObjectId,required: true })
  @ApiProperty({ example: '5fa90d866rttry3001021fd', description: 'Coupon ID' })
  agent: String;

  @Prop({required: true,type: String,})
  @ApiProperty({ example: 'RAZORPAY', description: 'RAZORPAY/CASH/CHEQUE/POS-MACHINE/UPI' })
  modeOfPayment: ModeOfPaymentEnum;

  @Prop({required: false,type: String})
  @ApiProperty({ example: 'image.png', description: 'File Path' })
  filePath: string;

  @Prop({required: true,type: String})
  @ApiProperty({ example: 'ORDERCREATED', description: 'ORDERCREATED/PENDING/SUCCESS/FAILED' })
  paymentStatus: PaymentStatusEnum;

//   @Prop({required: false,type: String})
//   @ApiProperty({ example: 'payment successfull', description: 'payment successfull' })
//   paymentMessage: string;

  @Prop({required: false,type: String})
  @ApiProperty({ example: '123456', description: 'BILL NO' })
  billNumber: string;
 
  @Prop({required: false,type: String})
  @ApiProperty({ example: 'AB1234CD56', description: 'CHEQUE NO' })
  chequeNumber: string;

  @Prop({required: false,type: Date})
  @ApiProperty({ example: 'AB1234CD56', description: 'CHEQUE NO' })
  chequeDate: Date;

  @Prop({ required: true, type: Object })
  bank: BankInterface;

  @Prop({required: false,type: String})
  @ApiProperty({ example: 'TX12586', description: 'Reference Nummber' })
  referenceNumber: String;

  @Prop({required: false,type: String})
  @ApiProperty({ example: 'YU4552TR', description: 'UPI ID' })
  upiId: String;

  @Prop({required: false,type: String})
  @ApiProperty({ example: 'YU4552TR123', description: 'Mode TransactionNumber ID' })
  mode_transactionNumber: String;


  @Prop({required: false,type: Date})
  @ApiProperty({ example: '2020-11-12T19:53:53.032Z', description: 'Modified On' })
  modifiedOn?: Date;

  @Prop({ required: true, type: Object })
  @ApiProperty({
    example: { uuid: '0ba7596e-5087-4c72-887d-aaa730cdac23', name: 'Krishna' },
    description: 'UUID & Name of the user created it'
  })
  createdBy: UserKeyInterface;

  @Prop({ type: Object })
  @ApiProperty({
    example: { uuid: '0ba7596e-5087-4c72-887d-aaa730cdac23', name: 'Krishna' },
    description: 'UUID & Name of the user modified it'
  })
  modifiedBy: UserKeyInterface;

}

export const AgentTransactionsSchema = SchemaFactory.createForClass(AgentTransactions);
AgentTransactionsSchema.set('validateBeforeSave', true);