import { Feedbacks } from '@application/shared-api';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { feedbackUsersRatingInterface } from '@application/api-interfaces';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectModel('Feedbacks') private feedbackModel: Model<Feedbacks>
  ) {}

  async createFeedback(request) {
    const createdState = new this.feedbackModel(request);
    const result = createdState.save();
    return result;
  }

  async getFeedbacks() {
    let averageRating;
    let FeedbacksList = [];
    let res: feedbackUsersRatingInterface | any;
    let Feedbacks = await this.feedbackModel
      .find()
      .populate({
        path: 'course',
        select: {
          _id: 1,
          uuid: 1,
          title: 1,
        },
      })
      .exec();
    Feedbacks.map(async (res, i) => {
      if (res.replies.length) {
        let count = 0;
        res.replies.map((rat) => {
          count = count + rat.rating;
        });
        averageRating = count / res.replies.length;
        console.log(count, res.replies.length, averageRating);
      }
      let data = {
        // users: res?.users?.length,
        course: res.course,
        _id: res._id,
        uuid: res.uuid,
        title: res.title,
        feedback_type:res.feedback_type,
        createdOn: res.createdOn,
        createdBy: res.createdBy,
        flags: res.flags,
        modifiedBy: res?.modifiedBy,
        modifiedOn: res?.modifiedOn,
        averageRating: res.replies.length ? averageRating : '',
        repliesCount: res.replies.length ? res.replies.length : 0,
      };
      FeedbacksList.push(data);
    });
    //     for await (let  index = 0; index < Feedbacks.length; index++) {
    //          res = Feedbacks[index].replies;
    //          console.log('resresresresresresresres', Feedbacks[index].replies);

    //         Feedbacks[index].replies.map(rat => {
    //             count += rat.rating;
    //         })
    //         console.log('countcount',count);

    //   }
    return FeedbacksList;
  }

  async getActiveFeedbacks() {
    return await this.feedbackModel
      .find({ flags: { active: true } }, { _id: 1, uuid: 1, title: 1 })
      .exec();
  }

  async findFeedback(uuid: string) {
    return await this.feedbackModel
      .findOne({ uuid })
      .populate({
        path: 'course',
        select: {
          _id: 1,
          uuid: 1,
          title: 1,
        },
      })
      .populate({
        path: 'users',
        select: {
          _id: 1,
          uuid: 1,
          name: 1,
          mobile: 1,
        },
      })
      .populate({
        path: 'replies',
        populate:{
            path:'user_id',
            select: {
                _id: 1,
                uuid: 1,
                name: 1,
                mobile: 1,
              },
        }
        
      })
      .exec();
  }

  async deleteFeedback(id: string) {
    return await this.feedbackModel.findOneAndDelete({ _id: id }).exec();
  }

  async updateFeedback(request) {
    return this.feedbackModel
      .findOneAndUpdate({ uuid: request.uuid }, request)
      .exec();
  }
}
