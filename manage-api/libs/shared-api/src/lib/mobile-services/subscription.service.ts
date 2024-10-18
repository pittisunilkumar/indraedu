import { SubscriptionInterface } from '@application/api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Query } from 'mongoose';
import { CreateSubscriptionDto } from '../dto';
import { Subscription } from '../schema/subscription.schema';

@Injectable()
export class MobileSubscriptionService {
  constructor(
    @InjectModel('Subscription') private subscriptionModel: Model<Subscription>
  ) {}

  async findAll(): Promise<Subscription[]> {
    return this.subscriptionModel
      .find()
      .select({ createdOn: 0, modifiedOn: 0, createdBy: 0, modifiedBy: 0 })
      .populate({
        path: 'courses',
        select: '_id uuid title'
      })
      .populate({
        path: 'videos',
        select: '_id uuid title'
      })
      .populate({
        path: 'tests',
        select: '_id uuid title'
      })
      .populate({
        path: 'qbanks',
        select: '_id uuid title'
      })
      .exec();
  }

  async findByUuid(uuid: string, query): Promise<Subscription> {

    console.log(query);

    return this.subscriptionModel
      .findOne({ uuid })
      .select({ createdOn: 0, modifiedOn: 0, createdBy: 0, modifiedBy: 0 })
      .populate({
        path: 'videos',
        select: '_id uuid title',
        match: { courses: query?.courseId }
      })
      .populate({
        path: 'tests',
        select: '_id uuid title'
      })
      .populate({
        path: 'qbanks',
        select: '_id uuid title'
      })
      .exec();
  }

  // async updateAssignments(result: Subscription) {
  //   result?.parents?.forEach(par => {
  //     if(par){
  //       this.subscriptionModel.findByIdAndUpdate(
  //         {_id: par},
  //         { $push: { children: result._id } }
  //       ).exec();
  //     }
  //   });
  //   result?.children?.forEach(chi => {
  //     if(chi){
  //       this.subscriptionModel.findByIdAndUpdate(
  //         {_id: chi},
  //         { $push: { parents: result._id } }
  //       ).exec();
  //     }
  //   });
  // }
}
