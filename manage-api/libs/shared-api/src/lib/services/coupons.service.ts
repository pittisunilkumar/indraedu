import { CouponInterface } from '@application/api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCouponDTO } from '../dto';
import { Coupon } from '../schema/coupon.schema';
import { Course, Subscription } from '../schema';

@Injectable()
export class CouponsService {
  constructor(
    @InjectModel('Coupon') private couponsModel: Model<Coupon>,
    @InjectModel('Course') private courseModel: Model<Course>,
    @InjectModel('Subscription') private subscriptionModel: Model<Subscription>,

  ) {}

  async create(createCouponsDTO: CreateCouponDTO): Promise<Coupon> {
    const createdCoupon = new this.couponsModel(createCouponsDTO);
    const result = createdCoupon.save();
    console.log('added banner', result);
    return result;
  }

  async findAll(employee) {
     const courseListIds = [];
     const subscriptionsIds = []
    const empCourses = await this.courseModel.find({organizations:{$in:employee.organizations}},{_id:true})
    empCourses.forEach(element => {
      courseListIds.push(element._id)
    });
    const subscriptions = await this.subscriptionModel.find({courses:{$in:courseListIds}}, {_id: true })
    subscriptions.forEach(element => {
      subscriptionsIds.push(element._id)
    });
    return await this.couponsModel
      .find({subscription:{$in:subscriptionsIds}})
      .populate({
        path: 'subscription',
        select: {
          title: 1,
          courses:1
        },
      })
      .exec();

    // const courseListIds = [];
    // const empCourses = await this.coursesModel.find({organizations:{$in:employee.organizations}},{_id:true})
    // empCourses.forEach(element => {
    //   courseListIds.push(element._id)
    // });
    //   return this.couponsModel.aggregate([
    //   {
    //     $match: { // Filter users based on organizations
    //       "courses": { $in: courseListIds }
    //     }
    //   },
    //   { $lookup: {from: 'courses', localField: 'courses', foreignField: '_id', as: 'courses'} },
    // ]);
  }

  async findByUuid(uuid: string): Promise<Coupon> {
    return this.couponsModel
      .findOne({ uuid })
      .populate({
        path: 'subscription',
        select: {
          // "title": 1,
          uuid: 1,
          actual: 1,
        },
      })
      .populate({
        path: 'agent',
        select: {
          // "name": 1,
          uuid: 1,
        },
      })
      .populate({
        path: 'users',
        select: {
          name: 1,
          mobile: 1,
        },
      })
      .exec();
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
    return this.couponsModel.find({ agent: agentId }).exec();
  }
}
