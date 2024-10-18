import { Injectable } from '@nestjs/common';
import {TagsInterface } from '@application/api-interfaces'; 
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserTransactionsDTO } from '../dto/create-transactions.dto';
import { UserTransactions } from '../schema/user-transactions.schema';
import { Coupon } from '../schema/coupon.schema';

@Injectable()
export class UserTransactionsService {

  constructor(@InjectModel('UserTransactions') private userTransactionsModel: Model<UserTransactions>,
  @InjectModel('Coupon') private couponsModel: Model<Coupon>) { }

  async create(createUserTransactionsDTO: CreateUserTransactionsDTO): Promise<UserTransactions> {

    const createdTransaction = new this.userTransactionsModel(createUserTransactionsDTO);
    //console.log('createdTransaction',createdTransaction);
    //let transactionId;
    let random= Math.floor(Math.random() * 100000);

    let dateOfPayment=createdTransaction.dateOfPayment;
    let year = dateOfPayment.getFullYear();
    let month = dateOfPayment.getMonth()+1;
    let dt = dateOfPayment.getDate();
    let dt1: any;
    let month1: any;
    
     if (dt < 10) {
        dt1 = '0'+ dt;
     }else{ dt1= dt}
     if (month < 10) {
       month1 = '0' + month;

     }else{ month1= month;}
     
    createdTransaction.transactionId='TXN'+random+'D'+year+month1+dt1;
    const result = createdTransaction.save();
    if((await result).paymentStatus == "SUCCESS"){
      if((await result).couponId != ''){
        let couponId= (await result).couponId;
     

          this.couponsModel.findOneAndUpdate(
            { _id: couponId }, 
            { $inc: { 'availableCoupons': -1 }}
            ).exec();

          
      }
   }
    console.log('added transaction', result);

    return result;
  }

  async getUserTransactions(): Promise<UserTransactions[]>{

    return this.userTransactionsModel.find()
    .populate({
      path: "userId", 
      model:"User", 
      select: {
        "name": 1,
        "mobile":1

       }
    })
    .populate({
      path: "subscriptionId", 
      model:"Subscription", 
      select: {
        "title": 1,
       }
    })
    .populate({
      path: "couponId", 
      model:"Coupon", 
      select: {
        "code": 1,
        "discountType":1,
        "discount":1

       }
    })
    
    .exec();

  }

  async getTransactionsDateFilter(transactionsInterface){

    let fromDate =transactionsInterface.fromDate;
    let toDate =transactionsInterface.toDate;
 
    return this.userTransactionsModel.find( {
     dateOfPayment : {
       $gte: fromDate,
       $lte: toDate
   } } ).exec();
 
   }


}