import { BannerInterface } from '@application/api-interfaces';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBannerDTO } from '../dto';
import {
  Coupon,
  Course,
  Subscription,
  Syllabus,
  TSCategories,
  VideoSubject,
} from '../schema';
import { Banner } from '../schema/banner.schema';
import { Employee } from '../schema/employee.schema';
import { User } from '../schema/user.schema';
@Injectable()
export class BannersService {
  constructor(
    @InjectModel('Banner') private bannersModel: Model<Banner>,
    @InjectModel('Employee') private employeeModel: Model<Employee>,
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('Syllabus') private syllabusModel: Model<Syllabus>,
    @InjectModel('Subscription') private subscriptionModel: Model<Subscription>,
    @InjectModel('Course') private courseModel: Model<Course>,
    @InjectModel('VideoSubject') private videoSubjectModel: Model<VideoSubject>,
    @InjectModel('TSCategories')
    private testCategoriesModel: Model<TSCategories>,
    @InjectModel('Coupon') private couponModel: Model<Coupon>
  ) {}

  async create(createBannersDTO: CreateBannerDTO): Promise<Banner> {
    const createdBanner = new this.bannersModel(createBannersDTO);
    return createdBanner.save();
    // let uniqueOrder = await this.bannersModel.findOne({ order: createBannersDTO.order }).then(
    //   (res) => res
    // );
    // if (!uniqueOrder) {
    //   return createdBanner.save();
    // }
    // else {
    //   throw new HttpException(
    //     'The input Order is already taken, please enter a new one',
    //     HttpStatus.BAD_REQUEST
    //   );
    // }
  }

  async findAll(employee): Promise<Banner[]> {

    const courseListIds = [];
    const empCourses = await this.courseModel.find({organizations:{$in:employee.organizations}},{_id:true})
    empCourses.forEach(element => {
      courseListIds.push(element._id)
    });
    return this.bannersModel
      .find({courses:{$in:courseListIds}})
      .populate({
        path: 'courses',
        select: {
          uuid: 1,
          title: 1,
          _id: 1,
        },
      })
      .sort({ order: 'ASC' })
      .exec();
  }

  async findByUuid(uuid: string): Promise<Banner> {
    return this.bannersModel
      .findOne({ uuid })
      .populate({
        path: 'courses',

        select: {
          uuid: 1,
          title: 1,
          _id: 1,
        },
      })
      .populate({
        path: 'subscriptions',

        select: {
          uuid: 1,
          title: 1,
          _id: 1,
        },
      })
      .exec();
    //  .populate('courses').exec();
  }

  async deleteByUuid(uuid: string) {
    return this.bannersModel.findOneAndDelete({ uuid }).exec();
  }

  // async deleteBannersByUuid(uuid: string, bannerUuid: string): Promise<Banner> {
  //   return this.bannersModel
  //     .update({}, { $pull: { courses: { uuid: bannerUuid } } })
  //     .exec();
  // }

  async editBannerByUuid(
    uuid: string,
    request: BannerInterface
  ): Promise<Banner> {
    return this.bannersModel.findOneAndUpdate({ uuid }, request).exec();
  }

  async dashboardCount(employee) {

    const courseListIds = [];
    const empCourses = await this.courseModel.find({organizations:{$in:employee.organizations}},{_id:true})
    empCourses.forEach(element => {
      courseListIds.push(element._id)
    });

    // let Banners = await this.bannersModel.countDocuments().exec();
    let Coupons = await this.couponModel.countDocuments().exec();
    let Employee = await this.employeeModel.countDocuments({organizations:{$in:employee.organizations}}).exec();
    let Users = await this.userModel.countDocuments({courses:{$in:courseListIds}}).exec();

    let activeUsers = await this.userModel
      .countDocuments({ 'devices.0': { $exists: true } ,courses:{$in:courseListIds}})
      .exec();

    let SubscribedUserCount = await this.userModel
      .countDocuments({
        'subscriptions.expiry_date': {
          $gte: new Date(),
        },
        'devices.0': { $exists: true },
        courses:{$in:courseListIds}
      })
      .exec();

    let Syllabus = await this.syllabusModel
      .countDocuments({ type: 'SUBJECT' ,courses:{$in:courseListIds}})
      .exec();
    let Subscription = await this.subscriptionModel.countDocuments({courses:{$in:courseListIds}}).exec();
    let Course = await this.courseModel.countDocuments({organizations:{$in:employee.organizations}}).exec();
    let Videos = await this.videoSubjectModel
      .find({courses:{$in:courseListIds}}, { _id: 0, count: 1 })
      .exec();
    let Tests = await this.testCategoriesModel
      .find({courses:{$in:courseListIds}}, { _id: 0, 'categories.count': 1 })
      .exec();
    let countArray = [];
    let videoCount = 0;
    let testCount = 0;
    Videos.map((res) => {
      videoCount += res.count;
    });
    Tests.map((res) => {
      testCount += res.categories.count;
    });
    countArray.push({
      // Banners: Banners,
      Coupons: Coupons,
      Employee: Employee,
      Users: Users,
      Syllabus: Syllabus,
      Subscription: Subscription,
      Course: Course,
      Videos: videoCount,
      Tests: testCount,
      activeUsers: activeUsers,
      SubscribedUserCount: SubscribedUserCount,
    });

    return countArray;
  }
}
