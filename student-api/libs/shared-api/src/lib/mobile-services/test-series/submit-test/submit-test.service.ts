import { SubmitUserTestInterface } from '@application/api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import * as Uuid from 'uuid';
import { SubmitUserTestDTO } from '../../../dto';
import { SubmittedTest, User ,DisableUserForTestSubmit } from '../../../schema';
import { TestResultsService } from '../test-results/test-results.service';

@Injectable()
export class SubmitTestService {

  payload: SubmitUserTestInterface;

  constructor(
    @InjectModel('SubmittedTest') private submittedTestModel: Model<SubmittedTest>,
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('DisableUserForTestSubmit') private disableUserForTestSubmitModel: Model<DisableUserForTestSubmit>,
  ) {}

  async SubmittedTest(submitTestDTO: SubmitUserTestDTO,req): Promise<any> {

    this.payload = submitTestDTO;
    const userSubmission = await this.submittedTestModel.findOne(
      {
        'testSeriesUuid': this.payload.testSeriesUuid,
        'categoryUuid': this.payload.categoryUuid,
        'courseId': this.payload.courseId,
        'userId': this.payload.userId,
      }
    ).exec();
    this.payload.count = submitTestDTO.answers.length;
    this.compute();
    // console.log(userSubmission)
      if(userSubmission){
        if(userSubmission.status == 2){

        }else{
          const result = await this.submittedTestModel.findOneAndUpdate(
            {
              'testSeriesUuid': this.payload.testSeriesUuid,
              'categoryUuid': this.payload.categoryUuid,
              'courseId': this.payload.courseId,
              'userId': this.payload.userId,
            },
            this.payload,
            {new: true, useFindAndModify: false}
          ).exec();
        }
      }else{

        var disableUser = await this.disableUserForTestSubmitModel.findOne({"mobile":req.user.mobile, status:true, submission:true}).exec();
        if(!disableUser){
          this.payload.uuid = Uuid.v4();
          const submittedTest = new this.submittedTestModel(this.payload);
          await submittedTest.save();
        }else{
          return { submission: [] };
        }
      }

    return await this.changeTestState().then(() => {

      return this.computeRanks().then((res) => {
        return res;
      });

    });

  }

  compute() {

    this.buildStats();

    this.payload.answers.map((obj, index) => {

      if(this.payload.answers[index].flags.attempted == true) {
        // this.payload.answers[index].flags.attempted = true;
        ++this.payload.stats.attempted;
      }

      if(this.payload.answers[index].flags.markForReview == true) {
        this.payload.answers[index].flags.markForReview = true;
        ++this.payload.stats.review;
      }else{
        this.payload.answers[index].flags.markForReview = false;
      }
      if(this.payload.answers[index].flags.isBookMarked == true) {
        this.payload.answers[index].flags.isBookMarked = true;
        ++this.payload.stats.bookmarkCount;
      }else{
        this.payload.answers[index].flags.isBookMarked = false;
      }
      if(this.payload.answers[index].flags.skipped == true) {
        // increment skipped count
        this.payload.stats.skippedMarks
        = this.payload.stats.skippedMarks + (obj.question.positive);

        this.payload.answers[index].flags.skipped = true;
        ++this.payload.stats.skipped;
      }else{
        this.payload.answers[index].flags.skipped = false;
      }

      if(obj.answer === obj.question.answer) {
        // increment correct marks count
        this.payload.answers[index].flags.correct = true;
        ++this.payload.stats.correct;
        if(obj.flags.markAsGuessed) {
          this.payload.stats.markAsGuessedMarks
          = this.payload.stats.markAsGuessedMarks + (obj.question.positive);

          // increment correct guessed marks count
        this.payload.answers[index].flags.markAsGuessed = true;
        this.payload.answers[index].flags.guessedCorrect = true;
          ++this.payload.stats.guessed.correct;
          ++this.payload.stats.guessed.total;
          ++this.payload.stats.markAsGuessed;
        }
        // compute total marks by each question positive marks
        if(obj.question.positive) {
          this.payload.stats.correctMarks
            = this.payload.stats.correctMarks + (obj.question.positive);

          this.payload.stats.secureMarks
            = this.payload.stats.secureMarks + (obj.question.positive);
        } else {
          this.payload.stats.secureMarks = this.payload.stats.correct;
        }
      }

      if(obj.answer !== obj.question.answer && obj.flags.skipped != true) {
        // increment wrong marks count
        ++this.payload.stats.wrong;
        this.payload.answers[index].flags.wrong = true;
        if(obj.flags.markAsGuessed) {
          this.payload.stats.markAsGuessedMarks
            = this.payload.stats.markAsGuessedMarks + (obj.question.positive);

          // increment wrong guessed marks count
        this.payload.answers[index].flags.markAsGuessed = true;
        this.payload.answers[index].flags.guesssedWrong = true;
          ++this.payload.stats.guessed.wrong;
          ++this.payload.stats.guessed.total;
          ++this.payload.stats.markAsGuessed;
        }
        // compute total marks by each question negative marks
        this.payload.stats.wrongMarks
        = this.payload.stats.wrongMarks + (obj.question.positive);

        if(obj.question.negative) {
          this.payload.stats.secureMarks
            = this.payload.stats.secureMarks - (obj.question.negative);
        }
      }

      this.payload.stats.totalMarks =this.payload.stats.totalMarks + obj.question.positive;

      // if(obj.flags.skipped) {
      //   // increment skipped count
      //   this.payload.stats.skippedMarks
      //   = this.payload.stats.skippedMarks + (obj.question.positive);

      //   this.payload.answers[index].flags.skipped = true;
      //   ++this.payload.stats.skipped;
      // }

    });

    this.payload.stats.percentages = {
      correct: (this.payload.stats.correct / this.payload.count) * 100,
      wrong: (this.payload.stats.wrong / this.payload.count) * 100,
      skipped: (this.payload.stats.skipped / this.payload.count) * 100,
      guessedTotal: (this.payload.stats.guessed.total / this.payload.count) * 100,
    }

  }

  buildStats() {

    this.payload.stats = {
      secureMarks: 0,
      totalMarks:0,
      correct: 0,
      correctMarks: 0,
      wrong: 0,
      wrongMarks: 0,
      skipped: 0,
      skippedMarks: 0,
      attempted : 0,
      markAsGuessed : 0,
      markAsGuessedMarks : 0,
      bookmarkCount : 0,
      review : 0,
      guessed: {
        total: 0,
        correct: 0,
        wrong: 0,
      },
      percentages: {
        correct: 0,
        wrong: 0,
        skipped: 0,
        guessedTotal: 0,
      }
    };

  }

  async computeRanks() {
    var  today = new Date();
    const sorted = await this.submittedTestModel.find(
      {
        'testSeriesUuid': this.payload.testSeriesUuid,
        'categoryUuid': this.payload.categoryUuid,
        'courseId': this.payload.courseId,
      }
    )
    // .sort([ ['stats.secureMarks', 'desc'] ])
    .exec();

    const ranks = await this.submittedTestModel
      .updateMany(
        {
          'testSeriesUuid': this.payload.testSeriesUuid,
          'categoryUuid': this.payload.categoryUuid,
          'courseId': this.payload.courseId,
        },
        { $set: {
          totalUsers: sorted.length,
        } }
      )
      .exec();
      // const analysis = sorted.filter((it, index) => {
      //   it.rank = index + 1;
      //   // console.log(it.userId,this.payload.userId)
      //   return it.userId.toString() === this.payload.userId.toString()
      // });

      const userSubmission = await this.submittedTestModel.findOne(
        {
          'testSeriesUuid': this.payload.testSeriesUuid,
          'categoryUuid': this.payload.categoryUuid,
          'courseId': this.payload.courseId,
          'userId': this.payload.userId,
        }
      ).exec();

    // const userTest = await this.userModel.findOneAndUpdate(
    //   { uuid: this.payload.userId },
    //   { $push: { "submissions.tests": userSubmission } },
    // )
    // .exec();
    // const userTestSubmissionPull =  await this.userModel
    // .findOneAndUpdate(
    //   { _id: mongoose.Types.ObjectId(this.payload.userId) },
    //   {
    //     $pull: {
    //        "submissions.tests":
    //        {"testSeriesUuid": this.payload.testSeriesUuid } ,
    //      },
    //   },
    //   {new: true, useFindAndModify: false}).exec();

    // const userTest = await this.userModel.findOneAndUpdate(
    //   { _id:  this.payload.userId },
    //   { $push: { "submissions.tests": userSubmission } },
    //   {new: true, useFindAndModify: false}).exec();
      // console.log(userTest)


      var userdataSubmittedTestSeriesStatus = await this.userModel
      .aggregate([
        { $match:{'_id': mongoose.Types.ObjectId(this.payload.userId)}},
        { $unwind: "$testSeriesSubmissions" },
        {
          $match: {
            "testSeriesSubmissions.testSeriesUuid": this.payload.testSeriesUuid
          }
        },
        {
          $project: {
            "_id":0,
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
            return ;
          }
        }
      );
      // if(userSubmission.status != 2){
            var testPull = await this.userModel
            .findOneAndUpdate(
              { _id: mongoose.Types.ObjectId(this.payload.userId) },
              {
                $pull: {
                  "testSeriesSubmissions":
                  {"testSeriesUuid": this.payload.testSeriesUuid } ,
                },
              },
              {new: true, useFindAndModify: false}).exec();

              userdataSubmittedTestSeriesStatus.status = this.payload.status;
              userdataSubmittedTestSeriesStatus.completedMcq = this.payload.stats.attempted;
              userdataSubmittedTestSeriesStatus.stoppedAt = today;

            var teststart =  await this.userModel.findOneAndUpdate(
              { _id: this.payload.userId },
              {
                $addToSet: {
                  "testSeriesSubmissions":  userdataSubmittedTestSeriesStatus
                }
              },
              {new: true, useFindAndModify: false}
            ).exec().then(
              (res) => {
                return res.testSeriesSubmissions;
              },
              (err) => {
                return err;
              }
            )
      // }

      // const submission =  await this.userModel.findOneAndUpdate(
      //   { _id: this.payload.userId },
      //   {
      //     $addToSet: {
      //       "testSeriesSubmissions":  {
      //         testSeriesUuid: this.payload.testSeriesUuid,
      //         status: this.payload.status,
      //         startedAt: this.payload.startedAt,
      //         stoppedAt: this.payload.stoppedAt,
      //       }
      //     }
      //   },
      //   {new: true, useFindAndModify: false}
      // ).exec();


    return { submission: userdataSubmittedTestSeriesStatus };
    // return { sorted : sorted.slice(0, 10) , submission, userTest };

  }

  changeTestState() {

    return this.userModel.findOneAndUpdate(
      { _id: this.payload.userId },
      { $pull: {
        tests: {
          testSeriesUuid: this.payload.testSeriesUuid
        }
      } },
      {new: true, useFindAndModify: false}).exec();

  }

}
