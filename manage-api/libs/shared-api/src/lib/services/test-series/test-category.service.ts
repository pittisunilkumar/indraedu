import { TestCategoryInterface, TestInterface } from '@application/api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { CreateTSCategoriesDTO } from '../../dto';
import { TSCategories, Question, Syllabus, Course, DailyTestQuestions, SubmittedTest, User } from '../../schema';
import * as Uuid from 'uuid';
import * as mongoose from 'mongoose';


@Injectable()
export class TestCategoryService {
  constructor(
    @InjectModel('TSCategories') private TSCategoriesModel: Model<TSCategories>,
    @InjectModel('Question') private questionModel: Model<Question>,
    @InjectModel('Syllabus') private syllabusModel: Model<Syllabus>,
    @InjectModel('Course') private courseModel: Model<Course>,
    @InjectModel('DailyTestQuestions') private dailyTestQuestionsModel: Model<DailyTestQuestions>,
    @InjectModel('SubmittedTest') private submittedTestModel: Model<SubmittedTest>,
    @InjectModel('User') private userModel: Model<User>,

  ) { }


  async findByCourse(courseId: string): Promise<any> {
    let sub = [];
    return this.TSCategoriesModel
      .find({ courses: courseId }, { _id: 1, uuid: 1, categories: 1 }).exec()
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

  async findAll(employee): Promise<TSCategories[]> {

    const courseListIds = [];
    const empCourses = await this.courseModel.find({organizations:{$in:employee.organizations}},{_id:true})
    empCourses.forEach(element => {
      courseListIds.push(element._id)
    });
    // return this.TSCategoriesModel
    //   .find()
    //   .populate('courses')
    //   .exec();
    let data: any
    data = await this.TSCategoriesModel
      .find({courses:{$in:courseListIds}}, { 'courses': 1, '_id': 1, 'uuid': 1, 'categories.order': 1, 'categories.title': 1, 'categories.tests.length': 1, 'createdOn': 1, 'flags': 1 })
      .populate({
        path: 'courses',
        match: {
          // "flags.testSeries": true ,
          // 'flags.active': true
        },
        select: {
          "uuid": 1,
          "title": 1,
        }
      })
      .sort({ 'categories.order': 1 })
      .exec()
    // data.map((res,i)=>{
    //  console.log('res.categories.tests.length',res.categories.tests.length);
    //  res.categories.count = res.categories.tests.length;
    // })

    // data.count =data.categories.tests.length
    return data

  }
  async getTests(catUuid) {
    return this.TSCategoriesModel.find({ uuid: catUuid }, { '_id': 1, 'uuid': 1, 'categories': 1 }).sort({ 'categories.order': 'ASC' }).exec()
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
      .then(async res => {
        // return res[0].tests;
        // let totalres = res.filter(it => it.chapters.topics.length > 0)[0].chapters.topics[0];
        let totalres = res[0].tests
        if (totalres.que) {
          for (var j = 0; j < totalres.que.length; j++) {
            let name = '';
            var obj = await this.questionModel.findOne({ "uuid": totalres.que[j].uuid }, { title: 1 }).exec();
            if (obj) {
              name = obj.title;
            }
            totalres.que[j]['title'] = name;
          };
        }
        // totalres['chapter'] = chapterobj[0];
        return totalres;
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

  /* async editTestByUuid(request: any) {
 
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
 
   }*/

  async editTestByUuid(request: any) {

    return this.TSCategoriesModel
      .findOneAndUpdate(

        {
          uuid: request.uuid
        },

        {
          $set: {
            "categories.tests.$[elem1]": request.tests,
          }
          // $inc : { 'count' : 1 }
        },

        {
          arrayFilters: [
            { "elem1.uuid": { $eq: request.tests.uuid } }
          ]
        },

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
            "subjects": "$tests.subjects",

            "_id": "$question._id",
            "uuid": "$question.uuid",
            "title": "$question.title",
            "options": "$question.options",
            "type": "$question.type",
            "answer": "$question.answer",
            "description": "$question.description",
            "flags": "$question.flags",
            "questionId": "$question.questionId",
            "descriptionImgUrl": "$question.descriptionImgUrl",

            "perals": "$question.perals",
            "syllabus": "$question.syllabus",
            "imgUrl": "$question.imgUrl",
            "difficulty": "$question.difficulty",
            "previousAppearances": "$question.previousAppearances",
            "tags": "$question.tags",
            "mathType": "$question.mathType",
            "createdBy": "$question.createdBy",
            // "matchRightSideOptions":"$question.matchRightSideOptions",
            // "matchLeftSideOptions":"$question.matchLeftSideOptions",
            // "createdOn":"$question.createdOn",
            // "shortTitle":"$question.shortTitle",
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

  async dragAndDropTSQuestions(request: TestCategoryInterface): Promise<TSCategories> {

    return this.TSCategoriesModel
      .findOneAndUpdate(

        {
          uuid: request.uuid
        },

        {
          $set: {
            "categories.tests.$[elem1].que": request.que,
          }
          // $inc : { 'count' : 1 }
        },

        {
          arrayFilters: [
            { "elem1.uuid": { $eq: request.to_test } }
          ]
        },

      ).exec();
  }

  async dragAndDropTests(request: any): Promise<TSCategories> {

    return this.TSCategoriesModel
      .findOneAndUpdate(

        {
          uuid: request.uuid
        },

        {
          $set: {
            "categories.tests": request.tests,
          }
          // $inc : { 'count' : 1 }
        },

        // {
        //   arrayFilters: [
        //   { "elem1.uuid": { $eq: request.to_test } }
        //   ]
        // },

      ).exec();
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


  async updateTestSeriesUpcoming() {
    var tests = this.TSCategoriesModel.find({
      'categories.tests.testStatus': 0,
      "flags.active": true,
      'categories.tests.scheduledDate': {
        $lt: new Date().toDateString()
      }
    },
      (err, events) => {
        events.forEach(testes => {
          var steps = testes.categories.tests.filter(test =>
            (new Date(test.scheduledDate) < new Date() && test.testStatus == 0));
          steps.forEach(async step => {
            step.testStatus = 1
            await this.TSCategoriesModel
              .findOneAndUpdate(
                {
                  uuid: testes.uuid
                },
                {
                  $set: {
                    "categories.tests.$[elem1].testStatus": 1,
                  }
                },
                {
                  arrayFilters: [
                    { "elem1.uuid": { $eq: step.uuid } }
                  ]
                },
              ).exec();
            // console.log(testes.uuid,step.uuid)
          })
        })
      }
    )
    return 'Test Status Updated';
  }


  async createDailyTest(): Promise<any> {

    var courses = await this.courseModel.find().exec();
    courses.map(async course => {
      var courseId = course._id;
      var syllabus = course.syllabus
      try {
        var testSeries = await this.TSCategoriesModel.findOne({ 'courses': courseId, "categories.title": '9 PM 9 Questions For You' }).exec();

        if (testSeries) {
          var dailyQuestions = await this.dailyTestQuestionsModel.findOne({ 'courseId': courseId }).exec();
          if (dailyQuestions) {
            var questions = await this.questionModel.aggregate([
              {
                $match: {
                  syllabus: { $in: syllabus }, _id: { $nin: dailyQuestions.questionIds }, 'flags.active': true,
                  "flags.testSeries": true,
                }
              },
              { $sample: { size: 9 } }]).exec();
          } else {
            var questions = await this.questionModel.aggregate([
              {
                $match: {
                  syllabus: { $in: syllabus }, 'flags.active': true,
                  "flags.testSeries": true,
                }
              },
              { $sample: { size: 9 } }]).exec();
          }

          console.log(questions);
          if (questions) {
            var que = [];
            var subjects = [];
            var savedsubjects = [];
            var index = 0;
            questions.map(question => {
              savedsubjects.push(question._id);
              que.push(
                {
                  "_id": question._id,
                  "uuid": question.uuid,
                  "order": index + 1,
                  "positive": 1,
                  "negative": 0
                }
              )
              index = index + 1;
            })
            if (dailyQuestions) {
              console.log('found', dailyQuestions)
              var createTest = await this.dailyTestQuestionsModel
                .updateOne(
                  {
                    courseId: courseId,
                  },
                  {
                    $push: { "questionIds": savedsubjects }
                  }
                ).exec();
            } else {
              var daily = new this.dailyTestQuestionsModel();
              daily.courseId = courseId;
              daily.questionIds = savedsubjects;
              daily.createdOn = new Date();
              daily.save();
              console.log(daily);
            }
            for (var j = 0; j < syllabus.length; j++) {
              var obj = await this.syllabusModel.findOne({ "_id": syllabus[j] }, { uuid: 1, title: 1 }).sort({ order: 1 }).exec();
              subjects.push({
                "uuid": obj.uuid,
                "_id": syllabus[j]
              })
            }
            if (testSeries) {

              var testData = {
                "uuid": Uuid.v4(),
                "title": "Today's Questions",
                "description": "Test description",
                "time": 30,
                "order": 1,
                "scheduledDate": new Date(),
                "count": 10,
                "negativeMarks": 0,
                "positiveMarks": 1,
                "que": que,
                "testStatus": 1,
                "subjects": subjects,
                "status": 0,
                "testType": "vanishing",
                "flags": {
                  "active": true,
                  "suggested": false,
                  "paid": false,
                  "editable": true
                },
                "createdBy": {
                  "uuid": "661229f5-8a01-47f8-8ec8-f5f872fb7127",
                  "name": "Ramesh"
                },
                "createdOn": new Date(),
                "modifiedOn": null,
                "pdf": "",
                "suggestedBanner": "",
                "expiryDate": "",
                "expiryTime": "",
                "imgUrl": "",
                "scheduledTime": ""
              };

              var createTest = await this.TSCategoriesModel
                .updateOne(
                  {
                    uuid: testSeries.uuid
                  },
                  {
                    "flags.active": true,
                    $push: { "categories.tests": testData },
                  }
                ).exec();
              // console.log(que,course.title)
            }
          }
        }
      } catch (exception) {

      }
    });
    return [];
  }
  async vanishDailyTest(): Promise<any> {

    var courses = await this.courseModel.find().exec();
    // var course = await this.courseModel.findOne({_id:'61c584dfb818531a54aea4ed'}).exec();
    courses.map(async course => {
      var courseId = course._id;
      try {
        var createTest = await this.TSCategoriesModel
          .updateMany(
            {
              'courses': courseId,
              "categories.title": '9 PM 9 Questions For You'
            },
            {
              $set: { "categories.tests.$[telem].flags.active": false, "flags.active": false },

            },
            {
              arrayFilters: [
                { "telem.title": { $eq: "Today's Questions" } }
              ]
            },
          ).exec();
      } catch (exception) {

      }

    });
    return [];
  }

  async getLeaderBoard(body) {
    const ranks = await this.submittedTestModel.aggregate([
      {
        $match: {
          "testSeriesUuid": body.testSeriesUuid,
          "categoryUuid": body.categoryUuid,
          "courseId": mongoose.Types.ObjectId(body.courseId),
          "status": 2
        }
      },
      {
        $lookup:
        {
          from: "users",
          let: {
            userId: "$userId"
          },
          pipeline: [{
            $match: {
              $expr: { $eq: ["$_id", "$$userId"] }
            }
          },
          {
            $project: {
              _id: 1,
              name: 1,
              uuid: 1,
              mobile:1,
            }
          }
          ],
          as: "users",
        }
      },
      {
        $unwind: "$users"
      },
      {
        $project: {
          uuid: 1,
          stats: 1,
          userId: 1,
          testSeriesUuid: 1,
          submittedOn: 1,
          count: 1,
          rank: 1,
          totalUsers: 1,
          users: 1,
          // "answers.question.order": 1,
          // "answers.question.answer": 1,
          // "answers.question.positive": 1,
          // "answers.question.negative": 1,
          // "answers.question.uuid": 1,
          // "answers.flags.correct": 1,
          // "answers.flags.wrong": 1
        }
      },
      {
        $sort: { 'stats.secureMarks': -1 }
      }
    ]).exec()

    for (let i = 0; i < ranks.length; i++) {
      const element = ranks[i];
      var userdataSubmittedTestSeriesStatus = await this.userModel
        .aggregate([
          { $match: { '_id': mongoose.Types.ObjectId(element['userId']) } },
          { $unwind: "$testSeriesSubmissions" },
          {
            $match: {
              "testSeriesSubmissions.testSeriesUuid": element['testSeriesUuid']
            }
          },
          {
            $project: {
              "_id": 0,
              "testSeriesSubmissions": 1,
            }
          },
        ])
        .exec()
        .then(
          (res) => {
            if (res[0]?.testSeriesSubmissions) {
              var v = res[0]?.testSeriesSubmissions;
              return v;
            }
            (err) => {
              return;
            }
          }
        );
      if (userdataSubmittedTestSeriesStatus) {

        let submittedOn = new Date(element['submittedOn']);
        submittedOn.getTime() + (5.5 * 60 * 60 * 1000)
        element['submittedOn'] = new Date(submittedOn.getTime() + (5.5 * 60 * 60 * 1000));
        if (userdataSubmittedTestSeriesStatus.startedAt) {
          let startedAt = new Date(userdataSubmittedTestSeriesStatus.startedAt);
          startedAt.getTime() + (5.5 * 60 * 60 * 1000)
          element['startedAt'] = new Date(startedAt.getTime() + (5.5 * 60 * 60 * 1000));
        }
        if (userdataSubmittedTestSeriesStatus.stoppedAt) {
          let stoppedAt = new Date(userdataSubmittedTestSeriesStatus.stoppedAt);
          stoppedAt.getTime() + (5.5 * 60 * 60 * 1000)
          element['stoppedAt'] = new Date(stoppedAt.getTime() + (5.5 * 60 * 60 * 1000));
        } else {
          element['stoppedAt'] = '';
        }

        if (userdataSubmittedTestSeriesStatus.completedMcq) {
          element['completedMcq'] = userdataSubmittedTestSeriesStatus['completedMcq'];
        }
        // element['userdataSubmittedTestSeriesStatus'] = userdataSubmittedTestSeriesStatus;
      }

    }
    console.log('ranks8978', ranks);
    return ranks

  }

  async resetUserTest(request) {

    let userId          = request.userId;
    let courseId        = request.courseId;
    let subjectId    = request.subjectId;
    let categoryUuid    = request.categoryUuid;
    let testSeriesUuid  = request.testSeriesUuid;

    this.userModel.findOneAndUpdate(
      { _id: userId },
      {
        $pull: { "testSeriesSubmissions": { "testSeriesUuid": testSeriesUuid ,'categoryUuid':categoryUuid} },
      },
      { new: true, useFindAndModify: false }
    ).exec();
    this.submittedTestModel.remove(
      {
        userId: mongoose.Types.ObjectId(userId),
        courseId: mongoose.Types.ObjectId(courseId),
        subjectId: mongoose.Types.ObjectId(subjectId),
        categoryUuid: categoryUuid,
        testSeriesUuid: testSeriesUuid,
      },
    ).exec();
    return true;
  }
}
