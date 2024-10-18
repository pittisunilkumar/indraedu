import { SubmitUserQBankTopicInterface } from '@application/api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as Uuid from 'uuid';
import { SubmitUserQBankTopicDTO } from '../../../dto';
import { SubmittedQBankTopic, User } from '../../../schema';

@Injectable()
export class SubmitQbankTopicService {

  payload: SubmitUserQBankTopicInterface;

  constructor(
    @InjectModel('SubmittedQBankTopic') private submittedQBankTopicModel: Model<SubmittedQBankTopic>,
    @InjectModel('User') private userModel: Model<User>,
  ) {}

  async SubmittedTest(submitQBankTopicDTO: SubmitUserQBankTopicDTO): Promise<any> {

    this.payload = submitQBankTopicDTO;
    this.payload.uuid = Uuid.v4();
    this.payload.count = submitQBankTopicDTO.answers.length;
    this.compute();
    const submittedTest = new this.submittedQBankTopicModel(this.payload);
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

      if(obj.answer === obj.question.answer) {
        // increment correct marks count
        this.payload.answers[index].flags.correct = true;
        ++this.payload.stats.correct;
      }

      if(obj.answer !== obj.question.answer) {
        // increment wrong marks count
        ++this.payload.stats.wrong;
        this.payload.answers[index].flags.wrong = true;
      }

    });

    this.payload.stats.percentages = {
      correct: (this.payload.stats.correct / this.payload.count) * 100,
      wrong: (this.payload.stats.wrong / this.payload.count) * 100,
    }

  }

  buildStats() {

    this.payload.stats = {
      total: 0,
      correct: 0,
      wrong: 0,
      percentages: {
        correct: 0,
        wrong: 0,
      }
    };

  }

  async computeRanks() {

    const sorted = await this.submittedQBankTopicModel.find(
      {
        'topic.uuid': this.payload.topic.uuid,
        'subject.uuid': this.payload.subject.uuid,
        'course.uuid': this.payload.course.uuid,
      }
    ).sort([ ['stats.total', 'desc'] ])
    .exec();

      const userSubmission = await this.submittedQBankTopicModel.findOne(
        {
          'topic.uuid': this.payload.topic.uuid,
          'subject.uuid': this.payload.subject.uuid,
          'course.uuid': this.payload.course.uuid,
          'user.uuid': this.payload.user.uuid,
        }
      ).exec();

    const userTest = await this.userModel.findOneAndUpdate(
      { uuid: this.payload.user.uuid },
      { $push: { "submissions.qbanks": userSubmission } },
    )
    .exec();

    return { sorted, userSubmission, userTest };

  }

  changeTestState() {

    return this.userModel.findOneAndUpdate(
      { uuid: this.payload.user.uuid },
      { $pull: {
        qbanks: { topic: {
          uuid: this.payload.topic.uuid,
          title: this.payload.topic.title
        } }
      } },
    );

  }

}
