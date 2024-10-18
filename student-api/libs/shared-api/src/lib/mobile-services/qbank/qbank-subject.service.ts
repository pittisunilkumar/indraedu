import { QBankInterface } from '@application/api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { CreateQBankSubjectDto } from '../../dto';
import { UserStatusService } from '../../helpers';
import { Course, QBank, QBankSubject, Question, Syllabus, SubmittedQBankTopic, User, OwnPaper, DisableUserForTestSubmit } from '../../schema';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { CreateOwnPaperDto } from '../../dto/create-own-paper.dto';

@Injectable()
export class MobileQbankSubjectService {

  constructor(
    private userStatus: UserStatusService,
    @InjectModel('QBankSubject') private qbankSubjectModel: Model<QBankSubject>,
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('Syllabus') private syllabusModel: Model<Syllabus>,
    @InjectModel('Question') private questionModel: Model<Question>,
    @InjectModel('QBank') private qbankModel: Model<QBank>,
    @InjectModel('Course') private courseModel: Model<Course>,
    @InjectModel('OwnPaper') private ownPaperModel: Model<OwnPaper>,
    @InjectModel('SubmittedQBankTopic') private submittedQBankTopicModel: Model<SubmittedQBankTopic>,
    @InjectModel('DisableUserForTestSubmit') private disableUserForTestSubmitModel: Model<DisableUserForTestSubmit>,
  ) { }

  async findByCourse(req, courseId: string) {

    /*return this.qbankSubjectModel
      .find({ courses: courseId }, { id: 1, uuid: 1, title: 1, count: 1, imgUrl: 1 })
      .exec();*/
    let userUuid = req.user.uuid
    let UserId = req.user._id
    let sub = [];
    try {
      // console.log('courseId', courseId);
      var qabkData = await this.qbankSubjectModel
        .find({ courses: courseId ,"flags.active": true}, { id: 1, uuid: 1, imgUrl: 1, count: 1, courses: 1, order:1 })
        .populate({
          path: 'syllabus',
          match: {
            "type": "SUBJECT",
            "flags.active": true,
            "flags.questionBank": true,
            // "title":{ $ne: "E BOOKS"}
            title: { $not: { $eq: 'E-Books' } },
          },
          select: {
            "title": 1,
          }
        }).exec()
      // .then(result => {

      // result.forEach(syl => {
      for (var i = 0; i < qabkData.length; i++) {
        let new_syl: any = qabkData[i].syllabus;
        const userSubmission = await this.submittedQBankTopicModel.find(
          {
            'subjectId': qabkData[i]._id,
            'courseId': courseId,
            'userId': UserId,
            'status': 2
          }
        ).exec();
        console.log(qabkData)
        if (new_syl) {
          sub.push(
            {
              "id": qabkData[i]._id,
              "uuid": qabkData[i].uuid,
              "subjectName": new_syl.title,
              "subjectId": new_syl._id,
              "image": qabkData[i].imgUrl,
              "order": qabkData[i].order,
              "completedCount": userSubmission.length,
              "examId": qabkData[i].courses,
              "totalCount": qabkData[i].count,
            },
          );
        }
      };


      // return sub;
      // });
      sub.sort((a, b) => (a.order > b.order) ? 1 : -1);

      return {
        "status": true,
        "code": 2000,
        "message": "Subjects Fetched",
        'data': sub
      }
    } catch {
      return {
        "status": true, "code": 2001,
        "message": "Something Went Wrong", 'data': []
      }
    }

  }

  async findAllChaptersBySubjectUuid(subjectUuid: string): Promise<{ title: string }[]> {
    return this.qbankSubjectModel
      .find({ 'uuid': subjectUuid }, { chapters: 1 })
      .exec();
  }

  async findAll(): Promise<QBankSubject[]> {
    return this.qbankSubjectModel
      .find()
      .exec();
  }

  async findSubjectChaptersByUuid(uuid: string, query): Promise<any> {

    return this.userModel.findOne(
      { uuid: query.user },
    )
      .populate(
        {
          path: 'subscriptions',
          select: '_id uuid title courses videos tests qbanks createdOn modifiedOn',
          // deep population method
          populate: {
            path: 'courses videos tests qbanks',
            select: '_id uuid title categories flags',
            populate: {
              path: 'categories',
              select: '_id uuid title',
            }
          },
        }
      ).exec().then(

        res => {

          // console.log('tests', res?.submissions.tests);

          let filteredQbankSubjects = [];
          res?.subscriptions.map(it => {

            filteredQbankSubjects = it.qbanks.filter(qbSubject => {
              return qbSubject.uuid === uuid;
              // if(qbSubject.chapters.length) {
              // qbSubject.chapters.map(chapter => {
              //   if(chapter.topics.length) {
              //     chapter.topics.map(topic => {
              //       if(topic.uuid === uuid) {
              //         filteredTopics.push(topic);
              //       }
              //     });
              //   }
              // });
              // }
            });
          });

          return this.qbankSubjectModel
            .find(
              { uuid },
              { courses: 0, questions: 0, createdBy: 0, createdOn: 0, modifiedBy: 0, modifiedOn: 0 }
            )
            .exec().then(

              (result) => {

                result.map(subject => {

                  // console.log('result', ft);

                  // ft.status = this.userStatus.getUserTestStatus(res, 'test', ft);

                  filteredQbankSubjects.map(fqSubject => {

                    if (subject.uuid === fqSubject.uuid) {

                      subject.flags = {
                        active: subject.flags.active,
                        subscribed: true,
                        suggested: subject.flags.suggested,
                      }

                    }
                  });

                  subject.chapters.map(chapter => {
                    chapter.topics.map(topic => {
                      topic.status = this.userStatus.getUserTopicStatus(res, topic).testStatus;
                      console.log({ topic });
                    });

                  });
                });

                return result[0];

              }
            )

        }

        // console.log({ filteredTests });
      );
    // return this.qbankSubjectModel
    //   .findOne({ uuid },
    //     { courses: 0, createdOn: 0, modifiedOn: 0, createdBy: 0, modifiedBy: 0,
    //     "chapters.topics.subject": 0, "chapters.topics.questions": 0, "chapters.topics.chapter": 0 }
    //   )
    //   .exec();
  }

  async findTopicsByUuid(req, body): Promise<QBankSubject> {

    return this.qbankSubjectModel
      .aggregate([
        { $match: { "chapters.topics.uuid": body.topicUuid } },
        { $unwind: "$chapters" },
        {
          $addFields: {
            "chapters.topics": {
              $filter: {
                input: "$chapters.topics",
                cond: {
                  $eq: [
                    "$$this.uuid",
                    body.topicUuid
                  ]
                }
              },
            }
          }
        },
        {
          $match: {
            "chapters": {
              $ne: []
            }
          }
        },
        {
          $project: {
            "chapters.topics.subject": 0,
            "chapters.topics.chapter": 0,
            "chapters.topics.createdOn": 0,
            "chapters.topics.modifiedOn": 0,
            "chapters.topics.createdBy": 0,
            "chapters.topics.modifiedBy": 0,
            "chapters.topics.questions.que.syllabus": 0,
            "chapters.topics.questions.que.createdOn": 0,
            "chapters.topics.questions.que.modifiedOn": 0,
            "chapters.topics.questions.que.createdBy": 0,
            "chapters.topics.questions.que.modifiedBy": 0,
            "chapters.topics.questions.que.flags": 0,
          }
        },
        {
          $addFields: {
            chapters: [
              "$chapters"
            ],
          }
        },
      ])
      .exec()
      .then(res => {
        return res[0].chapters[0].topics[0];
      })
      .catch(err => err);

  }


  async findQbQuestions(request, body): Promise<any> {

    const userSubmission = await this.submittedQBankTopicModel
      .aggregate([
        { $match: { "qbankTopicUuid": body.topicUuid, "userId": request.user._id } },
        {
          $unwind: "$answers"
        },
        {
          $unwind: "$answers.question"
        },
        {
          $lookup: // Equality Match
          {
            from: "questions",
            localField: "answers.question.uuid",
            foreignField: "uuid",
            as: "answers.questions",
          }
        },

      ]).exec();
    var lastAttemptedQuestion = 0;
    if (userSubmission.length > 0) {
      var questionsData = [];
      userSubmission.forEach(element => {
        // console.log(element)
        lastAttemptedQuestion = element.lastAttemptedQuestion;
        // var ans = [];
        if (element.answers) {
          var ans = {
            "order": element.answers.question.order,
            "_id": element.answers.questions[0]._id,
            'questionId': element.answers.questions[0].questionId,
            "uuid": element.answers.questions[0].uuid,
            "title": element.answers.questions[0].title,
            "shortTitle": element.answers.questions[0].shortTitle,
            "options": element.answers.questions[0].options,
            "type": element.answers.questions[0].type,
            "answer": element.answers.questions[0].answer,
            "description": element.answers.questions[0].description,
            "flags": element.answers.questions[0].flags,
            "mathType": element.answers.questions[0].mathType,
            "imgUrl": element.answers.questions[0].imgUrl,
            "descriptionImgUrl": element.answers.questions[0].descriptionImgUrl,
            "matchRightSideOptions": element.answers.questions[0].matchRightSideOptions,
            "matchLeftSideOptions": element.answers.questions[0].matchLeftSideOptions,
            "attemptedAnswer": element.answers.answer,
            "attemptedInSeconds": element.answers.attemptedInSeconds,
            "attemptedflags": element.answers.flags,
          };
          questionsData.push(ans);
        }
      });
    } else {

      var questions = await this.qbankSubjectModel
        .aggregate([
          { $match: { "uuid": body.qbankUuid } },
          { $unwind: "$chapters" },
          {
            '$project': {
              'z': {
                '$filter': {
                  'input': '$chapters.topics',
                  'cond': {
                    '$eq': [
                      '$$this.uuid', body.topicUuid
                    ]
                  }
                }
              }
            }
          }, {
            '$unwind': '$z'

          },
          {
            $unwind: "$z.que"
          },

          // { $sort: { 'z.que.order': 1 } },
          {
            $lookup: // Equality Match
            {
              from: "questions",
              localField: "z.que.uuid",
              foreignField: "uuid",
              as: "question",
            }
          },

          {
            $unwind: "$question"
          },
          {
            $group: {
              _id: { a: "$_id", order: "$z.que.order" },
              "questions":
              {
                $addToSet: {
                  "order": '$z.que.order',
                  "_id": "$question._id",
                  "uuid": "$question.uuid",
                  'questionId': '$question.questionId',
                  "title": "$question.title",
                  "shortTitle": "$question.shortTitle",
                  "options": "$question.options",
                  "type": "$question.type",
                  "answer": "$question.answer",
                  "description": "$question.description",
                  "flags": "$question.flags",
                  "mathType": "$question.mathType",
                  "imgUrl": "$question.imgUrl",
                  "descriptionImgUrl": "$question.descriptionImgUrl",
                  "matchRightSideOptions": "$question.matchRightSideOptions",
                  "matchLeftSideOptions": "$question.matchLeftSideOptions",
                }
              },
            }
          },
          // {$limit: 5 * 10},
          // { $sort: { "_id.order": 1 } },
          {
            $project: {
              _id: 0,
              questions: "$questions"
            }
          }
        ])
        .exec();
      var questionsData = [];
      questions.forEach(element => {
        // var ans = [];
        if (element.questions[0]) {
          var ans = {
            "order": element.questions[0].order,
            "_id": element.questions[0]._id,
            'questionId': element.questions[0].questionId,
            "uuid": element.questions[0].uuid,
            "title": element.questions[0].title,
            "shortTitle": element.questions[0].shortTitle,
            "options": element.questions[0].options,
            "type": element.questions[0].type,
            "answer": element.questions[0].answer,
            "description": element.questions[0].description,
            "flags": element.questions[0].flags,
            "mathType": element.questions[0].mathType,
            "imgUrl": element.questions[0].imgUrl,
            "descriptionImgUrl": element.questions[0].descriptionImgUrl,
            "matchRightSideOptions": element.questions[0].matchRightSideOptions,
            "matchLeftSideOptions": element.questions[0].matchLeftSideOptions,
            "attemptedAnswer": 0,
            "attemptedInSeconds": 0,
            "attemptedflags": {
              "attempted": false,
              "isBookMarked" :false
            },
          };
          questionsData.push(ans);
        }
      });
    }
    // return questionsData;
    questionsData.sort((a, b) => (a.order > b.order) ? 1 : -1);
    return { 'questions': questionsData, 'lastAttemptedQuestion': lastAttemptedQuestion }

  }
  async findQbQuestionsReAttempt(request, body): Promise<any> {

    const userSubmission = await this.submittedQBankTopicModel
      .aggregate([
        { $match: { "qbankTopicUuid": body.topicUuid, "userId": request.user._id } },
        {
          $unwind: "$answers"
        },
        {
          $unwind: "$answers.question"
        },
        {
          $lookup: // Equality Match
          {
            from: "questions",
            localField: "answers.question.uuid",
            foreignField: "uuid",
            as: "answers.questions",
          }
        },

      ]).exec();
    var lastAttemptedQuestion = 0;
      var questionsData = [];
      userSubmission.forEach(element => {
        // console.log(element)
        lastAttemptedQuestion = element.lastAttemptedQuestion;
        // var ans = [];
        if (element.answers) {
          if(element.answers.answer != element.answers.question.answer){
            var ans = {
              "order": element.answers.question.order,
              "_id": element.answers.questions[0]._id,
              'questionId': element.answers.questions[0].questionId,
              "uuid": element.answers.questions[0].uuid,
              "title": element.answers.questions[0].title,
              "shortTitle": element.answers.questions[0].shortTitle,
              "options": element.answers.questions[0].options,
              "type": element.answers.questions[0].type,
              "answer": element.answers.questions[0].answer,
              "description": element.answers.questions[0].description,
              "flags": element.answers.questions[0].flags,
              "mathType": element.answers.questions[0].mathType,
              "imgUrl": element.answers.questions[0].imgUrl,
              "descriptionImgUrl": element.answers.questions[0].descriptionImgUrl,
              "matchRightSideOptions": element.answers.questions[0].matchRightSideOptions,
              "matchLeftSideOptions": element.answers.questions[0].matchLeftSideOptions,
              "attemptedAnswer": element.answers.answer,
              "attemptedInSeconds": element.answers.attemptedInSeconds,
              "attemptedflags": element.answers.flags,
            };
            questionsData.push(ans);
          }
        }
      });
    // return questionsData;
    questionsData.sort((a, b) => (a.order > b.order) ? 1 : -1);
    return { 'questions': questionsData, 'lastAttemptedQuestion': lastAttemptedQuestion }

  }

  async findQuestionByUuid(req, body): Promise<Question> {
    return this.questionModel.findOne({ _id: body.questionId })
      .populate({
        path: 'syllabus',
        match: {
          "type": "SUBJECT",
          // "flags.questionBank": true ,
          'flags.active': true
        },
        select: {
          "title": 1,
          "_id": 1,
          "uuid": 1
        }
      }).
      exec();
    // .populate('syllabus').exec();
  }

  async findSubjectChapterTopicsByChapterUuid(
    subjectUuid: string, chapterUuid: string, topicUuid: string
  ) {

    // .findOne(
    //     { uuid: subjectUuid, "chapters.uuid": chapterUuid },
    //     {
    //       "chapters.topics": 1, "chapters.topics.uuid": 1, "chapters.topics.title": 1,
    //       "chapters.topics.imgUrl": 1, "chapters.topics.questions": 1,
    //       "chapters.topics.que": 1,

    //     }
    //   )
    //   .exec();
  }

  async deleteByUuid(uuid: string) {

    // this.findCategoryByUuid(uuid).then(result => {
    // result.children.forEach(child => {
    //   if(child){
    //     this.qbankSubjectModel.findByIdAndUpdate(
    //       {_id: child},
    //       { $pull: { parents: result._id } }
    //     ).exec();
    //   }
    // });
    // result.parents.forEach(parent => {
    //   if(parent){
    //     this.qbankSubjectModel.findByIdAndUpdate(
    //       {_id: parent},
    //       { $pull: { children: result._id } }
    //     ).exec();
    //   }
    // });

    // });

    return this.qbankSubjectModel.findOneAndDelete({ uuid }).exec();

  }

  async create(createQBankDTO: CreateQBankSubjectDto): Promise<QBankSubject> {
    const createdQBank = new this.qbankSubjectModel(createQBankDTO);
    const result = createdQBank.save();
    return result;
  }

  async editByUuid(request: QBankInterface): Promise<QBankSubject> {
    const result = this.qbankSubjectModel.findOneAndUpdate(
      { uuid: request.uuid },
      request
    ).exec();
    // result.then(QBankSeries => {
    //   this.updateAssignments(QBankSeries);
    // })

    return result;
  }

  async findByUuid(id: string, uuid: string, user: any): Promise<any> {
    var id = id;
    var uuid = uuid;
    var user_uuid = user.uuid;
    var user_id = user._id;
    let lockstatus = false;

    var subscriptionStatus = await this.userModel.
      aggregate([{ $match: { uuid: user_uuid } }])
      .exec();

    const qbank = subscriptionStatus[0].qbanks;
  
      qbank.forEach(qbank => {
        var now = new Date();
        if (lockstatus == false) {
          if (id == qbank.subject_id) {
            if (now <= qbank.expiry_date) {
              lockstatus = true;
            } else {
              lockstatus = false;
            }
          } else {
            lockstatus = false;
          }
        }
      });
    
      var disableLockCheck = await this.disableUserForTestSubmitModel
      .findOne({ mobile: user.mobile, status: true, subscription:true})
      .exec();
      if(disableLockCheck){
        lockstatus = true;
      }

    var result = await this.qbankSubjectModel.findOne(
      { _id: id ,"flags.active": true},
      { courses: 1, syllabus: 1, chapters: 1, _id: 1, uuid: 1, title: 1, imgUrl: 1, order: 1, flags: 1, count: 1, createdBy: 1, createdOn: 1 })
      .exec().then(async res => {

        if (res != undefined) {
          var array = res.chapters;
          res.chapters.sort((a, b) => (a.order > b.order) ? 1 : -1);

          for (var j = 0; j < array.length; j++) {
            let name = '';
            var obj = await this.syllabusModel.findOne({ "_id": res.chapters[j]._id }, { title: 1,flags:1 }).sort({ order: 1 }).exec();

            if (obj) {
              name = obj.title;
            }
            let topics = [];
            topics = res.chapters[j].topics;

            // topics.sort((a_test, b_teorderst) => (a. == true) ? 1 : -1)
            topics = topics.filter(single => ( single.flags.active == true));


            for (var k = 0; k < topics.length; k++) {

              // if(topics[k].flags.active == true )


              topics[k]['totalMcq'] = topics[k].que.length;


              const userdataSubmittedTopic = await this.submittedQBankTopicModel.findOne(
                {
                  // 'subjectId': res.syllabus,
                  'qbankTopicUuid': topics[k].uuid,
                  'courseId': res.courses,
                  'userId': user_id
                }, {
                status: 1,
                stats: 1
              }
              ).exec();
              console.log(userdataSubmittedTopic)

              //   var userdataSubmittedTopic = await this.userModel
              //     .aggregate([
              //       { $match: { uuid: user_uuid } },
              //       { $unwind: "$qbanksTestSubmissions" },
              //       {
              //         $match: {
              //           "qbanksTestSubmissions.qbankTopicUuid": topics[k]['uuid']
              //         }
              //       },
              //       {
              //         $project: {
              //           "qbanksTestSubmissions": 1,
              //         }
              //       },
              //     ])
              //     .exec()
              //     .then(
              //       (res) => {
              //         if (res[0]?.qbanksTestSubmissions) {
              //           var v = res[0]?.qbanksTestSubmissions;
              //           return v;
              //         }
              //         (err) => {
              //           return;
              //         }
              //       }
              //     );
              if (userdataSubmittedTopic) {
                topics[k]['topicStatus'] = userdataSubmittedTopic.status;
                topics[k]['completedMcq'] = userdataSubmittedTopic.stats.totalAttempted;
              } else {
                topics[k]['topicStatus'] = 0;
              }
              topics[k]['subscribed'] = lockstatus;
            }
            res.chapters[j]['title'] = name;
            res.chapters[j]['subscribed'] = lockstatus;
            res.chapters[j]['count'] = res.chapters[j].topics.length;
            res.chapters[j]['topics'] = topics;
            res.chapters[j]['topics'] = topics.sort((a, b) => (a.order > b.order) ? 1 : -1);
            if(obj.flags.questionBank == false){
              res.chapters.splice(j, 1); // Remove the chapters
              --j;
            }
          }
        }
        return res;
      })
      .catch(err => err);;
    return result;

  }


  // async getsubjectByCouseuuid(body, request): Promise<any> {

  //   var response = [];


  //   var data = await this.qbankSubjectModel.aggregate([
  //     { $match: { "courses": mongoose.Types.ObjectId(body.courseId) } },
  //     {
  //       $lookup: {
  //         from: "syllabuses",
  //         localField: "syllabus",
  //         foreignField: "_id",
  //         as: "syllabus1"
  //       }
  //     },
  //     {
  //       $unwind: { path: "$syllabus1", preserveNullAndEmptyArrays: true }
  //     },
  //     {
  //       $group: {
  //         _id: {
  //           _id: "$_id",
  //           title: "$syllabus1.title",
  //           uuid: "$syllabus1.uuid",
  //           chapters: "$chapters._id",
  //         },
  //       }
  //     },
  //     {
  //       $project: {
  //         "_id": "$_id._id",
  //         "uuid": "$_id.uuid",
  //         "qbankSubjectUuid":"$uuid",
  //         "subject": "$_id.title",
  //         "chapters": "$_id.chapters",
  //       }
  //     }
  //   ]).exec().then(async sylla => {
  //     for (var i = 0; i < sylla.length; i++) {
  //       var chapters = [];
  //       var syllabu = await this.syllabusModel.find({ _id: { $in: sylla[i].chapters } }, { title: 1, order: 1, shortcut: 1,uuid:1 }).exec().then(syllabus => {
  //         for (var i = 0; i < syllabus.length; i++) {
  //           if (syllabus[i]) {
  //             chapters.push({
  //               '_id': syllabus[i]._id,
  //               'title': syllabus[i].title,
  //               'uuid': syllabus[i].uuid,
  //             })
  //           }
  //         }
  //         return chapters;
  //       })
  //       console.log(syllabu)
  //       response.push({
  //         '_id': sylla[i]._id,
  //         'qbankSubjectUuid':sylla.qbankSubjectUuid,
  //         'title': sylla[i].subject,
  //         'uuid': sylla[i].uuid,
  //         'chapters': syllabu
  //       })
  //     };
  //   });

  //   return response;
  // }



  // async topicsByChapters(subjectUuids, chapterUuids) {

  //   var data = await this.qbankSubjectModel.aggregate([
  //     { $match: { $expr: { $in: ["$uuid", subjectUuids] } } },
  //     { $unwind: "$chapters" },
  //     {
  //       '$project': {
  //         'cu': '$chapters',
  //         compare: {
  //           $cmp: ['$chapters.uuid', chapterUuids]
  //         }
  //       }
  //     },
  //     {
  //       '$project': {
  //         'z': '$cu.topics',
  //       }
  //     },
  //     {
  //       '$unwind': '$z'

  //     },

  //     {
  //       $unwind: "$z.que"
  //     },

  //     {
  //       $lookup: // Equality Match
  //       {
  //         from: "questions",
  //         let: { "uuuid": "$z.que.uuid" },

  //         pipeline: [
  //           {
  //             $match: {
  //               $expr: {
  //                 $and: [
  //                   { $eq: ["$uuid", "$$uuuid"] },
  //                   { $ne: ["$tags", ""] },
  //                   { $ne: ["$tags", null] }
  //                 ]
  //               }
  //             }
  //           },

  //         ],
  //         as: "question",
  //       }
  //     },
  //     {
  //       $unwind: "$question"
  //     },
  //     {
  //       $group: {
  //         _id: {
  //           tags: "tags",
  //         },
  //         tags: {
  //           $addToSet: "$question.tags"
  //         }
  //       },

  //     },

  //     {
  //       $project: {
  //         "_id": 0,
  //         "tags": "$tags",
  //       }
  //     },
  //   ]).exec();

  //   return data[0];

  // }

  async getsubjectByCouseuuid(body, request): Promise<any> {
    var response = [];
    var data = await this.qbankSubjectModel.aggregate([
      { $match: { "courses": mongoose.Types.ObjectId(body.courseId) ,"flags.active": true} },
      {
        $lookup: {
          from: "syllabuses",
          localField: "syllabus",
          foreignField: "_id",
          as: "syllabus1"
        }
      },
      {
        $unwind: { path: "$syllabus1", preserveNullAndEmptyArrays: true }
      },
      {
        $group: {
          _id: {
            _id: "$_id",
            title: "$syllabus1.title",
            // uuid: "$syllabus1.uuid",
            qbankSubjectUuid: "$uuid",
            chapters: "$chapters._id",
          },
        }
      },
      {
        $project: {
          "_id": "$_id._id",
          // "uuid": "$_id.uuid",
          "qbankSubjectUuid": "$_id.qbankSubjectUuid",
          "subject": "$_id.title",
          "chapters": "$_id.chapters",
        }
      }
    ]).exec().then(async sylla => {
      for (var i = 0; i < sylla.length; i++) {
        var chapters = [];
        var syllabu = await this.syllabusModel.find({ _id: { $in: sylla[i].chapters } }, { title: 1,flags:1, order: 1, shortcut: 1, uuid: 1 }).exec().then(syllabus => {
          for (var i = 0; i < syllabus.length; i++) {
            if (syllabus[i] && syllabus[i].flags.questionBank) {
              chapters.push({
                '_id': syllabus[i]._id,
                'title': syllabus[i].title,
                'uuid': syllabus[i].uuid,
              })
            }
          }
          return chapters;
        })
        // console.log(syllabu)
        response.push({
          '_id': sylla[i]._id,
          'uuid': sylla[i].qbankSubjectUuid,
          'title': sylla[i].subject,
          // 'uuid': sylla[i].uuid,
          'chapters': syllabu
        })
      };
    });
    return response;
  }

  async getEbooksCouseId(req, courseId: string) {

    try {
      var id = id;
      var uuid = uuid;
      var user_uuid = req.user.uuid;

      var data = {};

      let lockstatus = false;

      var disableLockCheck = await this.disableUserForTestSubmitModel
      .findOne({ mobile: req.user.mobile, status: true, subscription:true})
      .exec();

      var subscriptionStatus = await this.userModel.
        aggregate([{ $match: { uuid: user_uuid } }, {$project : { qbanks:1 }}])
        .exec();

      var result = await this.qbankSubjectModel.find(
        { courses: courseId ,"flags.active": true},
        { courses: 1, syllabus: 1, chapters: 1, _id: 1, uuid: 1, title: 1, imgUrl: 1, order: 1, flags: 1, count: 1, createdBy: 1, createdOn: 1 })
        .populate({
          path: 'syllabus',
          match: {
            "type": "SUBJECT",
            "flags.active": true,
            "flags.questionBank": true,
            "title": 'E-Books',
          },
          select: {
            "title": 1,
          }
        })
        .exec().then(async ress => {

          if (ress != undefined) {
            for (var i = 0; i < ress.length; i++) {
              let lockstatus = false;

              if (ress[i].syllabus != null && ress[i].syllabus['title'] == 'E-Books') {

                const qbank = subscriptionStatus[0].qbanks;
                qbank.forEach(qbank => {
                  var now = new Date();
                  if (lockstatus == false) {
                    if (String(ress[i]._id) == String(qbank.subject_id)) {
                      console.log(ress[i]._id , qbank)
                      if (now <= qbank.expiry_date) {
                        lockstatus = true;
                      } else {
                        lockstatus = false;
                      }
                    } else {
                      lockstatus = false;
                    }
                  }
                });
                
                var array = ress[i].chapters;
                ress[i].chapters.sort((a, b) => (a.order > b.order) ? 1 : -1);

                for (var j = 0; j < array.length; j++) {
                  let name = '';
                  var obj = await this.syllabusModel.findOne({ "_id": ress[i].chapters[j]._id }, { title: 1, flags:1 }).sort({ order: 1 }).exec();
                  if (obj) {
                    name = obj.title;
                  }

                  let topics = [];
                  topics = ress[i].chapters[j].topics;

                  if(disableLockCheck){
                    lockstatus = true;
                  }

                  for (var k = 0; k < topics.length; k++) {
                    topics[k]['subscribed'] = lockstatus;
                  }
                  ress[i].chapters[j]['subscribed'] = lockstatus;
                  ress[i].chapters[j]['title'] = name;
                  ress[i].chapters[j]['count'] = ress[i].chapters[j].topics.length;
                  ress[i].chapters[j]['topics'] = topics.sort((a, b) => (a.order > b.order) ? 1 : -1);

                  if(obj.flags.questionBank == false){
                    ress[i].chapters.splice(j, 1); // Remove the chapters
                    j--
                  }
                }
                return ress[i];
              }
            }
          }
        })
        .catch(err => err);;

      if (result) {
        return result;
      } else {
        return {}
      }
    } catch {
      return {
        "status": true, "code": 2001,
        "message": "Something Went Wrong", 'data': []
      }
    }

  }

  async topicsByChapters(subjectUuids, chapterUuids) {
    var data = await this.qbankSubjectModel.aggregate([
      { $match: { $expr: { $in: ["$uuid", subjectUuids] } } },
      { $unwind: "$chapters" },
      {
        '$project': {
          'cu': '$chapters',
          // compare: {
          //   $cmp: ['$chapters.uuid', chapterUuids]
          // }
        }
      },
      { $match: { $expr: { $in: ["$cu.uuid", chapterUuids] } } },

      {
        '$project': {
          'z': '$cu.topics',
        }
      },
      {
        '$unwind': '$z'
      },
      {
        $unwind: "$z.que"
      },
      {
        $lookup: // Equality Match
        {
          from: "questions",
          let: { "uuuid": "$z.que.uuid" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$uuid", "$$uuuid"] },
                    { $ne: ["$tags", ""] },
                    { $ne: ["$tags", null] }
                  ]
                }
              }
            },
          ],
          as: "question",
        }
      },
      {
        $unwind: "$question"
      },
      {
        $lookup: // Equality Match
        {
          from: "tags",
          localField: "question.tags",
          foreignField: "_id",
          as: "tagsObj",
        }
      },
      {
        $unwind: "$tagsObj"
      },
      {
        $group: {
          _id: {
            tags: "tags",
          },
          tags: {
            $addToSet: { "_id": "$tagsObj._id", "title": "$tagsObj.title" }
          }
        },
      },
      {
        $project: {
          "_id": 0,
          "tags": "$tags",
        }
      },
    ]).exec();
    return data[0];
  }



  // async customModuleQuestions(body: any) {
  //   let subjectUuids = body.subjectUuids;
  //   let chapterUuids = body.chapterUuids;
  //   let tags = body.tags;
  //   let difficultyLevel = body.difficultyLevel;
  //   let questionsCount = body.questionsCount;
  //   let testName = body.testName;
  //   let questionsFrom = body.questionsFrom;
  //   let examMode = body.examMode;
  //   let userUuid = body.userUuid;

  //   var data = await this.qbankSubjectModel.aggregate([
  //     //{ $match: {"uuid": subjectUuid } },
  //     { $match: { $expr: { $in: ["$uuid", subjectUuids] } } },
  //     { $unwind: "$chapters" },
  //     //{$match: {'chapters.uuid': chapterUuid } },
  //     {
  //       '$project': {
  //         'cu': '$chapters',
  //         compare: {
  //           $cmp: ['$chapters.uuid', chapterUuids]
  //         }
  //       }
  //     },

  //     {
  //       '$project': {
  //         'z': '$cu.topics',
  //       }
  //     },
  //     {
  //       '$unwind': '$z'

  //     },

  //     {
  //       $unwind: "$z.que"
  //     },

  //     {
  //       $lookup: // Equality Match
  //       {
  //         from: "questions",
  //         //localField: "z.que.uuid",
  //         //foreignField: "uuid",
  //         let: { "uuuid": "$z.que.uuid" },

  //         pipeline: [
  //           {
  //             $match: {
  //               $expr: {
  //                 $and: [
  //                   { $eq: ["$uuid", "$$uuuid"] },
  //                   { $eq: ["$difficulty", difficultyLevel] },
  //                   { $in: ["$tags", tags] },
  //                   //{$ne: ["$tags",null] }
  //                 ]
  //               }
  //             }

  //           },
  //           //{$limit: 1},
  //         ],
  //         as: "question",
  //       }
  //     },
  //     {
  //       $unwind: "$question"
  //     },

  //     { $limit: questionsCount },

  //     {
  //       $group: {
  //         _id: {
  //           tags: "tags",
  //         },
  //         question: { $addToSet: "$question" }
  //       },

  //     },

  //     {
  //       $project: {
  //         "_id": 0,
  //         "question": "$question",
  //       }
  //     },


  //   ]).exec();
  //   if (data) {
  //     let questions = data[0].question;
  //     let random = Math.floor(Math.random() * 10000000);
  //     let examId = 'EXM' + random;
  //     let createdOn = new Date();
  //     let obj = {
  //       "userUuid": userUuid,
  //       "exam": [
  //         {
  //           "examId": examId,
  //           "examMode": examMode,
  //           "testName": testName,
  //           "createdOn": createdOn,
  //           "questions": questions,
  //         }
  //       ]
  //     }
  //     this.customModuleQuestionsPost(obj);
  //     return obj;
  //   }
  //   return Object;

  // }

  async customModuleQuestions(req, body: any) {
    let subjectUuids = body.subjectUuids;
    let chapterUuids = body.chapterUuids;
    let tags = body.tags;
    let difficultyLevel = body.difficultyLevel;
    let questionsCount = body.questionsCount;
    let testName = body.testName;
    // let questionsFrom = body.questionsFrom;
    let examMode = body.examMode;
    let userUuid = req.user.uuid;
    // let objectIdArray = tags.map(s => mongoose.Types.ObjectId(s));

    var data = await this.qbankSubjectModel.aggregate([
      //{ $match: {"uuid": subjectUuid } },
      { $match: { $expr: { $in: ["$uuid", subjectUuids] } } },
      { $unwind: "$chapters" },
      //{$match: {'chapters.uuid': chapterUuid } },
      {
        '$project': {
          'cu': '$chapters',
          // compare: {
          //  $cmp: ['$chapters.uuid', chapterUuids]
          //    }
        }
      },

      { $match: { $expr: { $in: ["$cu.uuid", chapterUuids] } } },

      {
        '$project': {
          'z': '$cu.topics',
        }
      },
      {
        '$unwind': '$z'

      },

      {
        $unwind: "$z.que"
      },

      {
        $lookup: // Equality Match
        {
          from: "questions",
          //localField: "z.que.uuid",
          //foreignField: "uuid",
          let: { "uuuid": "$z.que.uuid" },

          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$uuid", "$$uuuid"] },
                    { $in: ["$difficulty", difficultyLevel] },
                    //{$in: ["$tags",objectIdArray] },
                    //{$ne: ["$tags",null] }
                  ]
                }
              }

            },
            //{$limit: 1},
          ],
          as: "question",
        }
      },


      {
        $unwind: "$question"
      },

      { $limit: questionsCount },

      {
        $group: {
          _id: {
            tags: "tags",
          },


          question: { $addToSet: "$question" }
        },

      },

      {
        $project: {

          "_id": 0,

          "question": "$question",
        }
      },


    ]).exec();

    if (data.length > 0) {
      let questions = data[0].question;
      let random = Math.floor(Math.random() * 10000000);
      let examId = 'EXM' + random;
      let createdOn = new Date();
      let obj = {
        "userUuid": userUuid,
        "exam": [
          {
            "examId": examId,
            "examMode": examMode,
            "testName": testName,
            "createdOn": createdOn,
            "questions": questions,
          }
        ]
      }

      // var result = await this.ownPaperModel.findOne({ 'userUuid': userUuid }, { _id: 1, })
      //   .exec();
      // console.log(result);
      // if (result) {
      //   this.customModuleQuestionsUpdate(result._id, userUuid, obj);
      // } else {
      //   this.customModuleQuestionsPost(obj);
      // }
      return { status: true, data: obj, message: 'Questions Fetched', code: 2000 };
    }
    return { status: false, data: {}, message: 'requested questions not found', code: 2001 };

  }

  async customModuleQuestionsUpdate(id, userUuid, obj) {
    this.ownPaperModel
      .findOneAndUpdate(
        {
          userUuid: userUuid,
        },
        {
          $addToSet: { "exam": obj.exam }
        }
      ).exec();
  }



  async customModuleQuestionsPost(createOwnPaperDTO: CreateOwnPaperDto): Promise<OwnPaper> {
    const createdOwnpaper = await new this.ownPaperModel(createOwnPaperDTO);
    const result = createdOwnpaper.save();
    console.log('added tag', result);
    return result;
  }


  async customModuleQuestionsSubmit(req, request) {

    let examId = request.examId;
    let userUuid = req.user.uuid;;
    let questions = request.questions;

    let question_count = questions.length;
    let total_marks = question_count;

    let correct_marks = 0;
    let wrong_marks = 0;
    questions.forEach((element) => {

      if (element.answerStatus == 'correct') {
        correct_marks++;
      }
      if (element.answerStatus == 'wrong') {
        wrong_marks++;
      }
    });
    let correct_percentage = parseFloat((((correct_marks) / (total_marks)) * 100).toFixed(2));
    let wrong_percentage = parseFloat((((wrong_marks) / (total_marks)) * 100).toFixed(2));

    return this.ownPaperModel
      .findOneAndUpdate(
        { userUuid: userUuid },

        {
          $set: {
            "exam.$[elem].questions": questions,
            "exam.$[elem].correct_marks": correct_marks,
            "exam.$[elem].wrong_marks": wrong_marks,
            "exam.$[elem].total_marks": total_marks,
            "exam.$[elem].correct_percentage": correct_percentage,
            "exam.$[elem].wrong_percentage": wrong_percentage,

          }

        },

        {
          arrayFilters: [{ "elem.examId": { $eq: examId } }]
        },
      ).exec();


  }

}
