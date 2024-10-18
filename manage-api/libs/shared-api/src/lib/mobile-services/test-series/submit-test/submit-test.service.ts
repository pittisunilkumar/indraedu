import { SubmitUserTestInterface } from '@application/api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as Uuid from 'uuid';
import { SubmitUserTestDTO } from '../../../dto';
import { SubmittedTest, User } from '../../../schema';
import { TestResultsService } from '../test-results/test-results.service';

@Injectable()
export class SubmitTestService {

  payload: SubmitUserTestInterface;

  constructor(
    @InjectModel('SubmittedTest') private submittedTestModel: Model<SubmittedTest>,
    @InjectModel('User') private userModel: Model<User>,
  ) {}

  async SubmittedTest(submitTestDTO: SubmitUserTestDTO): Promise<any> {

    this.payload = submitTestDTO;
    this.payload.uuid = Uuid.v4();
    this.payload.count = submitTestDTO.answers.length;
    this.compute();
    const submittedTest = new this.submittedTestModel(this.payload);
    await submittedTest.save();

    return await this.changeTestState().then(() => {

      return this.computeRanks().then((res) => {
        return res;
      });

    });

  }

  compute() {

    this.buildStats();

    this.payload.answers.map((obj, index) => {

      if(obj.answer) {
        this.payload.answers[index].flags.attempted = true;
      }

      if(obj.answer === obj.question.answer) {
        // increment correct marks count
        this.payload.answers[index].flags.correct = true;
        ++this.payload.stats.correct;
        if(obj.flags.markAsGuessed) {
          // increment correct guessed marks count
        this.payload.answers[index].flags.markAsGuessed = true;
        this.payload.answers[index].flags.guessedCorrect = true;
          ++this.payload.stats.guessed.correct;
          ++this.payload.stats.guessed.total;
        }
        // compute total marks by each question positive marks
        if(obj.question.positive) {
          this.payload.stats.total
            = this.payload.stats.total + (this.payload.stats.correct * obj.question.positive);
        } else {
          this.payload.stats.total = this.payload.stats.correct;
        }
      }

      if(obj.answer !== obj.question.answer) {
        // increment wrong marks count
        ++this.payload.stats.wrong;
        this.payload.answers[index].flags.wrong = true;
        if(obj.flags.markAsGuessed) {
          // increment wrong guessed marks count
        this.payload.answers[index].flags.markAsGuessed = true;
        this.payload.answers[index].flags.guesssedWrong = true;
          ++this.payload.stats.guessed.wrong;
          ++this.payload.stats.guessed.total;
        }
        // compute total marks by each question negative marks
        if(obj.question.negative) {
          this.payload.stats.total
            = this.payload.stats.total - (this.payload.stats.wrong * obj.question.negative);
        }
      }

      if(obj.flags.skipped) {
        // increment skipped count
        this.payload.answers[index].flags.skipped = true;
        ++this.payload.stats.skipped;
      }

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
      total: 0,
      correct: 0,
      wrong: 0,
      skipped: 0,
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

    const sorted = await this.submittedTestModel.find(
      {
        'test.uuid': this.payload.test.uuid,
        'category.uuid': this.payload.category.uuid,
        'course.uuid': this.payload.course.uuid,
      }
    ).sort([ ['stats.total', 'desc'] ])
    .exec();

    const ranks = await this.submittedTestModel
      .updateMany(
        {
          'test.uuid': this.payload.test.uuid,
          'category.uuid': this.payload.category.uuid,
          'course.uuid': this.payload.course.uuid,
        },
        { $set: {
          totalUsers: sorted.length,
        } }
      )
      .exec();

      const userSubmission = await this.submittedTestModel.findOne(
        {
          'test.uuid': this.payload.test.uuid,
          'category.uuid': this.payload.category.uuid,
          'course.uuid': this.payload.course.uuid,
          'user.uuid': this.payload.user.uuid,
        }
      ).exec();

    const userTest = await this.userModel.findOneAndUpdate(
      { uuid: this.payload.user.uuid },
      { $push: { "submissions.tests": userSubmission } },
    )
    .exec();

    return { sorted, ranks, userSubmission, userTest };

  }

  changeTestState() {

    return this.userModel.findOneAndUpdate(
      { uuid: this.payload.user.uuid },
      { $pull: {
        tests: { test: {
          uuid: this.payload.test.uuid,
          title: this.payload.test.title
        } }
      } },
    );

  }

}
