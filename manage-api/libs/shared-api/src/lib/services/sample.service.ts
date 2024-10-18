import { BannerInterface } from '@application/api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSampleDTO } from '../dto';
import { Sample } from '../schema/sample.schema';

@Injectable()
export class SampleService {
  constructor(@InjectModel('Sample') private sampleModel: Model<Sample>) {}

  async create(CreateSampleDTO: CreateSampleDTO): Promise<Sample> {
    const createdBanner = new this.sampleModel(CreateSampleDTO);
    const result = createdBanner.save();
    console.log('added banner', result);
    return result;
  }

  async findAll(): Promise<Sample[]> {
    return this.sampleModel.find().exec();
  }

  async findByUuid(uuid: string): Promise<Sample> {
    return this.sampleModel.findOne({ uuid }).exec();
  }

  async findByid(id: string,uuid:string): Promise<Sample> {
    return this.sampleModel.findOne({ id ,uuid }).exec();
  }

  async searchByTitle(title: string): Promise<Sample> {
    // return this.sampleModel.find({"id":{ $regex: '.*' + title + '.*' }},{ "title": { $regex: '.*' + title + '.*' }} ).limit(5);

    // return this.sampleModel.find({ $or: [ { title: title},{id:title} ] });
    // return this.sampleModel.find({ $or: [
    //   { title: { $regex: '.*' + title + '.*' }},
    //   { id:{ $regex: '.*' + title + '.*' }}
    // ] });
    return;
  }
}
