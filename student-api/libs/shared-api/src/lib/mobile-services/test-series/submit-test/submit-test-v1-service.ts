import { SubmitUserTestInterface } from '@application/api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import * as Uuid from 'uuid';
import { DisableUserForTestSubmit, SubmittedTest, User } from '../../../schema';

@Injectable()
export class SubmitTestServiceV1 {
  payload: SubmitUserTestInterface;

  constructor(
    @InjectModel('SubmittedTest')
    private submittedTestModel: Model<SubmittedTest>,
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('DisableUserForTestSubmit')
    private disableUserForTestSubmitModel: Model<DisableUserForTestSubmit>
  ) {}

  async SubmittedTestV1(submitTestDTO, req): Promise<any> {
    this.payload = submitTestDTO;

    const submissionData = {
      testSeriesUuid: this.payload.testSeriesUuid,
      categoryUuid: this.payload.categoryUuid,
      courseId: this.payload.courseId,
      subjectId: this.payload.subjectId,
      totalTime: 210,
      expiryDate: new Date(),
      status: this.payload.status,
      runningStatus: 0,
      deviceType: 'mobile',
      startedAt: new Date(),
      completedMcq: 0,
      stoppedAt: new Date(),
    };

    //Check User Submitted or Not
    this.payload.count = submitTestDTO.answers.length;
    //To Create Default Statistics

    var disableUser = await this.disableUserForTestSubmitModel
      .findOne({ mobile: req.user.mobile, status: true })
      .exec();
    if (!disableUser) {
      this.payload.uuid = Uuid.v4();
      await this.updateUserTestStatus();

      const checktestSubmitted = await this.submittedTestModel
        .findOne({
          testSeriesUuid: this.payload.testSeriesUuid,
          categoryUuid: this.payload.categoryUuid,
          courseId: this.payload.courseId,
          userId: this.payload.userId,
        })
        .exec();
      this.payload.stats = {
        secureMarks: 0,
        totalMarks: 0,
        correct: 0,
        correctMarks: 0,
        wrong: 0,
        wrongMarks: 0,
        skipped: 0,
        skippedMarks: 0,
        attempted: 0,
        markAsGuessed: 0,
        markAsGuessedMarks: 0,
        bookmarkCount: 0,
        review: 0,
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
        },
      };
      if (checktestSubmitted) {
        const result = await this.submittedTestModel
          .findOneAndUpdate(
            {
              testSeriesUuid: this.payload.testSeriesUuid,
              categoryUuid: this.payload.categoryUuid,
              courseId: this.payload.courseId,
              userId: this.payload.userId,
            },
            { stats: this.payload.stats },
            { new: true, useFindAndModify: false }
          )
          .exec();
      } else {
        const result = new this.submittedTestModel(this.payload);
        await result.save();
      }
      this.updateCalculateUserTestRanks(this.payload);
    }
    return { submission: submissionData };
  }

  async compute() {
    await this.buildStats();

    /// await added for result purpose
    await Promise.all(
      this.payload.answers.map((obj, index) => {
        if (this.payload.answers[index].flags.attempted == true) {
          // this.payload.answers[index].flags.attempted = true;
          ++this.payload.stats.attempted;
        }

        if (this.payload.answers[index].flags.markForReview == true) {
          this.payload.answers[index].flags.markForReview = true;
          ++this.payload.stats.review;
        } else {
          this.payload.answers[index].flags.markForReview = false;
        }
        if (this.payload.answers[index].flags.isBookMarked == true) {
          this.payload.answers[index].flags.isBookMarked = true;
          ++this.payload.stats.bookmarkCount;
        } else {
          this.payload.answers[index].flags.isBookMarked = false;
        }

        if (obj.answer === obj.question.answer) {
          // increment correct marks count
          this.payload.answers[index].flags.correct = true;
          ++this.payload.stats.correct;
          if (obj.flags.markAsGuessed) {
            this.payload.stats.markAsGuessedMarks =
              this.payload.stats.markAsGuessedMarks + obj.question.positive;

            // increment correct guessed marks count
            this.payload.answers[index].flags.markAsGuessed = true;
            this.payload.answers[index].flags.guessedCorrect = true;
            ++this.payload.stats.guessed.correct;
            ++this.payload.stats.guessed.total;
            ++this.payload.stats.markAsGuessed;
          }
          // compute total marks by each question positive marks
          if (obj.question.positive) {
            this.payload.stats.correctMarks =
              this.payload.stats.correctMarks + obj.question.positive;

            this.payload.stats.secureMarks =
              this.payload.stats.secureMarks + obj.question.positive;
          } else {
            this.payload.stats.secureMarks = this.payload.stats.correct;
          }
        }

        if (obj.answer !== obj.question.answer && obj.flags.skipped != true) {
          // increment wrong marks count
          ++this.payload.stats.wrong;
          this.payload.answers[index].flags.wrong = true;
          if (obj.flags.markAsGuessed) {
            this.payload.stats.markAsGuessedMarks =
              this.payload.stats.markAsGuessedMarks + obj.question.positive;

            // increment wrong guessed marks count
            this.payload.answers[index].flags.markAsGuessed = true;
            this.payload.answers[index].flags.guesssedWrong = true;
            ++this.payload.stats.guessed.wrong;
            ++this.payload.stats.guessed.total;
            ++this.payload.stats.markAsGuessed;
          }
          // compute total marks by each question negative marks
          this.payload.stats.wrongMarks =
            this.payload.stats.wrongMarks + obj.question.positive;

          if (obj.question.negative) {
            this.payload.stats.secureMarks =
              this.payload.stats.secureMarks - obj.question.negative;
          }
        } else if (obj.answer !== obj.question.answer && obj.answer != 0) {
          ++this.payload.stats.wrong;
          this.payload.answers[index].flags.wrong = true;
          if (obj.flags.markAsGuessed) {
            this.payload.stats.markAsGuessedMarks =
              this.payload.stats.markAsGuessedMarks + obj.question.positive;

            // increment wrong guessed marks count
            this.payload.answers[index].flags.markAsGuessed = true;
            this.payload.answers[index].flags.guesssedWrong = true;
            ++this.payload.stats.guessed.wrong;
            ++this.payload.stats.guessed.total;
            ++this.payload.stats.markAsGuessed;
          }
          // compute total marks by each question negative marks
          this.payload.stats.wrongMarks =
            this.payload.stats.wrongMarks + obj.question.positive;

          if (obj.question.negative) {
            this.payload.stats.secureMarks =
              this.payload.stats.secureMarks - obj.question.negative;
          }
        }

        this.payload.stats.totalMarks =
          this.payload.stats.totalMarks + obj.question.positive;

        if (obj.flags.skipped) {
          // increment skipped count
          this.payload.stats.skippedMarks =
            this.payload.stats.skippedMarks + obj.question.positive;

          this.payload.answers[index].flags.skipped = true;
          ++this.payload.stats.skipped;
        }
      })
    );

    //NEW code to add skipped marks
    this.payload.stats.skipped =
      this.payload.count - this.payload.stats.attempted;
    this.payload.stats.skippedMarks =
      this.payload.stats.totalMarks -
      (this.payload.stats.correctMarks + this.payload.stats.wrongMarks);

    this.payload.stats.percentages = {
      correct: (this.payload.stats.correct / this.payload.count) * 100,
      wrong: (this.payload.stats.wrong / this.payload.count) * 100,
      skipped: (this.payload.stats.skipped / this.payload.count) * 100,
      guessedTotal:
        (this.payload.stats.guessed.total / this.payload.count) * 100,
    };
  }

  async buildStats() {
    this.payload.stats = {
      secureMarks: 0,
      totalMarks: 0,
      correct: 0,
      correctMarks: 0,
      wrong: 0,
      wrongMarks: 0,
      skipped: 0,
      skippedMarks: 0,
      attempted: 0,
      markAsGuessed: 0,
      markAsGuessedMarks: 0,
      bookmarkCount: 0,
      review: 0,
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
      },
    };
  }

  async computeRanks() {
    var today = new Date();
    const count = await this.submittedTestModel
      .find({
        testSeriesUuid: this.payload.testSeriesUuid,
        categoryUuid: this.payload.categoryUuid,
      })
      .countDocuments();

    const ranks = await this.submittedTestModel
      .updateMany(
        {
          testSeriesUuid: this.payload.testSeriesUuid,
          categoryUuid: this.payload.categoryUuid,
        },
        {
          $set: {
            totalUsers: count,
          },
        }
      )
      .exec();

    var userdataSubmittedTestSeriesStatus = await this.userModel
      .aggregate([
        { $match: { _id: mongoose.Types.ObjectId(this.payload.userId) } },
        { $unwind: '$testSeriesSubmissions' },
        {
          $match: {
            'testSeriesSubmissions.testSeriesUuid': this.payload.testSeriesUuid,
          },
        },
        {
          $project: {
            _id: 0,
            testSeriesSubmissions: 1,
          },
        },
      ])
      .exec()
      .then((res) => {
        if (res[0]?.testSeriesSubmissions) {
          var v = res[0]?.testSeriesSubmissions;
          return v;
        }
        (err) => {
          return;
        };
      });

    userdataSubmittedTestSeriesStatus.status = this.payload.status;
    userdataSubmittedTestSeriesStatus.runningStatus = 0;
    userdataSubmittedTestSeriesStatus.completedMcq = this.payload?.stats
      ?.attempted
      ? this.payload.stats.attempted
      : 0;
    userdataSubmittedTestSeriesStatus.stoppedAt = today;

    console.log(this.payload.stats, 'Stats');

    // await this.userModel.updateOne(
    //   {
    //     _id: this.payload.userId,
    //     'testSeriesSubmissions.testSeriesUuid': this.payload.testSeriesUuid,
    //   },
    //   {
    //     $set: {
    //       'testSeriesSubmissions.$.status': this.payload.status,
    //       'testSeriesSubmissions.$.runningStatus':
    //         this.payload.status == 2 ? 0 : 1,
    //       'testSeriesSubmissions.$.completedMcq': this.payload.stats.attempted,
    //       'testSeriesSubmissions.$.stoppedAt': today,
    //     },
    //   }
    // );

    return { submission: userdataSubmittedTestSeriesStatus };
  }

  async changeTestState() {
    return [];
  }

  async chageUserTestStatus() {
    const result = await this.submittedTestModel
      .findOneAndUpdate(
        {
          testSeriesUuid: this.payload.testSeriesUuid,
          categoryUuid: this.payload.categoryUuid,
          courseId: this.payload.courseId,
          userId: this.payload.userId,
        },
        { status: this.payload.status },
        { new: true, useFindAndModify: false }
      )
      .exec();

    const status = await this.userModel.updateOne(
      {
        _id: this.payload.userId,
        'testSeriesSubmissions.testSeriesUuid': this.payload.testSeriesUuid,
      },
      {
        $set: {
          'testSeriesSubmissions.$.status': this.payload.status,
          'testSeriesSubmissions.$.runningStatus':
            this.payload.status == 2 ? 0 : 1,
          'testSeriesSubmissions.$.completedMcq': this.payload?.stats?.attempted
            ? this.payload.stats.attempted
            : 0,
          'testSeriesSubmissions.$.stoppedAt': new Date(),
        },
      }
    );

    console.log('user Model 1 Update ', this.payload.status);
    return status;
  }

  async updateUserTestStatus() {
    var status = 2;
    if (this.payload.status == 1) {
      status = 1;
    }
    console.log('user Model 2 Update ', status);

    return await this.userModel.updateOne(
      {
        _id: this.payload.userId,
        'testSeriesSubmissions.testSeriesUuid': this.payload.testSeriesUuid,
      },
      {
        $set: {
          'testSeriesSubmissions.$.status': status,
          'testSeriesSubmissions.$.runningStatus':
            this.payload.status == 2 ? 0 : 1,
          'testSeriesSubmissions.$.completedMcq': this.payload.answers.length,
          'testSeriesSubmissions.$.stoppedAt': new Date(),
        },
      }
    );
  }

  async updateCalculateUserTestRanks(body: any) {
    console.log('Background Calculation Started');
    this.payload = body;

    this.payload = {
      answers: body.answers,
      categoryUuid: body.categoryUuid,
      courseId: body.courseId,
      startedAt: body.submittedOn,
      status: body.status,
      stoppedAt: body.submittedOn,
      subjectId: body.subjectId,
      submittedOn: new Date(),
      count: body.answers.length,
      testSeriesUuid: body.testSeriesUuid,
      userId: body.userId,
      uuid: Uuid.v4(),
      // attempt: body.answers.length,
      rank: 0,
      totalUsers: 0,
    };
    await this.compute();
    const checktestSubmitted = await this.submittedTestModel
      .findOne({
        testSeriesUuid: this.payload.testSeriesUuid,
        categoryUuid: this.payload.categoryUuid,
        courseId: this.payload.courseId,
        userId: this.payload.userId,
      })
      .exec();

    let result = [];
    if (checktestSubmitted) {
      const result = await this.submittedTestModel
        .findOneAndUpdate(
          {
            testSeriesUuid: this.payload.testSeriesUuid,
            categoryUuid: this.payload.categoryUuid,
            courseId: this.payload.courseId,
            userId: this.payload.userId,
          },
          { answers: this.payload.answers, stats: this.payload.stats },
          { new: true, useFindAndModify: false }
        )
        .exec();
    } else {
      const result = new this.submittedTestModel(this.payload);
      await result.save();
    }

    await this.chageUserTestStatus();
    await this.changeTestState().then(async () => {
      await this.computeRanks().then((res) => {
        console.log('Background Calculation End');
      });
    });
  }
}
