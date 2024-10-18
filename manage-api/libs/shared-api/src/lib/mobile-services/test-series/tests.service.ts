import { EntityStatusEnum } from '@application/api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ReportErrorDTO, StartTestDTO } from '../../dto';
import { StopTestDTO } from '../../dto/stop-test.dto';
import { UserStatusService } from '../../helpers';
import { ReportError, Test, User } from '../../schema';

@Injectable()
export class MobileTestsService {

  constructor(
    private userStatus: UserStatusService,
    @InjectModel('Test') private testModel: Model<Test>,
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('ReportError') private reportErrorModel: Model<ReportError>
  ) {}

  async findAll(): Promise<Test[]> {
    return this.testModel
      .find()
      .populate('courses')
      .populate('categories')
      .populate('syllabus')
      .exec();
  }

  async findAllTestsByCatId(catId: string, query) : Promise<any> {

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
    )
    .exec().then(

      res => {

        // console.log('tests', res?.submissions.tests);

        const filteredTests =  [];
        res?.subscriptions.map(it => {

          return it.tests.map(test => {
            if(test.categories.filter(cat => {
              // console.log(cat._id, catId, cat._id == catId);
              // == since we are comparing ObjectId
              // tslint:disable-next-line: triple-equals
              return cat._id == catId; }).length) {
              filteredTests.push(test);
            }
          });
        });

        // console.log({ filteredTests });

        return this.testModel
        .find(
          { categories: catId  },
          { courses:0, questions: 0, createdBy: 0, createdOn: 0, modifiedBy: 0, modifiedOn: 0 }
        )
        .populate({
          path: 'categories',
          select: '_id uuid title'
        })
        .exec().then(

          (result) => {

            result.map(ft => {

              // console.log('result', ft);
              const userStatus = this.userStatus.getUserTestStatus(res, ft);

              ft.status = userStatus.testStatus;
              ft.startedAt = userStatus.startedAt;
              ft.stoppedAt = userStatus.stoppedAt;

              filteredTests.map(ftt => {
                if(ft.uuid === ftt.uuid) {
                  ft.flags = {
                    active: ft.flags.active,
                    subscribed: true,
                    suggested: ft.flags.suggested,
                    editable: ft.flags.editable,
                  }

                }
              })
            });

            return result;

          }
        )
      }
    );

  }

  async findByUuid(uuid: string): Promise<Test> {
    return this.testModel
    .findOne(
      { uuid },
      { uuid: 1, title: 1, imgUrl: 1, description: 1, time: 1, count: 1, pdf: 1,
        'questions.que.answer': 1,
        'questions.que.options': 1,
        'questions.que._id': 1,
        'questions.que.uuid': 1,
        'questions.que.title': 1,
        'questions.que.difficulty': 1,
        'questions.que.previousAppearances': 1,
        'questions.que.tags': 1,
        'questions.isSelected': 1,
        'questions.positive': 1,
        'questions.negative': 1,
        'questions.order': 1
      }
    )
    .exec();
  }

  async findByCourse(courseId: string): Promise<Test[]> {
    return this.testModel
    .find({ courses: courseId }, { id: 1, uuid: 1, title: 1})
    .exec();
  }

  //============ START TEST ============

  async startTest(testUuid: string, userUuid: string, startTestDTO: StartTestDTO): Promise<any> {

    return this.userModel.findOneAndUpdate(
      { uuid: userUuid },
      {
        $addToSet: {
          "tests":  {
            test: startTestDTO.test,
            category: startTestDTO.category,
            course: startTestDTO.course,
            subject: startTestDTO.subject,
            totalTime: startTestDTO.totalTime,
            expiryDate: startTestDTO.expiryDate,
            status: startTestDTO.status,
            startedAt: startTestDTO.startedAt,
          }
        }
      },
    ).exec().then(
      (res) => {
        return res.tests;
      },
      (err) => {
        return err;
      }
    )

  }

  //============ CALCULATE TEST ELAPSED MINUTES ============

  async calculateUserTestElapsedtime(testUuid: string, userUuid: string): Promise<any> {

    return this.userModel
    .aggregate([
      { $match: { uuid: userUuid } },
      { $unwind: "$tests" },
      {
        $match: {
          "tests.test.uuid": testUuid
        }
      },
      {
        $project: {
          "tests": 1,
        }
      },
    ])
    .exec()
    .then(
      (res) => {

        if(res[0]?.tests) {

          const startDate = new Date(res[0].tests?.startedAt);
          const today = new Date();

          const timeDiff = today.getTime() - startDate.getTime();
          const mins = Math.floor(timeDiff / (1000 * 60));

          // Debugging
          // console.log(hours+':'+mins);
          // console.log(res[0].tests?.totalTime / 60);
          // console.log(today.getTime() > startDate.getTime());

          let leftOverTime;

          if(mins > res[0].tests?.totalTime) {
            leftOverTime = 0;
          } else {
            leftOverTime = res[0].tests?.totalTime - mins;
          }

          return { leftOverTime }

        } else {
          return 'Test not found';
        }
      },
      (err) => {
        return err;
      }
    )

  }

  //============ STOP TEST ============

  async stopTest(testUuid: string, userUuid: string, stopTestDTO: StopTestDTO): Promise<any> {

    return this.userModel.findOneAndUpdate(
      { uuid: userUuid,  },
      // filter and replace the object
      {
        $set : { "tests.$[elem]": stopTestDTO },
      },
      { arrayFilters: [ { "elem.test.uuid": { $eq: testUuid } } ] },
    ).exec().then(
      (res) => {
        return res.tests;
      },
      (err) => {
        return err;
      }
    )

  }

  //============ REPORT ERROR =====================

  async reportError(reportErrorDTO: ReportErrorDTO): Promise<ReportError> {

    const reportError = new this.reportErrorModel(reportErrorDTO);
    const result = reportError.save();
    return result;

  }

}
