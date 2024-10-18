import { SubscriptionInterface } from '@application/api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateSubscriptionDto } from '../dto';
import { Subscription } from '../schema/subscription.schema';
//import { Course, QBank, QBankSubject, Syllabus } from '../schema';

@Injectable()
export class SubscriptionService {
  constructor(
    //  @InjectModel('Course') private courseModel: Model<Course>,
    @InjectModel('Subscription') private subscriptionModel: Model<Subscription>
  ) { }

  async findAll(): Promise<Subscription[]> {
    return this.subscriptionModel
      .aggregate([
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

            _id: { _id: "$_id", title: "$title", order: "$order", uuid: "$uuid",
             createdOn: "$createdOn", validFrom: "$validFrom",validTo: "$validTo",actual: "$actual",type:"$type",period:"$period"
             },
            courses: {
              $first: {
                //  "uuid": "$course.uuid",
                "title": "$course.title",
                "_id": "$course._id"
              }
            },
            qbank: {
              $addToSet: {
                "_id": "$qbank._id",
                //"subject_uuid": "$syllabuss.uuid",
                // "subject_id": "$syllabuss._id",
                "title": "$syllabuss.title",
              }
            },
            videos: {
              $addToSet: {
                "_id": "$videos._id",
                // "subject_uuid": "$syllabussss.uuid",
                //"subject_id": "$syllabussss._id",
                "title": "$syllabussss.title",
              }
            },
            tests: {
              $addToSet: {
                "_id": "$tscategories._id",
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
            "validFrom": "$_id.validFrom",
            "validTo": "$_id.validTo",
            "actual":"$_id.actual",
            "period":"$_id.period",
            "type":"$_id.type",
            "courses": '$courses',
            "qbanks": "$qbank",
            "videos": "$videos",
            "tests": "$tests",
          }
        }
      ]).exec()

  }

  // async findAll(): Promise<Subscription[]> {
  //   return this.subscriptionModel
  //     .find()
  //     // .populate('courses')
  //     .populate(
  //       {
  //         path: 'tests',
  //         select: '_id uuid title categories',
  //         // deep population method
  //         populate: {
  //           path: 'categories',
  //           select: '_id uuid title'
  //         },
  //       }
  //     )
  //     .populate('videos')
  //     .populate('qbanks')
  //     .populate({
  //       path: 'courses',

  //       select: {
  //         "uuid": 1,
  //         "title": 1,
  //         "_id": 1,
  //       },
  //       populate: {
  //         path: 'syllabus',
  //         select: {
  //           "uuid": 1,
  //           "title": 1,
  //           "_id": 1,
  //         }
  //       }

  //     }).exec()

  // }
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
              type: "$type",
              actual: "$actual",
              count: "$count",
             // discounted: "$discounted",
              validFrom:"$validFrom",
              validTo:"$validTo",
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
                // "title": "$syllabuss.title",
              }
            },
            videos: {
              $addToSet: {
                "_id": "$videos._id",
                "uuid": "$videos.uuid",
                // "subject_uuid": "$syllabussss.uuid",
                //"subject_id": "$syllabussss._id",
                // "title": "$syllabussss.title",
              }
            },
            tests: {
              $addToSet: {
                "_id": "$tscategories._id",
                "uuid": "$tscategories.uuid",
                // "subject_uuid": "$tscategories.categories.uuid",
                //"subject_id": "$tscategories.categories._id",
                // "title": "$tscategories.categories.title",
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
            "type": "$_id.type",
            "actual": "$_id.actual",
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
  ): Promise<Subscription> {

    return this.subscriptionModel.findOneAndUpdate({ uuid }, request).exec();

    // const result = this.subscriptionModel.findOneAndUpdate(
    //   { uuid },
    //   // request
    // ).exec();
    // // result.then(syllabus => {
    // //   this.updateAssignments(syllabus);
    // // })

    // return result;
  }

  async   getSubcriptionsGreaterToday() : Promise<Subscription[]>  {
    let date = new Date();
    let today=date.getTime(); 
   // return this.subscriptionModel.find( { validTo : { $gte: new Date( today - 1000 * 86400 * 1) } } ).exec();
   return this.subscriptionModel
   .aggregate([
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
         _id: { _id: "$_id", title: "$title", order: "$order", uuid: "$uuid",
          createdOn: "$createdOn",validFrom: "$validFrom",validTo: "$validTo",type:"$type",period:"$period",actual: "$actual"
          },
         courses: {
           $first: {
             //  "uuid": "$course.uuid",
             "title": "$course.title",
             "_id": "$course._id"
           }
         },
         qbank: {
           $addToSet: {
             "_id": "$qbank._id",
             //"subject_uuid": "$syllabuss.uuid",
             // "subject_id": "$syllabuss._id",
             "title": "$syllabuss.title",
           }
         },
         videos: {
           $addToSet: {
             "_id": "$videos._id",
             // "subject_uuid": "$syllabussss.uuid",
             //"subject_id": "$syllabussss._id",
             "title": "$syllabussss.title",
           }
         },
         tests: {
           $addToSet: {
             "_id": "$tscategories._id",
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
         "actual": "$_id.actual",
         "validFrom": "$_id.validFrom",
         "validTo": "$_id.validTo",
         "period":"$_id.period",
         "type":"$_id.type",
         "courses": '$courses',
         "qbanks": "$qbank",
         "videos": "$videos",
         "tests": "$tests",
       }
     },
     { $match : { validTo : { $gte: new Date( today - 1000 * 86400 * 1) } } }
   ]).exec();
  }

  async findByCourse(courseId: string): Promise<any> {
      return await this.subscriptionModel.aggregate([
        {
          $match: { courses: courseId }
        },
        {
          $project: { id: 1, uuid: 1, title: 1 }
        }
      ]);
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
