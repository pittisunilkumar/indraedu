import { SubscriptionInterface } from '@application/api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Query, Types } from 'mongoose';
import { CreateSubscriptionDto } from '../dto';
import { Coupon } from '../schema/coupon.schema';
import { Subscription } from '../schema/subscription.schema';
import { Groups } from '../schema';

@Injectable()
export class MobileSubscriptionService {
  constructor(
    @InjectModel('Subscription') private subscriptionModel: Model<Subscription>,
    @InjectModel('Coupon') private coupon: Model<Coupon>,
    @InjectModel('Groups') private groupsModel: Model<Groups>
  ) {}

  async findAll(): Promise<Subscription[]> {
    return this.subscriptionModel
      .find()
      .select({ createdOn: 0, modifiedOn: 0, createdBy: 0, modifiedBy: 0 })
      .populate({
        path: 'courses',
        select: '_id uuid title',
      })
      .populate({
        path: 'videos',
        select: '_id uuid title',
      })
      .populate({
        path: 'tests',
        select: '_id uuid title',
      })
      .populate({
        path: 'qbanks',
        select: '_id uuid title',
      })
      .exec();
  }

  async findByUuid(
    uuid: string,
    query: { courseId: any }
  ): Promise<Subscription> {
    console.log(query);

    return this.subscriptionModel
      .findOne({ uuid })
      .select({ createdOn: 0, modifiedOn: 0, createdBy: 0, modifiedBy: 0 })
      .populate({
        path: 'videos',
        select: '_id uuid title',
        match: { courses: query?.courseId },
      })
      .populate({
        path: 'tests',
        select: '_id uuid title',
      })
      .populate({
        path: 'qbanks',
        select: '_id uuid title',
      })
      .exec();
  }

  // async updateAssignments(result: Subscription) {
  //   result?.parents?.forEach(par => {
  //     if(par){
  //       this.subscriptionModel.findByIdAndUpdate(
  //         {_id: par},
  //         { $push: { children: result._id } }
  //       ).exec();
  //     }
  //   });
  //   result?.children?.forEach(chi => {
  //     if(chi){
  //       this.subscriptionModel.findByIdAndUpdate(
  //         {_id: chi},
  //         { $push: { parents: result._id } }
  //       ).exec();
  //     }
  //   });
  // }

  async findById(req: { user: { _id: any } }, body: { subscriptionId: any }) {
    let datee = new Date();
    let today = datee.getTime();

    var data = await this.subscriptionModel
      .findOne({ _id: body.subscriptionId })
      .select({ createdOn: 0, modifiedOn: 0, createdBy: 0, modifiedBy: 0 })
      .populate({
        path: 'courses',
        select: '_id uuid title',
      })
      .populate({
        path: 'videos',
        select: '_id uuid title',
      })
      .populate({
        path: 'tests',
        select: '_id uuid title',
      })
      .populate({
        path: 'qbanks',
        select: '_id uuid title',
      })
      .exec();

    const specificCoupons = await this.coupon
      .find({
        $or: [{ users: { $in: [req.user._id] } }, { couponType: 'allUsers' }],
        valiedFrom: { $lte: new Date(today) },
        valiedTo: { $gte: new Date(today) },
        subscription: await data?._id,
        availableCoupons: { $gt: 0 },
        agent: null,
        'flags.active': true,
      })
      .exec();
    var ans = {
      _id: data?._id,
      uuid: data?.uuid,
      title: data?.title,
      description: data?.description,
      order: data?.order,
      period: data?.period,
      periodType: data?.periodType,
      actual: data?.actual,
      originalPrice: data?.originalPrice,
      courses: data?.courses,
      validFrom: data?.validFrom,
      validTo: data?.validTo,
      count: data?.count,
      flags: data?.flags,
      videos: data?.videos,
      qbanks: data?.qbanks,
      tests: data?.tests,
      coupons: specificCoupons,
    };
    return ans;
  }

  async getSubscriptionsByCourse(
    req: { user: { _id: any } },
    body: { courseId: any }
  ) {
    let datee = new Date();
    let today = datee.getTime();

    var data = await this.subscriptionModel
      .find({
        courses: body.courseId,
        'flags.active': true,
        validTo: { $gte: new Date() },
      })
      .select({
        videos: 0,
        tests: 0,
        qbanks: 0,
        createdOn: 0,
        modifiedOn: 0,
        createdBy: 0,
        modifiedBy: 0,
      })
      .exec();

    var ans = [];
    for (var i = 0; i < data.length; i++) {
      const specificCoupons = await this.coupon
        .find({
          $or: [{ users: { $in: [req.user._id] } }, { couponType: 'allUsers' }],
          valiedFrom: { $lte: new Date(today) },
          valiedTo: { $gte: new Date(today) },
          subscription: data[i]?._id,
          availableCoupons: { $gt: 0 },
          agent: null,
          'flags.active': true,
        })
        .exec();
      if (data[i]) {
        ans.push({
          _id: data[i]?._id,
          uuid: data[i]?.uuid,
          title: data[i]?.title,
          description: data[i]?.description,
          order: data[i]?.order,
          period: data[i]?.period,
          periodType: data[i]?.periodType,
          type: data[i]?.type,
          actual: data[i]?.actual,
          originalPrice: data[i]?.originalPrice,
          courses: data[i]?.courses,
          validFrom: data[i]?.validFrom,
          validTo: data[i]?.validTo,
          count: data[i]?.count,
          flags: data[i]?.flags,
          coupons: specificCoupons,
        });
      }
    }
    return ans;
  }

  async applyCoupon(
    request: { user: { _id: any } },
    body: { subscriptionId: any; couponCode: any }
  ) {
    let datee = new Date();
    let today = datee.getTime();

    const specificCoupons = await this.coupon
      .find({
        $or: [
          { users: { $in: [request.user._id] } },
          { couponType: 'allUsers' },
          { couponType: 'agent' },
        ],
        valiedFrom: { $lte: new Date(today) },
        valiedTo: { $gte: new Date(today) },
        subscription: body.subscriptionId,
        code: body.couponCode,
        availableCoupons: { $gt: 1 },
        // agent:null,
        'flags.active': true,
      })
      .exec();

    if (specificCoupons.length > 0) {
      return {
        status: true,
        message: 'Valid Coupon Code',
        code: 2000,
        data: specificCoupons[0],
      };
    } else {
      return {
        status: false,
        message: 'Coupon Code Not Valid',
        code: 2001,
        data: {},
      };
    }
  }

  async getSubscriptionsByGroup(req, id) {
    let datee = new Date();
    let today = datee.getTime();

    var groups = await this.groupsModel
      .findOne({ active: true, _id: id })
      .exec();

    var data = await this.subscriptionModel
      .find({
        courses: { $in: groups.courses },
        'flags.active': true,
        validTo: { $gte: new Date() },
      })
      .sort({ count: -1 , 'flags.popular':-1 })
      .select({
        videos: 0,
        tests: 0,
        qbanks: 0,
        createdOn: 0,
        modifiedOn: 0,
        createdBy: 0,
        modifiedBy: 0,
      })
      .exec();

    var ans = [];
    for (var i = 0; i < data.length; i++) {
      const specificCoupons = await this.coupon
        .find({
          $or: [{ users: { $in: [req.user._id] } }, { couponType: 'allUsers' }],
          valiedFrom: { $lte: new Date(today) },
          valiedTo: { $gte: new Date(today) },
          subscription: data[i]?._id,
          availableCoupons: { $gt: 0 },
          agent: null,
          'flags.active': true,
        })
        .exec();
      if (data[i]) {
        ans.push({
          _id: data[i]?._id,
          uuid: data[i]?.uuid,
          title: data[i]?.title,
          description: data[i]?.description,
          order: data[i]?.order,
          period: data[i]?.period,
          periodType: data[i]?.periodType,
          type: data[i]?.type,
          actual: data[i]?.actual,
          originalPrice: data[i]?.originalPrice,
          courses: data[i]?.courses,
          validFrom: data[i]?.validFrom,
          validTo: data[i]?.validTo,
          count: data[i]?.count,
          flags: data[i]?.flags,
          coupons: specificCoupons,
        });
      }
    }
    return ans;
  }
}
