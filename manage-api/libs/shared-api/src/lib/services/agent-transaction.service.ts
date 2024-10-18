import { Injectable } from '@nestjs/common';
import { TagsInterface } from '@application/api-interfaces';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAgentTransactionsDTO } from '../dto/create-agent-transactions.dto';
import { Coupon } from '../schema/coupon.schema';
import { AgentTransactions } from '../schema/agent-transactions.schema';

@Injectable()
export class AgentTransactionsService {

  constructor(@InjectModel('AgentTransactions') private agentTransactionsModel: Model<AgentTransactions>,
    @InjectModel('Coupon') private couponsModel: Model<Coupon>) { }

  async create(createAgentTransactionsDTO: CreateAgentTransactionsDTO): Promise<AgentTransactions> {

    const createdTransaction = new this.agentTransactionsModel(createAgentTransactionsDTO);
    //let transactionId;
    let random = Math.floor(Math.random() * 10000000);

    let dateOfPayment = createdTransaction.dateOfPayment;
    let month = dateOfPayment.getMonth() + 1;
    let dt = dateOfPayment.getDate();
    let dt1: any;
    let month1: any;
    let currentYear = new Date().getFullYear();
    let year = currentYear.toString().split('');
    currentYear = parseInt(year[year.length - 2] + year[year.length - 1]);

    if (dt < 10) {
      dt1 = '0' + dt;
    } else { dt1 = dt }
    if (month < 10) {
      month1 = '0' + month;

    } else { month1 = month; }

    createdTransaction.transactionId = 'TXN' + random + 'D' + currentYear + month1 + dt1;
    const result = createdTransaction.save();
    if ((await result).paymentStatus == "SUCCESS") {
      if ((await result).couponId) {
        let couponId = (await result).couponId;
        let paidAmount = (await result).paidAmount;

        let couponData = await this.couponsModel.findOne({ _id: couponId });
        let agentDueAmount = couponData.agentDueAmount - paidAmount;
        this.couponsModel.findOneAndUpdate(
          { _id: couponId },
          {
            agentDueAmount: agentDueAmount,
          },
        ).exec();
      }
    }
    return result;
  }

  async getAgentTransactions(): Promise<AgentTransactions[]> {

    return this.agentTransactionsModel.find()
      .populate({
        path: "couponId",
        model: "Coupon",
        select: {
          "code": 1,
          "discountType": 1,
          "discount": 1,
          'agentTotalAmount': 1,
          'agentDueAmount': 1
        }
      })
      .populate({
        path: "agent",
        model: "Faculty",
        select: {
          "name": 1,
          "specialization": 1,
          "uuid": 1
        }
      })
      .sort({ dateOfPayment: 'DESC' })
      .exec();

  }
  // async findByUuid(uuid: string): Promise<Banner> {

  async AgentTransationsByUuid(id: string) {
    return await this.agentTransactionsModel.find({ agent: id })
      .populate({
        path: "couponId",
        model: "Coupon",
        select: {
          "code": 1,
          "discountType": 1,
          "discount": 1,
          'agentTotalAmount': 1,
          'agentDueAmount': 1

        }
      })
      .populate({
        path: "agent",
        model: "Faculty",
        select: {
          "name": 1,
          "specialization": 1,
          "uuid": 1
        }
      })
      .sort({ dateOfPayment: 'DESC' })
      .exec();

  }

  async findByUuid(uuid: string): Promise<AgentTransactions> {
    return this.agentTransactionsModel
      .findOne({ uuid })
      .populate({
        path: "couponId",
        model: "Coupon",
        select: {
          "code": 1,
          "discountType": 1,
          "discount": 1,
          'agentTotalAmount': 1,
          'agentDueAmount': 1
        }
      })
      .populate({
        path: "agent",
        model: "Faculty",
        select: {
          "name": 1,
          "specialization": 1,
          "uuid": 1
        }
      })
      .exec()
  }

  async getTransactionsDateFilter(transactionsInterface) {

    let fromDate = transactionsInterface.fromDate;
    let toDate = transactionsInterface.toDate;

    return this.agentTransactionsModel.find({
      dateOfPayment: {
        $gte: fromDate,
        $lte: toDate
      }
    })
    .populate({
      path: "couponId", 
      model:"Coupon", 
      select: {
        "code": 1,
        "discountType":1,
        "discount":1,
        'agentTotalAmount':1,
        'agentDueAmount':1

       }
    })
    .populate({
      path: "agent", 
      model:"Faculty", 
      select: {
        "name": 1,
        "specialization":1,
        "uuid":1
       }
    })
    .sort({ dateOfPayment: 'DESC' })
    .exec();

  }


}