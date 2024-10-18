import { QBankInterface } from '@application/api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateQBankSubjectDto } from '../../dto';
import { UserStatusService } from '../../helpers';
import { Course, QBank, QBankSubject, User } from '../../schema';

@Injectable()
export class MobileQbankSubjectService {

  constructor(
    private userStatus: UserStatusService,
    @InjectModel('QBankSubject') private qbankSubjectModel: Model<QBankSubject>,
    @InjectModel('User') private userModel: Model<User>,
  ) {}

  async findByCourse(courseId: string) {

    /*return this.qbankSubjectModel
      .find({ courses: courseId }, { id: 1, uuid: 1, title: 1, count: 1, imgUrl: 1 })
      .exec();*/
     let sub = [];

    return this.qbankSubjectModel
      //.find({ courses: courseId }, { id: 1, uuid: 1, title: 1, count: 1, imgUrl: 1 })
      //.exec();
      .find({ courses: courseId }, { id: 1, uuid: 1, imgUrl: 1, count: 1, courses: 1 })
      .populate({
        path: 'syllabus',
        match: {
          "type": "SUBJECT",
          "flags.active": true,
          "flags.questionBank": true,
        },

        select: {
          "title": 1,
        }
      }).exec()
      .then(result => {

        result.forEach(syl => {
          let new_syl: any = syl.syllabus;

          sub.push(
            {
              "id": syl._id,
              "uuid": syl.uuid,
              "subject_name": new_syl.title,
              "image": syl.imgUrl,
              "quiz_topic_completed_count": 0,
              "exam_id": syl.courses,
              "total_qbankTopics_count": syl.count,

            },

          );

        });


        return sub;
      });

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

        let filteredQbankSubjects =  [];
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
          { uuid  },
          { courses:0, questions: 0, createdBy: 0, createdOn: 0, modifiedBy: 0, modifiedOn: 0 }
        )
        .exec().then(

          (result) => {

            result.map(subject => {

              // console.log('result', ft);

              // ft.status = this.userStatus.getUserTestStatus(res, 'test', ft);

              filteredQbankSubjects.map(fqSubject => {

                if(subject.uuid === fqSubject.uuid) {

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

  async findTopicsByUuid(topicUuid: string): Promise<QBankSubject> {

    return this.qbankSubjectModel
    .aggregate([
      { $match: { "chapters.topics.uuid": topicUuid } },
      { $unwind: "$chapters" },
      { $addFields: { "chapters.topics": {
        $filter: {
          input: "$chapters.topics",
          cond: {
            $eq: [
              "$$this.uuid",
              topicUuid
            ]
          }
        },
      }}},
      { $match: {
        "chapters": {
          $ne: []
        }
      }},
      { $project: {
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
      }},
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
}
