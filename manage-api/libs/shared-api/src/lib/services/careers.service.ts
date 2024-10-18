import { CareerInterface } from '@application/api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateJobDTO } from '../dto';
import { Career } from '../schema/career.schema';

@Injectable()
export class CareersService {

  constructor(
    @InjectModel('Career') private aboutUsModel: Model<Career>
  ) {}

  async createJob(payload: CreateJobDTO): Promise<Career> {
    const result = new this.aboutUsModel(payload);
    console.log({ result });

    return result.save();
  }

  async updateOne(request: CareerInterface): Promise<Career> {
    return this.aboutUsModel.findOneAndUpdate({ uuid: request.uuid }, request).exec();
  }

  async findAll(): Promise<Career[]> {
    return this.aboutUsModel.find().exec();
  }

  async findOne(uuid: string): Promise<Career> {
    return this.aboutUsModel.findOne({ uuid }).exec();
  }

  async deleteOne(uuid: string): Promise<Career> {
    return this.aboutUsModel.findOneAndDelete({ uuid }).exec();
  }

}
