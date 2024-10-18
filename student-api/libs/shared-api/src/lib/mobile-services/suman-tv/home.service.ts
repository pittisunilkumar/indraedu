import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Coupon, Course, Subscription } from '../../schema';
import { ApiResponseInterface } from '../home.service';

@Injectable()
export class MobileSumanTvHomeService {
  constructor(
    @InjectModel('Course') private courseModel: Model<Course>,
    @InjectModel('Subscription') private subscriptionModel: Model<Subscription>,
    @InjectModel('Coupon') private coupon: Model<Coupon>
  ) {}

  async findAllCourses(): Promise<ApiResponseInterface> {
    try {
      return this.courseModel
        .find({ 'flags.active': true }, { title: 1, uuid: 1, id: 1, imgUrl: 1 })
        .sort('order')
        .then(function (data) {
          return {
            status: true,
            code: 2000,
            message: 'Courses Fetched',
            data: data,
          };
        });
      return {
        status: true,
        code: 2000,
        message: 'Courses Fetched',
        data: [],
      };
    } catch (error) {
      return { status: false, code: 5000, message: 'Server error', data: {} };
    }
  }
  async getSubscriptionsByCourse(req, body) {
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
