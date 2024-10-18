import { CouponInterface } from '@application/api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCouponDTO } from '../dto';
import { Coupon } from '../schema/coupon.schema';

@Injectable()
export class CouponsService {
  constructor(@InjectModel('Coupon') private couponsModel: Model<Coupon>) {}

  async create(createCouponsDTO: CreateCouponDTO): Promise<Coupon> {
    const createdCoupon = new this.couponsModel(createCouponsDTO);
    const result = createdCoupon.save();
    console.log('added banner', result);
    return result;
  }

  async findAll(): Promise<Coupon[]> {
    return this.couponsModel.find().populate({
      path: 'subscription',  
      select: {
        "title": 1,
       }
    }).exec();
  }

  async findByUuid(uuid: string): Promise<Coupon> {
    return this.couponsModel.findOne({ uuid })
    .populate({
      path: 'subscription',  
      select: {
        // "title": 1,
        "uuid":1,
        "actual":1
       }
    })
    .populate({
      path: 'agent',  
      select: {
        // "name": 1,
        "uuid":1
       }
    })
    .populate({
      path: 'users',  
      select: {
        "name": 1,
        "mobile": 1,
       }
    }).exec();
  }

  async deleteByUuid(uuid: string) {
    return this.couponsModel.findOneAndDelete({ uuid }).exec();
  }

  async editCouponByUuid(
    uuid: string,
    request: CouponInterface
  ): Promise<Coupon> {
    return this.couponsModel.findOneAndUpdate({ uuid }, request).exec();
  }

  async getCouponsByAgentId(agentId: string): Promise<Coupon[]> {
    return this.couponsModel.find({agent:agentId}).exec();
  }
}
