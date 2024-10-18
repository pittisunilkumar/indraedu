import { TestCategoryInterface, TestInterface } from '@application/api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { CreateTSCategoriesDTO } from '../../dto';
import { TSCategories } from '../../schema';

@Injectable()
export class TestCategoryService {
  constructor(
    @InjectModel('TSCategories') private TSCategoriesModel: Model<TSCategories>
  ) { }


  async findByCourse(courseId: string): Promise<any> {
    let sub = [];
    return this.TSCategoriesModel
      .find({ courses: courseId }, { _id: 1, uuid: 1,categories: 1 }).exec()
      .then(result => {
        result.forEach(syl => {
          sub.push(
            {
              "_id": syl._id,
              "uuid": syl.uuid,
              "title": syl.categories.title,
            }
          )
        })
        return sub;
      })

  }


  async findSubjectsByCoueseIds(coursesarr: any): Promise<any> {
    let sub = [];
    return this.TSCategoriesModel
      .find({ courses: { $in: coursesarr } }, { _id: 1, uuid: 1, categories: 1 })
      .populate({
        path: 'courses',
        select: {
          "title": 1
        }
      }).exec()
      // .populate({
      //   path: 'categories',
      //   select: {
      //     "uuid": 1,
      //     "title": 1,
      //     // "_id": 1

      //   }
      // }).exec()
      .then(result => {
        result.forEach(syl => {
          // let new_syl: any = syl.categories;
          let new_courses: any = syl.courses;
          sub.push(
            {
              "_id": syl._id,
              "uuid": syl.uuid,
              "title": syl.categories.title,
              "course_name": new_courses.title,
              "course_id": new_courses._id
            }
          )
        })
        return sub;
      })

  }

  async findAll(): Promise<TSCategories[]> {
    // return this.TSCategoriesModel
    //   .find()
    //   .populate('courses')
    //   .exec();
    return this.TSCategoriesModel
      .find()
      .populate({
        path: 'courses',
        match: {
          'flags.active': true
        },
        select: {
          "uuid": 1,
          "title": 1,
        }
      })
      // .sort({ order: 1 })
      .exec()

  }

  async findByUuid(uuid: string): Promise<TSCategories> {
    // return this.TSCategoriesModel
    //   .findOne({ uuid })
    //   .populate('courses')
    //   .exec();
    return this.TSCategoriesModel
      .findOne({ uuid })
      .sort({ order: 'ASC' })
      .populate({
        path: 'courses',
        match: {
          'flags.active': true
        },
        select: {
          "uuid": 1,
          // "title":1,
          // "_id":1,
        }
      })
      .exec();
  }

  async deleteByUuid(uuid: string) {

    // this.findCategoryByUuid(uuid).then(result => {
    // result.children.forEach(child => {
    //   if(child){
    //     this.TSCategoriesModel.findByIdAndUpdate(
    //       {_id: child},
    //       { $pull: { parents: result._id } }
    //     ).exec();
    //   }
    // });
    // result.parents.forEach(parent => {
    //   if(parent){
    //     this.TSCategoriesModel.findByIdAndUpdate(
    //       {_id: parent},
    //       { $pull: { children: result._id } }
    //     ).exec();
    //   }
    // });

    // });

    return this.TSCategoriesModel.findOneAndDelete({ uuid }).exec();

  }

  async create(createTSCategoriesDTO: CreateTSCategoriesDTO): Promise<TSCategories> {
    const createdTSCategories = new this.TSCategoriesModel(createTSCategoriesDTO);
    const result = createdTSCategories.save();
    return result;
  }

  async editByUuid(request: any): Promise<any> {

    return this.TSCategoriesModel.findOneAndUpdate({ uuid: request.uuid }, request).exec();

  }



  async getTestSeriesCourseByCategory(request: any) {
    return this.TSCategoriesModel
      .find({
        _id: request.categorieId,
        'flags.active': true
      })
      .populate(
        {
          path: 'courses',
          match: { "flags.testSeries": true, 'flags.active': true, }
        })
      .exec();
  }

  async getTestsByUuid(uuid: string, testuuid: string) {
    return this.TSCategoriesModel
      .aggregate([
        { $match: { "uuid": uuid } },
        { $unwind: "$categories" },
        {
          '$project': {
            'tests': {
              '$filter': {
                'input': '$categories.tests',
                'cond': {
                  '$eq': [
                    '$$this.uuid', testuuid
                  ]
                }
              }
            }
          }
        }, {
          '$unwind': '$tests'
        },
        {
          $project: {
            "_id": 0,
            "tests": '$tests'
            //"tests": '$categories.tests'
          }
        }
      ]).exec()
      .then(res => {
        return res[0].tests;
      })
      .catch(err => err);
  }

  async insertTSTests(request: any) {
    // return res
    return this.TSCategoriesModel
      .updateOne(
        {
          uuid: request.uuid,
          //'flags.active' : true
        },
        {
          $push: { "categories.tests": request.tests }
        }
        // {
        //   arrayFilters: [{ "chelem.uuid": { $eq: request.to_category } }]
        // }
      ).exec();
  }

  async editTestByUuid(request: any) {

    var test_uuid = request.tests.uuid
    this.TSCategoriesModel
      .updateOne(
        {
          uuid: request.uuid,
        },
        {
          $pull: { "categories.tests": { uuid: test_uuid } }
        }
      ).exec();

    return this.TSCategoriesModel
      .updateOne(
        {
          uuid: request.uuid,
        },
        {
          $push: { "categories.tests": request.tests }
        }
      ).exec();

  }
  async deleteTestByUuid(uuid: string, testUuid: string) {
    return this.TSCategoriesModel
      .updateOne(
        {
          uuid: uuid,
        },
        {
          $pull: { "categories.tests": { uuid: testUuid } }
        }
      ).exec();
  }


  async getTestQuestionsByUuid(uuid: string, testuuid: string) {
    return this.TSCategoriesModel
      .aggregate([
        { $match: { "uuid": uuid } },
        { $unwind: "$categories" },
        {
          '$project': {
            'tests': {
              '$filter': {
                'input': '$categories.tests',
                'cond': {
                  '$eq': [
                    '$$this.uuid', testuuid
                  ]
                }
              }
            }
          }
        },
        {
          '$unwind': '$tests'
        },

        {
          $unwind: "$tests.que"
        },
        { $sort: { 'tests.que.order': 1 } },
        {
          $lookup: // Equality Match
          {
            from: "questions",
            localField: "tests.que.uuid",
            foreignField: "uuid",
            as: "question",
          }
        },

        {
          $unwind: "$question"
        },



        {
          $project: {
            "order": '$tests.que.order',
            "positive": '$tests.que.positive',
            "negative": '$tests.que.negative',
            "_id": "$question._id",
            "uuid": "$question.uuid",
            "title": "$question.title",
            "options": "$question.options",
            "type": "$question.type",
            "answer": "$question.answer",
            "description": "$question.description",
            "flags": "$question.flags",
            "subjects": "$tests.subjects",
          }
        },

        // {
        //   $project: {
        //     "_id":0,
        //     "tests": '$tests'

        //   }
        // }
      ]).exec();
    // ]).exec()
    // .then(res => {
    //   return res[0].tests;
    // })
    // .catch(err => err);
  }

  async deleteTSQuestions(request: any): Promise<TSCategories> {
    return this.TSCategoriesModel
      .findOneAndUpdate(
        { uuid: request.uuid },

        {
          $pull: { "categories.tests.$[telem].que": { "uuid": { $in: request.from_que } } },
        },
        {
          arrayFilters: [
            { "telem.uuid": { $eq: request.from_test } }
          ]
        },
      )
      .exec();
  }

  // async getTestsByTSUuid(uuid: string) {
  //   return this.TSCategoriesModel
  //     .aggregate([
  //       { $match: { "uuid": uuid } },
  //       { $unwind: "$categories" },
  //       {
  //         '$unwind': '$categories.tests'
  //       },
  //       {
  //         $project: {
  //           "_id": 0,
  //           "title": '$categories.tests.title',
  //           "uuid": '$categories.tests.uuid',
  //         }
  //       },

  //     ]).exec();
  // }


  async copyTSQuestions(request: TestCategoryInterface): Promise<TSCategories> {

    return this.TSCategoriesModel
      .findOneAndUpdate(
        {
          uuid: request.uuid

        },
        // filter and push to the object
        {
          $push: { "categories.tests.$[telem].que": { $each: request.que } },

        },
        {
          arrayFilters: [
            { "telem.uuid": { $eq: request.to_test } }
          ]
        },

      )
      .exec();
  }

  async moveTSQuestions(request: TestCategoryInterface): Promise<TSCategories> {

    this.TSCategoriesModel
      .findOneAndUpdate(
        { uuid: request.uuid },

        {
          $pull: { "categories.tests.$[telem].que": { "uuid": { $in: request.from_que } } }
        },
        {
          arrayFilters: [
            { "telem.uuid": { $eq: request.from_test } }
          ]
        },

      )
      .exec();
    return this.TSCategoriesModel
      .findOneAndUpdate(
        {
          uuid: request.to_uuid

        },
        // filter and push to the object
        {
          $push: { "categories.tests.$[totelem].que": { $each: request.que } },

        },
        {
          arrayFilters: [
            { "totelem.uuid": { $eq: request.to_test } }
          ]
        },

      )
      .exec();
  }

  async copyTSTests(request: TestCategoryInterface): Promise<TSCategories> {
    return this.TSCategoriesModel
      .findOneAndUpdate(
        {
          uuid: request.uuid

        },
        // filter and push to the object
        {
          $push: { "categories.tests": { $each: request.tests } },
          // $inc : { 'count' : request.count }
        },
        // {
        //   arrayFilters: [{ "chelem.uuid": { $eq: request.to_chapter } }
        //     //  { "telem.uuid": { $eq: request.to_topic } } 
        //   ]
        // },

      )
      .exec();
  }

  async moveTSTests(request: TestCategoryInterface): Promise<TSCategories> {

    this.TSCategoriesModel
      .findOneAndUpdate(
        { uuid: request.uuid },

        {
          $pull: { "categories.tests": { "uuid": { $in: request.from_test } } },
          // $inc : { 'count' : -(request.count) }
        },
      )
      .exec();

    return this.TSCategoriesModel
      .findOneAndUpdate(
        {
          uuid: request.to_uuid

        },
        // filter and push to the object
        {
          $push: { "categories.tests": { $each: request.tests } },
          // $inc : { 'count' : request.count }
        },
      )
      .exec();
  }


}
