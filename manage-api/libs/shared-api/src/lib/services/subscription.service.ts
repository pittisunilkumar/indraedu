import { SubscriptionInterface } from '@application/api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSubscriptionDto } from '../dto';
import { User } from '../schema/user.schema';
import { Subscription } from '../schema/subscription.schema';
import { Course } from '../schema';
//import { Course, QBank, QBankSubject, Syllabus } from '../schema';

@Injectable()
export class SubscriptionService {
  constructor(
    //  @InjectModel('Course') private courseModel: Model<Course>,
    @InjectModel('Subscription') private subscriptionModel: Model<Subscription>,
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('Course') private courseModel: Model<Course>,

  ) { }

  // async findAll(): Promise<Subscription[]> {
  //   return this.subscriptionModel
  //     .aggregate([
  //       {
  //         $lookup:
  //         {
  //           from: "courses",
  //           localField: "courses",
  //           foreignField: "_id",
  //           as: "course",
  //         }
  //       },

  //       {
  //         $unwind: { path: "$course", preserveNullAndEmptyArrays: true }
  //       },
  //       {
  //         $lookup: {
  //           "from": "qbanksubjects",
  //           "let": { "qbanks": "$qbanks" },
  //           "pipeline": [
  //             { "$match": { "$expr": { "$in": ["$_id", "$$qbanks"] } } }
  //           ],
  //           "as": "qbank"
  //         }
  //       },
  //       {
  //         $unwind: { path: "$qbank", preserveNullAndEmptyArrays: true }
  //       },

  //       {
  //         $lookup: {
  //           "from": "videosubjects",
  //           "let": { "videos": "$videos" },
  //           "pipeline": [
  //             { "$match": { "$expr": { "$in": ["$_id", "$$videos"] } } }
  //           ],
  //           "as": "videos"
  //         }
  //       },
  //       {
  //         $unwind: { path: "$videos", preserveNullAndEmptyArrays: true }
  //       },

  //       {
  //         $lookup: {
  //           "from": "tscategories",
  //           "let": { "tests": "$tests" },
  //           "pipeline": [
  //             { "$match": { "$expr": { "$in": ["$_id", "$$tests"] } } }
  //           ],
  //           "as": "tscategories"
  //         }
  //       },
  //       {
  //         $unwind: { path: "$tscategories", preserveNullAndEmptyArrays: true }
  //       },
  //       {
  //         $lookup:
  //         {
  //           from: "syllabuses",
  //           localField: "qbank.syllabus",
  //           foreignField: "_id",
  //           as: "syllabuss",
  //         }
  //       },
  //       {
  //         $unwind: { path: "$syllabuss", preserveNullAndEmptyArrays: true }
  //       },

  //       {
  //         $lookup:
  //         {
  //           from: "syllabuses",
  //           localField: "videos.syllabus",
  //           foreignField: "_id",
  //           as: "syllabussss",
  //         }
  //       },
  //       {
  //         $unwind: { path: "$syllabussss", preserveNullAndEmptyArrays: true }
  //       },
  //       {
  //         $unwind: { path: "$categories", preserveNullAndEmptyArrays: true }
  //       },
  //       {
  //         $group: {

  //           _id: { _id: "$_id", title: "$title", order: "$order", uuid: "$uuid", flags: "$flags",
  //           originalPrice:"$originalPrice",
  //            createdOn: "$createdOn", validFrom: "$validFrom",validTo: "$validTo",actual: "$actual",period:"$period"
  //            },
  //           courses: {
  //             $first: {
  //               //  "uuid": "$course.uuid",
  //               "title": "$course.title",
  //               "_id": "$course._id"
  //             }
  //           },
  //           qbank: {
  //             $addToSet: {
  //               "_id": "$qbank._id",
  //               //"subject_uuid": "$syllabuss.uuid",
  //               // "subject_id": "$syllabuss._id",
  //               "title": "$syllabuss.title",
  //             }
  //           },
  //           videos: {
  //             $addToSet: {
  //               "_id": "$videos._id",
  //               // "subject_uuid": "$syllabussss.uuid",
  //               //"subject_id": "$syllabussss._id",
  //               "title": "$syllabussss.title",
  //             }
  //           },
  //           tests: {
  //             $addToSet: {
  //               "_id": "$tscategories._id",
  //               // "subject_uuid": "$tscategories.categories.uuid",
  //               //"subject_id": "$tscategories.categories._id",
  //               "title": "$tscategories.categories.title",
  //             }
  //           },
  //         }
  //       },
  //       {
  //         $project: {
  //           "_id": '$_id._id',
  //           "title": '$_id.title',
  //           "order": '$_id.order',
  //           "uuid": '$_id.uuid',
  //           "createdOn": '$_id.createdOn',
  //           "validFrom": "$_id.validFrom",
  //           "validTo": "$_id.validTo",
  //            "flags": "$_id.flags",
  //           "actual":"$_id.actual",
  //           "originalPrice":"$_id.originalPrice",
  //           "period":"$_id.period",
  //           "courses": '$courses',
  //           "qbanks": "$qbank",
  //           "videos": "$videos",
  //           "tests": "$tests",
  //         }
  //       },
  //       {$sort: {'order': 1}},
  //     ]).exec()

  // }

  async findAll(employee): Promise<Subscription[]> {
    const courseListIds = [];
    const empCourses = await this.courseModel.find({organizations:{$in:employee.organizations}},{_id:true})
    empCourses.forEach(element => {
      courseListIds.push(element._id)
    });
    
    let subscriptions = await this.subscriptionModel.find({courses:{$in:courseListIds}}, {_id: 1, uuid: 1, title: 1, courses: 1, createdOn: 1, validFrom: 1, validTo: 1, flags: 1, order: 1, actual: 1, originalPrice: 1, period: 1,periodType:1 })
      .populate({
        path: 'courses',
        select: {
          "uuid": 1,
          "title": 1,
          "_id": 1,
        }
      }).sort({ order: 'ASC' }).exec()

      // subscriptions.map(async res=>{
      //  await this.subscriptionModel.findOneAndUpdate({ uuid: res.uuid },{periodType:'MONTHS'}).exec()
      // })

      return subscriptions

  }
  // async findByCourse(courseId: string): Promise<any> {

  //   //const matchedCourse = await this.courseModel.find({ _id: courseId }).exec();

  //   return this.subscriptionModel
  //     .find({ courses: courseId }, { id: 1, uuid: 1, title: 1 })
  //     .exec();

  // }

  async editSubscription(uuid: string): Promise<Subscription> {
    return this.subscriptionModel.findOne({ uuid: uuid }).exec()
  }

  async findByUuid(uuid: string): Promise<Subscription> {
    return this.subscriptionModel
      .aggregate([
        {
          $match: { "uuid": uuid }
        },
        // {
        //   $lookup:
        //   {
        //     from: "coupons",
        //     localField: "coupons",
        //     foreignField: "_id",
        //     as: "coupon",
        //   }
        // },

        // {
        //   $unwind: { path: "$coupon", preserveNullAndEmptyArrays: true }
        // },
        {
          $lookup:
          {
            from: "courses",
            localField: "courses",
            foreignField: "_id",
            as: "course",
          }
        },

        {
          $unwind: { path: "$course", preserveNullAndEmptyArrays: true }
        },

        {
          $lookup: {
            "from": "qbanksubjects",
            "let": { "qbanks": "$qbanks" },
            "pipeline": [
              { "$match": { "$expr": { "$in": ["$_id", "$$qbanks"] } } }
            ],
            "as": "qbank"
          }
        },
        {
          $unwind: { path: "$qbank", preserveNullAndEmptyArrays: true }
        },

        {
          $lookup: {
            "from": "videosubjects",
            "let": { "videos": "$videos" },
            "pipeline": [
              { "$match": { "$expr": { "$in": ["$_id", "$$videos"] } } }
            ],
            "as": "videos"
          }
        },
        {
          $unwind: { path: "$videos", preserveNullAndEmptyArrays: true }
        },

        {
          $lookup: {
            "from": "tscategories",
            "let": { "tests": "$tests" },
            "pipeline": [
              { "$match": { "$expr": { "$in": ["$_id", "$$tests"] } } }
            ],
            "as": "tscategories"
          }
        },
        {
          $unwind: { path: "$tscategories", preserveNullAndEmptyArrays: true }
        },
        {
          $lookup:
          {
            from: "syllabuses",
            localField: "qbank.syllabus",
            foreignField: "_id",
            as: "syllabuss",
          }
        },
        {
          $unwind: { path: "$syllabuss", preserveNullAndEmptyArrays: true }
        },

        {
          $lookup:
          {
            from: "syllabuses",
            localField: "videos.syllabus",
            foreignField: "_id",
            as: "syllabussss",
          }
        },
        {
          $unwind: { path: "$syllabussss", preserveNullAndEmptyArrays: true }
        },
        {
          $unwind: { path: "$categories", preserveNullAndEmptyArrays: true }
        },
        {
          $group: {

            _id: {
              _id: "$_id",
              title: "$title",
              order: "$order",
              uuid: "$uuid",
              createdOn: "$createdOn",
              description: "$description",
              period: "$period",
              periodType:"$periodType",
              actual: "$actual",
              originalPrice: "$originalPrice",
              count: "$count",
              // discounted: "$discounted",
              validFrom: "$validFrom",
              validTo: "$validTo",
              flags: "$flags",
            },
            // coupons: {
            //   $first: {
            //     "uuid": "$coupon.uuid",
            //     // "code": "$coupon.code",
            //     "_id": "$coupon._id"
            //   }
            // },
            courses: {
              $first: {
                "uuid": "$course.uuid",
                // "title": "$course.title",
                "_id": "$course._id"
              }
            },
            qbank: {
              $addToSet: {
                "_id": "$qbank._id",
                "uuid": "$qbank.uuid",
                //"subject_uuid": "$syllabuss.uuid",
                // "subject_id": "$syllabuss._id",
                "title": "$syllabuss.title",
              }
            },
            videos: {
              $addToSet: {
                "_id": "$videos._id",
                "uuid": "$videos.uuid",
                // "subject_uuid": "$syllabussss.uuid",
                //"subject_id": "$syllabussss._id",
                "title": "$syllabussss.title",
              }
            },
            tests: {
              $addToSet: {
                "_id": "$tscategories._id",
                "uuid": "$tscategories.uuid",
                // "subject_uuid": "$tscategories.categories.uuid",
                //"subject_id": "$tscategories.categories._id",
                "title": "$tscategories.categories.title",
              }
            },
          }
        },
        {
          $project: {
            "_id": '$_id._id',
            "title": '$_id.title',
            "order": '$_id.order',
            "uuid": '$_id.uuid',
            "createdOn": '$_id.createdOn',
            "description": "$_id.description",
            "period": "$_id.period",
            "periodType":"$_id.periodType",
            "actual": "$_id.actual",
            "originalPrice": "$_id.originalPrice",
            "count": "$_id.count",
            //"discounted": "$_id.discounted",
            // "coupons": "$coupons",
            "validFrom": "$_id.validFrom",
            "validTo": "$_id.validTo",
            "flags": "$_id.flags",
            "courses": '$courses',
            "qbanks": "$qbank",
            "videos": "$videos",
            "tests": "$tests",
          }
        }
      ]).exec()
  }



  async deleteByUuid(uuid: string) {
    // this.findByUuid(uuid).then(result => {
    //   result.children.forEach(child => {
    //     if(child){
    //       this.subscriptionModel.findByIdAndUpdate(
    //         {_id: child},
    //         { $pull: { parents: result._id } }
    //       ).exec();
    //     }
    //   });
    //   result.parents.forEach(parent => {
    //     if(parent){
    //       this.subscriptionModel.findByIdAndUpdate(
    //         {_id: parent},
    //         { $pull: { children: result._id } }
    //       ).exec();
    //     }
    //   });

    // });

    return this.subscriptionModel.findOneAndDelete({ uuid }).exec();
  }

  async create(createSubscriptionDto: CreateSubscriptionDto): Promise<Subscription> {
    const createdSubscription = new this.subscriptionModel(createSubscriptionDto);
    console.log(createdSubscription.get('type'));
    const result = createdSubscription.save();
    // result.then(syllabus => {
    //   this.updateAssignments(syllabus);
    // })

    return result;
  }

  async editSubscriptionByUuid(
    uuid: string,
    request: any
  ) {
    let subscription = await this.subscriptionModel.findOneAndUpdate({ uuid }, request).exec();

    var subscriptionId = subscription._id;
    // var subscriptionData = await this.subscriptionModel.findOne({ _id: subscriptionId });
    var users = await this.userModel.find({ "subscriptions.subscription_id": subscriptionId });
    // var UserData = await this.userModel.findOne({_id:"61ab1ab7bf26b8470417ae07"});

    var expiry = null;
    users.map(async UserData => {
      UserData.subscriptions.map(sub => {
        if (sub.subscription_id.toHexString() == subscription._id.toHexString()) {
          expiry = sub.expiry_date
          request.newQbanks.map(res => {
            UserData.qbanks = UserData?.qbanks.filter(e => {
              return e.subject_id != res.toString()
            })
            UserData.qbanks.push({ 'subject_id': res, 'expiry_date': expiry });
          })

          request.newVideos.map(res => {
            UserData.videos = UserData?.videos.filter(e => {
              return e.subject_id != res.toString()
            })
            UserData.videos.push({ 'subject_id': res, 'expiry_date': expiry });
          })

          request.newTests.map(res => {
            UserData.tests = UserData?.tests.filter(e => {
              return e.category_id != res.toString()
            })
            UserData.tests.push({ 'category_id': res, 'expiry_date': expiry });
          })
          console.log(UserData.tests)
        }
      });
      let update = await UserData.save();
    });

    // return {
    //   "status": true, "code": 2000, 'message': 'User Subscription Data Updated', 'data': {
    //     subscription: subscriptionData,
    //     users: subscriptionData
    //   }
    // }
  }

  // async   getSubcriptionsGreaterToday() : Promise<Subscription[]>  {
  //   let date = new Date();
  //   let today=date.getTime(); 
  //  // return this.subscriptionModel.find( { validTo : { $gte: new Date( today - 1000 * 86400 * 1) } } ).exec();
  //  return this.subscriptionModel
  //  .aggregate([
  //   { $match : {"flags.active":true,validTo : { $gte: new Date( today - 1000 * 86400 * 1) }}},
  //    {
  //      $lookup:
  //      {
  //        from: "courses",
  //        localField: "courses",
  //        foreignField: "_id",
  //        as: "course",
  //      }
  //    },
  //    {
  //      $unwind: { path: "$course", preserveNullAndEmptyArrays: true }
  //    },
  //    {
  //      $lookup: {
  //        "from": "qbanksubjects",
  //        "let": { "qbanks": "$qbanks" },
  //        "pipeline": [
  //          { "$match": { "$expr": { "$in": ["$_id", "$$qbanks"] } } }
  //        ],
  //        "as": "qbank"
  //      }
  //    },
  //    {
  //      $unwind: { path: "$qbank", preserveNullAndEmptyArrays: true }
  //    },
  //    {
  //      $lookup: {
  //        "from": "videosubjects",
  //        "let": { "videos": "$videos" },
  //        "pipeline": [
  //          { "$match": { "$expr": { "$in": ["$_id", "$$videos"] } } }
  //        ],
  //        "as": "videos"
  //      }
  //    },
  //    {
  //      $unwind: { path: "$videos", preserveNullAndEmptyArrays: true }
  //    },
  //    {
  //      $lookup: {
  //        "from": "tscategories",
  //        "let": { "tests": "$tests" },
  //        "pipeline": [
  //          { "$match": { "$expr": { "$in": ["$_id", "$$tests"] } } }
  //        ],
  //        "as": "tscategories"
  //      }
  //    },
  //    {
  //      $unwind: { path: "$tscategories", preserveNullAndEmptyArrays: true }
  //    },
  //    {
  //      $lookup:
  //      {
  //        from: "syllabuses",
  //        localField: "qbank.syllabus",
  //        foreignField: "_id",
  //        as: "syllabuss",
  //      }
  //    },
  //    {
  //      $unwind: { path: "$syllabuss", preserveNullAndEmptyArrays: true }
  //    },
  //    {
  //      $lookup:
  //      {
  //        from: "syllabuses",
  //        localField: "videos.syllabus",
  //        foreignField: "_id",
  //        as: "syllabussss",
  //      }
  //    },
  //    {
  //      $unwind: { path: "$syllabussss", preserveNullAndEmptyArrays: true }
  //    },
  //    {
  //      $unwind: { path: "$categories", preserveNullAndEmptyArrays: true }
  //    },
  //    {
  //      $group: {
  //        _id: { _id: "$_id", title: "$title", order: "$order", uuid: "$uuid","originalPrice":"$originalPrice",
  //         createdOn: "$createdOn",validFrom: "$validFrom",validTo: "$validTo",period:"$period",actual: "$actual"
  //         },
  //        courses: {
  //          $first: {
  //            //  "uuid": "$course.uuid",
  //            "title": "$course.title",
  //            "_id": "$course._id"
  //          }
  //        },
  //        qbank: {
  //          $addToSet: {
  //            "_id": "$qbank._id",
  //            //"subject_uuid": "$syllabuss.uuid",
  //            // "subject_id": "$syllabuss._id",
  //            "title": "$syllabuss.title",
  //          }
  //        },
  //        videos: {
  //          $addToSet: {
  //            "_id": "$videos._id",
  //            // "subject_uuid": "$syllabussss.uuid",
  //            //"subject_id": "$syllabussss._id",
  //            "title": "$syllabussss.title",
  //          }
  //        },
  //        tests: {
  //          $addToSet: {
  //            "_id": "$tscategories._id",
  //            // "subject_uuid": "$tscategories.categories.uuid",
  //            //"subject_id": "$tscategories.categories._id",
  //            "title": "$tscategories.categories.title",
  //          }
  //        },
  //      }
  //    },
  //    {
  //      $project: {
  //        "_id": '$_id._id',
  //        "title": '$_id.title',
  //        "order": '$_id.order',
  //        "uuid": '$_id.uuid',
  //        "createdOn": '$_id.createdOn',
  //        "actual": "$_id.actual",
  //        "originalPrice":"$_id.originalPrice",
  //        "validFrom": "$_id.validFrom",
  //        "validTo": "$_id.validTo",
  //        "period":"$_id.period",
  //        "courses": '$courses',
  //        "qbanks": "$qbank",
  //        "videos": "$videos",
  //        "tests": "$tests",
  //      }
  //    },
  //   //  { $match : { validTo : { $gte: new Date( today - 1000 * 86400 * 1) } } }
  //  ]).exec();
  // }
  async getSubcriptionsGreaterToday(): Promise<Subscription[]> {
    let date = new Date();
    let today = date.getTime();
    return this.subscriptionModel.find({ "flags.active": true, validTo: { $gte: new Date(today - 1000 * 86400 * 1) } },
      { _id: 1, uuid: 1, title: 1, courses: 1, createdOn: 1, validFrom: 1, validTo: 1, flags: 1, order: 1, actual: 1, originalPrice: 1, period: 1,periodType:1 })
      .populate({
        path: 'courses',
        select: {
          "uuid": 1,
          "title": 1,
          "_id": 1,
        }
      }).sort({ order: 'ASC' }).exec()

  }

  async couponSubscriptions(): Promise<Subscription[]> {
    let date = new Date();
    let today = date.getTime();
    return this.subscriptionModel.find({
      flags: { active: true },
      validTo: { $gte: new Date(today - 1000 * 86400 * 1) }
    }, { _id: 1, uuid: 1, title: 1, actual: 1 }).exec();
  }

  async findByCourse(courseId: string): Promise<any> {
    return this.subscriptionModel
      .find({ courses: courseId }, { id: 1, uuid: 1, title: 1 })
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
}
